import torch
import torch.nn as nn
import torch.nn.functional as F

class WaveGlow(nn.Module):
    def __init__(self, n_flows, n_group, n_early_every, n_early_size, n_mel_channels, n_hidden):
        super(WaveGlow, self).__init__()
        self.n_flows = n_flows
        self.n_group = n_group
        self.n_early_every = n_early_every
        self.n_early_size = n_early_size

        self.upsample = nn.ConvTranspose1d(n_mel_channels, n_mel_channels, kernel_size=1024, stride=256)
        self.WN = nn.ModuleList()
        self.convinv = nn.ModuleList()

        n_remaining_channels = n_group
        for k in range(n_flows):
            if k % n_early_every == 0 and k > 0:
                n_remaining_channels -= n_early_size
            self.convinv.append(Invertible1x1Conv(n_remaining_channels))
            self.WN.append(WN(n_remaining_channels, n_mel_channels * n_group, n_hidden))

    def forward(self, spect, audio):
        spect = self.upsample(spect)
        spect = spect[:, :, :audio.size(1)]
        output_audio = []
        s = audio
        for k in range(self.n_flows):
            if k % self.n_early_every == 0 and k > 0:
                output_audio.append(s[:, :self.n_early_size, :])
                s = s[:, self.n_early_size:, :]
            s, log_det_W = self.convinv[k](s)
            s = self.WN[k](s, spect)
        output_audio.append(s)
        return torch.cat(output_audio, 1)

class Invertible1x1Conv(nn.Module):
    def __init__(self, n_channels):
        super(Invertible1x1Conv, self).__init__()
        W = torch.qr(torch.randn(n_channels, n_channels))[0]
        self.W = nn.Parameter(W)

    def forward(self, x):
        W = self.W.unsqueeze(0).unsqueeze(2)
        log_det_W = torch.slogdet(self.W)[1] * x.size(0) * x.size(2)
        return F.conv1d(x, W), log_det_W

class WN(nn.Module):
    def __init__(self, n_in_channels, n_mel_channels, n_hidden):
        super(WN, self).__init__()
        self.start = nn.Conv1d(n_in_channels, n_hidden, kernel_size=1)
        self.end = nn.Conv1d(n_hidden, n_in_channels * 2, kernel_size=1)
        self.cond = nn.Conv1d(n_mel_channels, n_hidden, kernel_size=1)

    def forward(self, x, spect):
        h = self.start(x)
        h = h + self.cond(spect)
        h = torch.tanh(h)
        h = self.end(h)
        m, logs = h.chunk(2, 1)
        return x * torch.exp(logs) + m
