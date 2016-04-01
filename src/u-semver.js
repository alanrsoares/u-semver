const SEMVER_RX = /^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/;
const MULTIPLIERS = [1000000, 1000, 10, 0, 1];

const find = (xs, fn) => xs.filter(fn)[0];
const last = (xs) => xs[xs.length - 1];
const contains = (x, s) => x.indexOf(s) > -1;
const and = (f, xs) => xs.reduce((acc, x) => acc && f(x), true);

const toValidIntMatches = (x) =>
  x.match(SEMVER_RX)
   .slice(1)
   .map(m => +m)
   .filter(m => !isNaN(m));

const filterVersion = (filters) => (x) =>
  toValidIntMatches(x)
    .reduce((acc, y, i) =>
      acc && (filters[i] !== undefined ? y >= filters[i] : true), true);

const isPreRelease = ::/(alpha|beta)/.test;
const arePreReleases = (xs) => and(isPreRelease, xs);
const allowsPreRelease = (x) => x && x.indexOf('-') >= 0;

function semVerToNum (x) {
  const matches = toValidIntMatches(x);
  const reducer = (acc, y, i) => acc += y * MULTIPLIERS[i];
  return matches.reduce(reducer, 0);
}

function sortSemVer (a, b) {
  const [a1, b1] = [a, b].map(semVerToNum);

  if (arePreReleases([a, b])) {
    const [a2, b2] = [a, b].map(getBaseSemVer);
    if (a2 === b2 && (contains(a, 'beta') && contains(b, 'alpha'))) {
      return 1;
    }
  }

  return a1 - b1;
}

function findLatest(xs) {
  const sorted = xs.sort(sortSemVer);
  const latest = last(sorted);
  return allowsPreRelease(latest)
    ? find(xs, (x) => x === (latest.split('-')[0])) || latest
    : latest;
}

function findPattern(xs, pattern, filters) {
  const RX = new RegExp(pattern);
  return findLatest(xs.filter(::RX.test).filter(filterVersion(filters)));
}

function resolve(range, versions, pre) {
  if (range === 'latest') {
    return findLatest(versions);
  }

  const [root, prefix, major, minor, patch, partial, beta] = SEMVER_RX.exec(range);

  if (!prefix) {
    // match exact value
    return find(versions, (v) => v === root);
  }

  const pattern = prefix === '^'
    ? `^(${ major })\\.(\\d+)\\.(\\d+)`
    : `^(${ major })\\.(${ minor })\\.(\\d+)`;

  const filters = [major, minor, patch, partial, beta];

  return pre
    ? findPattern(versions, pattern + '(-(\\w+)(\\.(\\d+))?)?$', filters)
    : findPattern(versions, pattern + '$', filters);
}

const SemVer = { resolve };

export default SemVer;
