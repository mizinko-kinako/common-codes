import pyopenjtalk
from accent import pp_symbols


text = "こんにちは、元気ですか？"

labels = pyopenjtalk.extract_fullcontext(text)
PP = pp_symbols(labels)

print("入力文字列：", text)
print("音素列：", pyopenjtalk.g2p(text))
print("韻律記号付き音素列：", PP)