import json
from gettext import c2py


PLURAL_FORMS = [
    "0",
    "n!=1",
    "n>1",
    "n%10==1&&n%100!=11?0:n!=0?1:2",
    "n==1?0:n==2?1:2",
    "n==1?0:(n==0||(n%100>0&&n%100<20))?1:2",
    "n%10==1&&n%100!=11?0:n%10>=2&&(n%100<10||n%100>=20)?1:2",
    "n%10==1&&n%100!=11?0:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?1:2",
    "(n==1)?0:(n>=2&&n<=4)?1:2",
    "n==1?0:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?1:2",
    "n%100==1?0:n%100==2?1:n%100==3||n%100==4?2:3",
    "n==0?0:n==1?1:n==2?2:n%100>=3&&n%100<=10?3:n%100>=11?4:5",
]

NUM = 1001


def gen():
    tests = []
    for plural_form in PLURAL_FORMS:
        expr = c2py(plural_form)
        tests.append({
            'pluralform': plural_form,
            'fixture': [(n, expr(n)) for n in range(NUM)]
        })
    return json.dumps(tests)


if __name__ == "__main__":
    print(gen())
