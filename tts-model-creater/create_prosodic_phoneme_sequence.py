import re

def numeric_feature_by_regex(regex, s):
    match = re.search(regex, s)

    if match is None:
        return -50
    return int(match.group(1))

def pp_symbols(labels,drop_unvoiced_vowels=True):
    PP = []
    N = len(labels)

    for n in range(len(labels)):
        lab_curr = labels[n]

        p3 = re.search(r"\-(.*?)\+",lab_curr).group(1)

        if drop_unvoiced_vowels and p3 in ["a","e","i","o","u"]:
            pr=p3.lower()

        if p3 == "sil":
            if n==0:
                PP.append("^")
            elif n==N-1:
                e3 = numeric_feature_by_regex(r"!(\d+)_", lab_curr)
                if e3 == 0:
                    PP.append("")
                elif e3 == 1:
                    PP.append("?")
            continue
        elif p3 == "pau":
            PP.append("_")
            continue
        else:
            PP.append(p3)

            a1 = numeric_feature_by_regex(r"/A:([0-9\-]+)\+", lab_curr)
            a2 = numeric_feature_by_regex(r"\+(\d+)\+", lab_curr)
            a3 = numeric_feature_by_regex(r"\+(\d+)/", lab_curr)
            f1 = numeric_feature_by_regex(r"/F:(\d+)_", lab_curr)

            a2_next = numeric_feature_by_regex(r"\+(\d+)\+", labels[n+1])

            if a3==1 and a2_next==1:
                PP.append("#")
            elif a1 == 0 and a2_next == a2 + 1 and a2 != f1:
                PP.append("]")
            elif a2 == 1 and a2_next == 2:
                PP.append("[")

    return PP