const semVerToNum = (x) =>
  x.match(/(\d+).(\d+).(\d+)/)
   .slice(1)
   .reduce((acc, x, i) => +acc + +x * ([100000, 1000, 1][i]));

const sortSemver = (a, b) => {
  const [a1, b1] = [a, b].map(semVerToNum);
  return a1 === b1
    ? 0 : a1 < b1 ? -1 : 1;
};

const find = (xs, fn) => xs.filter(fn)[0];

const findLatest = (xs) => xs.sort(sortSemver).reverse()[0];

const findPattern = (xs, pattern) => {
  const RX = new RegExp(pattern);
  return findLatest(xs.filter(::RX.test));
};

const resolve = (range, versions, pre) => {
  if (range === 'latest') {
    return findLatest(versions);
  }

  const VERSION_RX = /^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+))?$/;

  let [root, prefix, major, minor] = VERSION_RX.exec(range);

  if (!prefix) {
    return find(versions, (v) => v === root);
  }

  let pattern = prefix === '^'
    ? `^(${ major })\\.(\\d+)\\.(\\d+)`
    : `^(${ major })\.(${ minor })\\.(\\d+)`;

  return pre
    ? findPattern(versions, pattern + '(-(\\w+))?$')
    : findPattern(versions, pattern + '$');
};

const SemVer = { resolve };

export default SemVer;
