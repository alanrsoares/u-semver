const VERSION_RX = /^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/;
const multipliers = [1000000, 1000, 10, 0, 1];

const toValidIntMatches = (x) =>
  x.match(VERSION_RX)
   .slice(1)
   .map(m => +m)
   .filter(m => !isNaN(m));

const semVerToNum = (x) =>
  toValidIntMatches(x)
    .reduce((acc, y, i) => acc + (y + 1) * multipliers[i], 0);

const filterVersion = (filters) => (x) =>
  toValidIntMatches(x)
    .reduce((acc, y, i) =>
      acc && (filters[i] !== undefined ? y >= filters[i] : true), true);

const sortSemver = (a, b) => {
  const [a1, b1] = [a, b].map(semVerToNum);
  return a1 === b1
    ? 0 : a1 < b1 ? -1 : 1;
};

const find = (xs, fn) => xs.filter(fn)[0];

const allowsPreRelease = (x) => x && x.indexOf('-') >= 0;

const findLatest = (xs) => {
  const latest = xs.sort(sortSemver).reverse()[0];
  return allowsPreRelease(latest)
    ? find(xs, (x) => x === (latest.split('-')[0])) || latest
    : latest;
}

const findPattern = (xs, pattern, filters) => {
  const RX = new RegExp(pattern);
  return findLatest(xs.filter(::RX.test).filter(filterVersion(filters)));
};

const resolve = (range, versions, pre) => {
  if (range === 'latest') {
    return findLatest(versions);
  }

  const [root, prefix, major, minor, patch, partial, beta] = VERSION_RX.exec(range);

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
};

const SemVer = { resolve };

export default SemVer;
