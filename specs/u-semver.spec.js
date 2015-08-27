import { resolve } from '../src/u-semver';
import { expect } from 'chai';

const VERSIONS = [
  '1.0.1',
  '1.1.9',
  '1.0.0',
  '0.1.1-alpha',
  '1.3.2',
  '0.2.3-pre',
  '0.2.4-pre',
  '0.2.0',
  '1.3.11',
  '0.0.12',
  '0.0.13-pre',
  '1.3.10',
  '1.3.9',
  '1.3.7',
  '1.3.12-pre.12',
  '1.3.12-pre.4',
  '2.0.0-pre',
  '2.0.0-pre.4',
  '2.0.0-pre.10',
  '2.0.0',
  '2.1.0-pre.13',
  '2.1.0-pre.2',
  '2.1.0-pre'
];

let runAssertion = ([input, expected, pre]) => {
  let value = resolve(input, VERSIONS, pre);
  it(`should resolve ${ input } ${ pre ? '(pre)' : '' } to ${ expected }`, () => {
    expect(value).to.equal(expected);
  });
};

const cases = [
//[input, expected, pre]
  ['1.0.2', undefined],
  ['1.0.0', '1.0.0'],
  ['1.0.1', '1.0.1'],
  ['1.3.2', '1.3.2'],
  ['^0.1.0', '0.2.0'],
  ['~1.0.0', '1.0.1'],
  ['~0.1.0', '0.1.1-alpha', true],
  ['^0.1.0', '0.2.4-pre', true],
  ['^0.0.1', '0.2.4-pre', true],
  ['~0.0.1', '0.0.12'],
  ['~0.0.1', '0.0.13-pre', true],
  ['^1.0.0', '1.3.11'],
  ['~1.3.0', '1.3.11'],
  ['^1.3.0', '1.3.12-pre.12', true],
  ['~2.0.0', '2.0.0', true],
  ['~2.1.0', '2.1.0-pre.13', true],
  ['latest', '2.1.0-pre.13']
];

describe('package: u-semver', () => {
  describe('SemVer.resolve', () => {
    describe('Given a set of versions', () => {
      cases.map(runAssertion);
    });
  });
});
