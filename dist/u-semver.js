'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var multipliers = [1000000, 1000, 10, 0, 1];

var semVerToNum = function semVerToNum(x) {
  return x.match(/^(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/).slice(1).map(function (m) {
    return +m;
  }).filter(function (m) {
    return !isNaN(m);
  }).reduce(function (acc, y, i) {
    return acc + y * multipliers[i];
  }, 0);
};

var sortSemver = function sortSemver(a, b) {
  var _map = [a, b].map(semVerToNum);

  var _map2 = _slicedToArray(_map, 2);

  var a1 = _map2[0];
  var b1 = _map2[1];

  return a1 === b1 ? 0 : a1 < b1 ? -1 : 1;
};

var find = function find(xs, fn) {
  return xs.filter(fn)[0];
};

var findLatest = function findLatest(xs) {
  return xs.sort(sortSemver).reverse()[0];
};

var findPattern = function findPattern(xs, pattern) {
  var RX = new RegExp(pattern);
  return findLatest(xs.filter(RX.test.bind(RX)));
};

var resolve = function resolve(range, versions, pre) {
  if (range === 'latest') {
    return findLatest(versions);
  }

  var VERSION_RX = /^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/;

  var _VERSION_RX$exec = VERSION_RX.exec(range);

  var _VERSION_RX$exec2 = _slicedToArray(_VERSION_RX$exec, 4);

  var root = _VERSION_RX$exec2[0];
  var prefix = _VERSION_RX$exec2[1];
  var major = _VERSION_RX$exec2[2];
  var minor = _VERSION_RX$exec2[3];

  if (!prefix) {
    return find(versions, function (v) {
      return v === root;
    });
  }

  var pattern = prefix === '^' ? '^(' + major + ')\\.(\\d+)\\.(\\d+)' : '^(' + major + ').(' + minor + ')\\.(\\d+)';

  return pre ? findPattern(versions, pattern + '(-(\\w+)(\\.(\\d+))?)?$') : findPattern(versions, pattern + '$');
};

var SemVer = { resolve: resolve };

exports['default'] = SemVer;
module.exports = exports['default'];
