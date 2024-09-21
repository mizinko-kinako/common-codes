import re
from create_prosodic_phoneme_sequence import numeric_feature_by_regex, pp_symbols

def read_file_and_generate_sequences(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    prosodic_phoneme_sequences = []

    for line in lines:
        labels = line.strip().split()  # Assuming labels are space-separated
        sequence = pp_symbols(labels)
        prosodic_phoneme_sequences.append(sequence)

    return prosodic_phoneme_sequences

if __name__ == "__main__":
    file_path = 'path_to_your_text_file.txt'
    sequences = read_file_and_generate_sequences(file_path)
    for seq in sequences:
        print(seq)