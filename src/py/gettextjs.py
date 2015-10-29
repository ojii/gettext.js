import gettext
import json
import os

import docopt
import pkg_resources

try:
    VERSION = pkg_resources.get_distribution('gettextjs').version
except pkg_resources.DistributionNotFound:
    VERSION = 'dev'
USAGE = """gettextjs

Usage:
    gettextjs [-i] [-v] [--js] <locale-path> [<out-dir>]

Options:
    -h --help       Show this screen.
    --version       Show version.
    -i --indent     Indent JSON file.
    -v --verbose    Print stuff while doing work.
    --js            Compile to JS instead of JSON.
"""
JSON_MODE = 0
JS_MODE = 1


def compile_to_dict(locale_path: str, locale: str, domain: str) -> dict:
    translations = gettext.translation(domain, locale_path, [locale])._catalog
    plural = None
    if '' in translations:
        for line in translations[''].split('\n'):
            if line.startswith('Plural-Forms:'):
                plural = line.split(':', 1)[1].strip()
    if plural is not None:
        plural = [
            el.strip() for el in plural.split(';')
            if el.strip().startswith('plural=')
        ][0].split('=', 1)[1]

    plural_dict = {}
    max_counts = {}
    catalog = {}
    for key, value in translations.items():
        if key == '':
            continue
        if isinstance(key, str):
            catalog[key] = value
        elif isinstance(key, tuple):
            msgid = key[0]
            cnt = key[1]
            max_counts[msgid] = max(cnt, max_counts.get(msgid, 0))
            plural_dict.setdefault(msgid, {})[cnt] = value
        else:
            raise TypeError(key)
    for key, value in plural_dict.items():
        catalog[key] = [
            value.get(index, '') for index in range(max_counts[msgid] + 1)
        ]

    return {
        'catalog': catalog,
        'plural': plural,
    }


def compile_domain(locale_path: str, locale: str, domain: str, out_dir: str,
                   mode: int, indent: int, verbose: bool):
    data = compile_to_dict(locale_path, locale, domain)
    lc_messages = os.path.join(out_dir, locale, 'LC_MESSAGES')
    if not os.path.exists(lc_messages):
        os.makedirs(lc_messages)
    if mode == JSON_MODE:
        out_file = os.path.join(
            lc_messages,
            '{domain}.mo.json'.format(domain=domain)
        )
        with open(out_file, 'w') as fobj:
            json.dump(data, fobj, indent=indent, sort_keys=True)
    elif mode == JS_MODE:
        out_file = os.path.join(
            lc_messages,
            '{domain}.mo.js'.format(domain=domain)
        )
        with open(out_file, 'w') as fobj:
            fobj.write('var ')
            fobj.write(locale.upper())
            fobj.write('_')
            fobj.write(domain.upper())
            fobj.write(' = ')
            json.dump(data, fobj, indent=indent, sort_keys=True)
            fobj.write(';')
    else:
        raise ValueError("Unkown mode: {mode}".format(mode=mode))
    if verbose:
        print("Compiled {domain}.mo for locale {locale} to {out_file}".format(
            domain=domain,
            locale=locale,
            out_file=out_file,
        ))


def compile_locale_path(locale_path: str, out_dir: str, mode: int, indent: int,
                        verbose: bool):
    for entry in os.scandir(locale_path):
        if entry.is_dir():
            lc_messages = os.path.join(entry.path, 'LC_MESSAGES')
            if os.path.exists(lc_messages):
                for domain in os.scandir(lc_messages):
                    if domain.is_file() and domain.name.endswith('.mo'):
                        compile_domain(
                            locale_path,
                            entry.name,
                            domain.name[:-3],
                            out_dir,
                            mode,
                            indent,
                            verbose,
                        )


def cli(argv=None):
    args = docopt.docopt(USAGE, version=VERSION, argv=argv)
    mode = 1 if args['--js'] else 0
    out_dir = args.get('<out-dir>', None) or args['<locale-path>']
    compile_locale_path(
        args['<locale-path>'],
        out_dir,
        mode,
        int(args['--indent']) * 2,
        args['--verbose'],
    )
