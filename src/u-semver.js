const SEMVER_RX = /^([\^\~])?(\d+)\.(\d+)\.(\d+)(-(\w+)(\.(\d+))?)?$/
const BASE_SEMVER_RX = /^(\d+).(\d+).(\d+)/
const MULTIPLIERS = [1000000, 1000, 10, 0, 1]

const first = (xs) => xs[0]
const last = (xs) => xs[xs.length - 1]
const find = (f, xs) => first(xs.filter(f))
const isNumber = (x) => !isNaN(x)
const toInt = (x) => +x

const toValidIntMatches = (x) =>
  x.match(SEMVER_RX)
   .slice(1)
   .map(toInt)
   .filter(isNumber)

const filterVersion = (filters) => (x) =>
  toValidIntMatches(x)
    .reduce((acc, y, i) =>
      acc && (filters[i] !== undefined ? y >= filters[i] : true), true)

const isPreRelease = (x) => /(alpha|beta)/.test(x)
const allowsPreRelease = (x) => x && x.indexOf('-') >= 0
const getBaseSemVer = (x) => x.match(BASE_SEMVER_RX)[0]

function semVerToNum (x) {
  const matches = toValidIntMatches(x)
  const reducer = (acc, y, i) => acc + y * MULTIPLIERS[i]
  return matches.reduce(reducer, 0)
}

export const sort = (xs) => [...xs].sort(sortSemVer)

function sortSemVer (a, b) {
  const [valueA, valueB] = [a, b].map(semVerToNum)
  const [baseA, baseB] = [a, b].map(getBaseSemVer)

  // check pre-release precedence when bases are equal
  if (baseA === baseB) {
    if (/beta/.test(a) && /alpha/.test(b)) {
      return 1
    }
    if ((/alpha/.test(a) && /beta/.test(b)) ||
        (isPreRelease(a) && !isPreRelease(b))) {
      return -1
    }
  }

  return valueA - valueB
}

function findLatest (xs) {
  const sorted = sort(xs)
  const latest = last(sorted)
  return allowsPreRelease(latest)
    ? find((x) => x === (latest.split('-')[0]), xs) || latest
    : latest
}

const findPattern  = (xs, pattern, filters) =>
  findLatest(xs.filter((x) => RegExp(pattern).test(x))
               .filter(filterVersion(filters)))

// (range: string, versions: list<string>, pre: boolean) -> string
export function resolve (range, versions, pre) {
  if (range === 'latest') {
    return findLatest(versions)
  }

  const [root, prefix, major, minor, patch, partial, beta] = SEMVER_RX.exec(range)

  if (!prefix) {
    // match exact value
    return find((v) => v === root, versions)
  }

  const pattern = prefix === '^'
    ? `^(${major})\\.(\\d+)\\.(\\d+)`
    : `^(${major})\\.(${minor})\\.(\\d+)`

  const filters = [major, minor, patch, partial, beta]

  return pre
    ? findPattern(versions, pattern + '(-(\\w+)(\\.(\\d+))?)?$', filters)
    : findPattern(versions, pattern + '$', filters)
}
