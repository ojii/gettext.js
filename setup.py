from setuptools import setup

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src', 'py'))

from gettextjs import __version__

setup(
    version='1.1',
    name='gettextjs',
    package_dir={'': 'src/py'},
    py_modules=[
        'gettextjs',
    ],
    entry_points={
        'console_scripts': [
            'gettextjs = gettextjs:main',
        ]
    }
)
