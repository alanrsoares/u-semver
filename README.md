# μ-semver
A micro `(~1kb)` parser and version resolver following [SemVer](http://semver.org/) specs

[![npm module](https://badge.fury.io/js/u-semver.svg)](https://www.npmjs.org/package/u-semver)
[![Bower version](https://badge.fury.io/bo/u-semver.svg)](http://badge.fury.io/bo/u-semver)
[![Codeship](https://img.shields.io/codeship/ae382de0-234f-0132-2ac9-66ff9c0c3cf8.svg)]()

## Installation

##### for node (via npm)
```bash
$ npm install u-semver
```

##### for the browser (via bower)
```bash
$ bower install u-semver
```

## Usage
```javascript
// SemVer.resolve(range: String, versions: String[], preRelease: Boolean?)
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

## License
MIT
