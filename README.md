# merkletreejs-cli

> CLI for [merkletreejs](https://github.com/miguelmota/merkletreejs)

[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/miguelmota/merkletreejs-cli/master/LICENSE)
[![NPM version](https://badge.fury.io/js/merkletreejs-cli.svg)](http://badge.fury.io/js/merkletreejs-cli)

## Install

```bash
npm install -g merkletreejs-cli
```

## Usage

```bash
$ merkletreejs --help
  CLI for merkletreejs library

    Usage
  $ merkletreejs [options]

    Options
      -h, --hash Hash function to use. Options are "sha256" (default), "keccak256".
      -l, --leaves JSON file containing array of leaves. Use "-" to read from stdin.
      --hash-leaves Hash leaves
      --sort Sort leaves and pairs
      --sort-leaves Sort leaves
      --sort-pairs Sort pairs when hashing nodes
      --duplicate-odd Duplicate odd nodes
      --fill-default-hash Fill default hash value
      -o --output Result to output. Options are "root", "leaves", "layers", "layers-flat", "tree" (default)

    Examples
      $ cat leaves.json | merkletreejs --leaves=- --hash=keccak256 --output=root
```

## Getting started

```bash
$ echo '["a", "b", "c"]' > leaves.json
$ merkletreejs --leaves=leaves.json --hash=sha256 --hash-leaves --output=root
0x7075152d03a5cd92104887b476862778ec0c87be5c2fa1c0a90f87c49fad6eff

$ cat leaves.json | merkletreejs --leaves=- --hash=sha256 --hash-leaves --output=layers
[
  [
    "0xca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    "0x3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d",
    "0x2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6"
  ],
  [
    "0xe5a01fee14e0ed5c48714f22180f25ad8365b53f9779f79dc4a3d7e93963f94a",
    "0x2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6"
  ],
  [
    "0x7075152d03a5cd92104887b476862778ec0c87be5c2fa1c0a90f87c49fad6eff"
  ]
]
```

## License

[MIT](LICENSE)
