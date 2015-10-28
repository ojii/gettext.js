from setuptools import setup


setup(
    version='1.0',
    name='gettextjs',
    install_requires=[
        'docopt',
    ],
    package_dir={'': 'src/py'},
    py_modules=[
        'gettextjs',
    ],
    entry_points={
        'console_scripts': [
            'gettextjs = gettextjs:cli',
        ]
    }
)
