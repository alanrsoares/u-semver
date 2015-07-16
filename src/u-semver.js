let find = (xs, fn) => xs.filter(fn)[0];

let findLatest = (xs) => xs.sort().reverse()[0];

let findPattern = (xs, pattern) => {
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
