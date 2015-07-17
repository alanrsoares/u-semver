# μ-semver
A micro parser and version resolver for Semantic Version (~1kb)

[![npm module](https://badge.fury.io/js/u-semver.svg)](https://www.npmjs.org/package/u-semver)
[![Bower version](https://badge.fury.io/bo/u-semver.svg)](http://badge.fury.io/bo/u-semver)

## Installation

##### for node (via npm)
```
$ npm install u-semver
```

##### for the browser (via bower)
```
$ bower install u-semver
```

## Usage
``` 
SemVer.resolve(range: String, versions: String[], preRelease: Boolean?)
```
```javascript
var versions = [
  '1.0.1',
  '1.1.9',
  '1.0.0',
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
SemVer.resolve('latest', versions) //=> '1.3.2'
// allow pre-release resolution
SemVer.resolve('^0.1.0', versions, true) //=> '0.2.4'
// deny pre-release resolution
SemVer.resolve('^0.1.0', versions, false) //=> '0.2.0'
```

## License
MIT
