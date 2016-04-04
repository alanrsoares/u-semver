'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var SEMVER_RX = /^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/;
var BASE_SEMVER_RX = /^(\d+).(\d+).(\d+)/;
var MULTIPLIERS = [1000000, 1000, 10, 0, 1];

var find = function find(xs, fn) {
  return xs.filter(fn)[0];
};
var last = function last(xs) {
  return xs[xs.length - 1];
};
var contains = function contains(x, s) {
  return x.indexOf(s) > -1;
};
var and = function and(f, xs) {
  return xs.reduce(function (acc, x) {
    return acc && f(x);
  }, true);
};

var toValidIntMatches = function toValidIntMatches(x) {
  return x.match(SEMVER_RX).slice(1).map(function (m) {
    return +m;
  }).filter(function (m) {
    return !isNaN(m);
  });
};

var filterVersion = function filterVersion(filters) {
  return function (x) {
    return toValidIntMatches(x).reduce(function (acc, y, i) {
      return acc && (filters[i] !== undefined ? y >= filters[i] : true);
    }, true);
  };
};

var isPreRelease = function isPreRelease(x) {
  return /(alpha|beta)/.test(x);
};
var arePreReleases = function arePreReleases(xs) {
  return and(isPreRelease, xs);
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

var sort = function sort(xs) {
  return xs.sort(sortSemVer);
};

function sortSemVer(a, b) {
  var _map = [a, b].map(semVerToNum);

  var _map2 = _slicedToArray(_map, 2);

  var a1 = _map2[0];
  var b1 = _map2[1];

  if (arePreReleases([a, b])) {
    var _map3 = [a, b].map(getBaseSemVer);

    var _map32 = _slicedToArray(_map3, 2);

    var a2 = _map32[0];
    var b2 = _map32[1];

    if (and(a2 === b2, contains(a, 'beta'), contains(b, 'alpha'))) {
      return 1;
    }
  }

  return a1 - b1;
}

function findLatest(xs) {
  var sorted = sort(xs);
  var latest = last(sorted);
  return allowsPreRelease(latest) ? find(xs, function (x) {
    return x === latest.split('-')[0];
  }) || latest : latest;
}

function findPattern(xs, pattern, filters) {
  var RX = new RegExp(pattern);
  return findLatest(xs.filter(function (x) {
    return RX.test(x);
  }).filter(filterVersion(filters)));
}

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
    return find(versions, function (v) {
      return v === root;
    });
  }

  var pattern = prefix === '^' ? '^(' + major + ')\\.(\\d+)\\.(\\d+)' : '^(' + major + ')\\.(' + minor + ')\\.(\\d+)';

  var filters = [major, minor, patch, partial, beta];

  return pre ? findPattern(versions, pattern + '(-(\\w+)(\\.(\\d+))?)?$', filters) : findPattern(versions, pattern + '$', filters);
}

var SemVer = {
  resolve: resolve,
  sort: sort
};

exports['default'] = SemVer;
module.exports = exports['default'];
