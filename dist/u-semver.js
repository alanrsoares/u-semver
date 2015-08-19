'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var find = function find(xs, fn) {
  return xs.filter(fn)[0];
};

var findLatest = function findLatest(xs) {
  return xs.sort().reverse()[0];
};

var findPattern = function findPattern(xs, pattern) {
  var RX = new RegExp(pattern);
  return findLatest(xs.filter(RX.test.bind(RX)));
};

var resolve = function resolve(_x, _x2, _x3) {
  var _left;

  var _again = true;

  _function: while (_again) {
    var range = _x,
        versions = _x2,
        pre = _x3;
    VERSION_RX = _VERSION_RX$exec = _VERSION_RX$exec2 = root = prefix = major = minor = pattern = undefined;
    _again = false;

    if (range === 'latest') {
      return findLatest(versions);
    }

    var VERSION_RX = /^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+))?$/;

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

    if (pre) {
      return findPattern(versions, pattern + '(-(\\w+))?$');
    } else {
      if (_left = findPattern(versions, pattern + '$')) {
        return _left;
      }

      _x = 'latest';
      _x2 = versions;
      _x3 = undefined;
      _again = true;
      continue _function;
    }
  }
};

var SemVer = { resolve: resolve };

exports['default'] = SemVer;
module.exports = exports['default'];
