from setuptools import setup

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
