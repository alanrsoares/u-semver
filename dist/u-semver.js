'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

exports.resolve = resolve;
var SEMVER_RX = /^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/;
var BASE_SEMVER_RX = /^(\d+).(\d+).(\d+)/;
var MULTIPLIERS = [1000000, 1000, 10, 0, 1];

var first = function first(xs) {
  return xs[0];
};
var last = function last(xs) {
  return xs[xs.length - 1];
};
var find = function find(f, xs) {
  return first(xs.filter(f));
};
var isNumber = function isNumber(x) {
  return !isNaN(x);
};
var toInt = function toInt(x) {
  return +x;
};

var toValidIntMatches = function toValidIntMatches(x) {
  return x.match(SEMVER_RX).slice(1).map(toInt).filter(isNumber);
};

var filterVersion = function filterVersion(filters) {
  return function (x) {
    return toValidIntMatches(x).reduce(function (acc, y, i) {
      return acc && (filters[i] !== undefined ? y >= filters[i] : true);
    }, true);
  };
};

var isPreRelease = function isPreRelease(x) {
  return (/(alpha|beta)/.test(x)
  );
};
var allowsPreRelease = function allowsPreRelease(x) {
  return x && x.indexOf('-') >= 0;
};
var getBaseSemVer = function getBaseSemVer(x) {
  return x.match(BASE_SEMVER_RX)[0];
};

function semVerToNum(x) {
  var matches = toValidIntMatches(x);
  var reducer = function reducer(acc, y, i) {
    return acc + y * MULTIPLIERS[i];
  };
  return matches.reduce(reducer, 0);
}

var sort = exports.sort = function sort(xs) {
  return xs.slice().sort(sortSemVer);
};

function sortSemVer(a, b) {
  var _map = [a, b].map(semVerToNum);

  var _map2 = _slicedToArray(_map, 2);

  var valueA = _map2[0];
  var valueB = _map2[1];

  var _map3 = [a, b].map(getBaseSemVer);

  var _map4 = _slicedToArray(_map3, 2);

  var baseA = _map4[0];
  var baseB = _map4[1];

  // check pre-release precedence when bases are equal

  if (baseA === baseB) {
    if (/beta/.test(a) && /alpha/.test(b)) {
      return 1;
    }
    if (/alpha/.test(a) && /beta/.test(b) || isPreRelease(a) && !isPreRelease(b)) {
      return -1;
    }
  }

  return valueA - valueB;
}

function findLatest(xs) {
  var sorted = sort(xs);
  var latest = last(sorted);
  return allowsPreRelease(latest) ? find(function (x) {
    return x === latest.split('-')[0];
  }, xs) || latest : latest;
}

var findPattern = function findPattern(xs, pattern, filters) {
  return findLatest(xs.filter(function (x) {
    return RegExp(pattern).test(x);
  }).filter(filterVersion(filters)));
};

// (range: string, versions: list<string>, pre: boolean) -> string
function resolve(range, versions, pre) {
  if (range === 'latest') {
    return findLatest(versions);
  }

  var _SEMVER_RX$exec = SEMVER_RX.exec(range);

  var _SEMVER_RX$exec2 = _slicedToArray(_SEMVER_RX$exec, 7);

  var root = _SEMVER_RX$exec2[0];
  var prefix = _SEMVER_RX$exec2[1];
  var major = _SEMVER_RX$exec2[2];
  var minor = _SEMVER_RX$exec2[3];
  var patch = _SEMVER_RX$exec2[4];
  var partial = _SEMVER_RX$exec2[5];
  var beta = _SEMVER_RX$exec2[6];

  if (!prefix) {
    // match exact value
    return find(function (v) {
      return v === root;
    }, versions);
  }

  var pattern = prefix === '^' ? '^(' + major + ')\\.(\\d+)\\.(\\d+)' : '^(' + major + ')\\.(' + minor + ')\\.(\\d+)';

  var filters = [major, minor, patch, partial, beta];

  return pre ? findPattern(versions, pattern + '(-(\\w+)(\\.(\\d+))?)?$', filters) : findPattern(versions, pattern + '$', filters);
}