const multipliers = [1000000, 1000, 10, 0, 1];

const semVerToNum = (x) =>
  x.match(/^(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/)
   .slice(1)
   .map(m => +m)
   .filter(m => !isNaN(m))
   .reduce((acc, y, i) => {
     return acc + (y + 1) * multipliers[i]
   }, 0);

const sortSemver = (a, b) => {
  const [a1, b1] = [a, b].map(semVerToNum);
  return a1 === b1
    ? 0 : a1 < b1 ? -1 : 1;
};

const find = (xs, fn) => xs.filter(fn)[0];

const isPreRelease = (x) => x && x.indexOf('-') >= 0;

const findLatest = (xs) => {
  let latest = xs.sort(sortSemver).reverse()[0];
  return isPreRelease(latest)
    ? find(xs, (x) => x === (latest.split('-')[0])) || latest
    : latest;
}

const findPattern = (xs, pattern) => {
  const RX = new RegExp(pattern);
  return findLatest(xs.filter(::RX.test));
};

const resolve = (range, versions, pre) => {
  if (range === 'latest') {
    return findLatest(versions);
  }

  const VERSION_RX = /^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/;

  let [root, prefix, major, minor] = VERSION_RX.exec(range);

  if (!prefix) {
    return find(versions, (v) => v === root);
  }

  let pattern = prefix === '^'
    ? `^(${ major })\\.(\\d+)\\.(\\d+)`
    : `^(${ major })\.(${ minor })\\.(\\d+)`;

  return pre
    ? findPattern(versions, pattern + '(-(\\w+)(\\.(\\d+))?)?$')
    : findPattern(versions, pattern + '$');
};

const SemVer = { resolve };

export default SemVer;
