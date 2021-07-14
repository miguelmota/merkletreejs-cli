const fs = require('fs')
const meow = require('meow')
const { MerkleTree } = require('merkletreejs')
const sha256 = require('js-sha256')
const keccak256 = require('keccak256')

const cli = meow(`
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
  `, {
  string: [
    'leaves',
    'hash',
    'hashLeaves',
    'sort',
    'sortLeaves',
    'sortPairs',
    'duplicateOdd',
    'bitcoinTree',
    'fillDefaultHash',
    'output'
  ],
  alias: {
    l: 'leaves',
    h: 'hash',
    s: 'sort',
    o: 'output'
  }
}
)

const args = process.argv
const { flags, input } = cli

const options = {
  output: flags.output || flags.o || input[0],
  hash: flags.hash || flags.h,
  leaves: flags.leaves || flags.l,
  hashLeaves: !!flags.hashLeaves,
  sort: !!(flags.sort || flags.s),
  sortLeaves: !!flags.sortLeaves,
  sortPairs: !!flags.sortPairs,
  duplicateOdd: !!flags.duplicateOdd,
  isBitcoinTree: !!flags.bitcoinTree,
  fillDefaultHash: flags.fillDefaultHash
}

const hashFunctions = {
  keccak256,
  sha256
}

if (options.hash) {
  options.hash = (options.hash.trim()).toLowerCase()
}
if (options.fillDefaultHash) {
  options.fillDefaultHash = options.fillDefaultHash.trim()
}

if (options.leaves === '-') {
  if (process.stdin) {
    process.stdin.setEncoding('utf8')
    process.stdin.resume()
    let content = ''
    process.stdin.on('data', (buf) => {
      content += buf.toString()
    })
    process.stdin.on('end', (buf) => {
      if (content) {
        options.leaves = JSON.parse(content.trim())
      }
      run(options)
    })
  } else {
    console.error('process.stdin not found')
    process.exit(1)
  }
} else {
  if (options.leaves) {
    options.leaves = JSON.parse(fs.readFileSync(options.leaves, 'utf8'))
  }
  run(options)
}

function run ({
  leaves,
  hash,
  hashLeaves,
  sort,
  sortLeaves,
  sortPairs,
  duplicateOdd,
  isBitcoinTree,
  fillDefaultHash,
  output
}) {
	try {
		const options = {
			hashLeaves,
			sort,
			sortLeaves,
			sortPairs,
			duplicateOdd,
			isBitcoinTree,
			fillDefaultHash
		}
		const hashFn = hashFunctions[hash]
		if (!hashFn) {
			throw new Error('invalid hash option or not supported')
		}
		const tree = new MerkleTree(leaves, hashFn, options)
		if (output === 'root') {
			const root = tree.getHexRoot()
			process.stdout.write(root)
		} else if (output === 'leaves') {
			const leaves = tree.getHexLeaves()
			process.stdout.write(JSON.stringify(leaves, null, 2))
		} else if (output === 'layers') {
			const layers = tree.getHexLayers()
			process.stdout.write(JSON.stringify(layers, null, 2))
		} else if (output === 'layers-flat') {
			const layers = tree.getHexLayersFlat()
			process.stdout.write(JSON.stringify(layers, null, 2))
		} else if (output === 'tree') {
			process.stdout.write(tree.toString())
		} else {
			process.stdout.write(tree.toString())
		}
		process.exit(0)
	} catch(err) {
		console.error(err.message)
		process.exit(1)
	}
}
