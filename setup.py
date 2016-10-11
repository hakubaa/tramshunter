from setuptools import setup
from pip.req import parse_requirements

install_reqs = parse_requirements("requirements.txt", session=False)
reqs = [ str(ir.req) for ir in install_reqs ]

setup(name='Trams Hunter',
      version='1.0',
      description='Find out where your tram is.',
      author='JAGO',
      author_email='example@example.com', url='http://www.python.org/sigs/distutils-sig/',
      install_requires=reqs
     )
