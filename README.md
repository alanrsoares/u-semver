# μ-semver
A micro `(~1kb)` parser and version resolver following [SemVer](http://semver.org/) specs

[![npm module](https://badge.fury.io/js/u-semver.svg)](https://www.npmjs.org/package/u-semver)
[![Bower version](https://badge.fury.io/bo/u-semver.svg)](http://badge.fury.io/bo/u-semver)
[![Codeship](https://img.shields.io/codeship/ae382de0-234f-0132-2ac9-66ff9c0c3cf8.svg)]()

## Installation

### for node (via npm)
```bash
$ npm install u-semver
```

### for the browser (via bower)
```bash
$ bower install u-semver
```

### Usage
```javascript
SemVer.resolve(range: string, versions: Array<string>, preRelease: boolean?): string
```
```javascript
var versions = [
  '1.0.1',
  '1.1.9',
  '1.0.0',
  '2.0.0',
  '0.1.1-alpha',
  '1.3.2',
  '0.2.3-pre',
  '0.2.4-pre',
  '0.2.0',
  '0.0.12',
  '0.0.13-pre'
];

// resolving a specific version
SemVer.resolve('1.1.9', versions) //=> '1.1.9'
// resolving a patch range
SemVer.resolve('~1.0.0', versions) //=> '1.0.1'
// resolving a minor range
SemVer.resolve('^1.0.0', versions) //=> '1.3.2'
// resolving the latest version
SemVer.resolve('latest', versions) //=> '2.0.1'
// allow pre-release resolution
SemVer.resolve('^0.1.0', versions, true) //=> '0.2.4-pre'
// deny pre-release resolution
SemVer.resolve('^0.1.0', versions, false) //=> '0.2.0'
```

### Tests by example


```javascript
const VERSIONS = [
  '1.0.1',
  '1.1.9',
  '1.0.0',
  '0.1.1-alpha',
  '1.3.2',
  '0.2.3-pre',
  '0.2.4-pre',
  '0.2.4-pre.0',
  '0.2.0',
  '1.3.11',
  '0.0.12',
  '0.0.13-pre',
  '1.3.10',
  '1.3.9',
  '1.3.7',
  '1.3.12-pre.12',
  '1.3.12-pre.4',
  '2.0.0-pre',
  '2.0.0-pre.4',
  '2.0.0-pre.10',
  '2.0.0',
  '2.1.0-pre.13',
  '2.1.0-pre.2',
  '2.1.0-pre'
];
```

```haskell
package: u-semver
  SemVer.resolve
    Given a set of versions
      ✓ should resolve 1.0.2 to undefined
      ✓ should resolve 1.0.0 to 1.0.0
      ✓ should resolve 1.0.1 to 1.0.1
      ✓ should resolve 1.3.2 to 1.3.2
      ✓ should resolve ^1.3.12 to undefined
      ✓ should resolve ^1.3.12 (pre) to 1.3.12-pre.12
      ✓ should resolve ^0.1.0 to 0.2.0
      ✓ should resolve ~1.0.0 to 1.0.1
      ✓ should resolve ~0.1.0 (pre) to 0.1.1-alpha
      ✓ should resolve ^0.1.0 (pre) to 0.2.4-pre.0
      ✓ should resolve ^0.0.1 (pre) to 0.2.4-pre.0
      ✓ should resolve ~0.0.1 to 0.0.12
      ✓ should resolve ~0.0.1 (pre) to 0.0.13-pre
      ✓ should resolve ^1.0.0 to 1.3.11
      ✓ should resolve ~1.3.0 to 1.3.11
      ✓ should resolve ^1.3.0 (pre) to 1.3.12-pre.12
      ✓ should resolve ~2.0.0 (pre) to 2.0.0
      ✓ should resolve ~2.1.0 (pre) to 2.1.0-pre.13
      ✓ should resolve latest to 2.1.0-pre.13


19 passing (70ms)
```

## License
MIT
