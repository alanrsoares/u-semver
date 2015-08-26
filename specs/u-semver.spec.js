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
  '0.0.12',
  '0.0.13-pre',
  '0.8.10',
  '0.8.9',
  '0.8.7'
];

let runAssertion = ([input, expected, pre]) => {
  let value = resolve(input, VERSIONS, pre);
  it(`should resolve ${ input } to ${ expected }`, () => {
    expect(value).to.equal(expected);
  });
};

const cases = [
//[input, expected, pre]
  ['1.0.2', undefined],
  ['1.0.0', '1.0.0'],
  ['1.0.1', '1.0.1'],
  ['1.3.2', '1.3.2'],
  ['^1.0.0', '1.3.2'],
  ['^0.1.0', '0.2.0'],
  ['~1.0.0', '1.0.1'],
  ['~0.1.0', '0.1.1-alpha', true],
  ['^0.1.0', '0.2.4-pre', true],
  ['^0.0.1', '0.2.4-pre', true],
  ['~0.0.1', '0.0.12'],
  ['~0.0.1', '0.0.13-pre', true],
  ['latest', '1.3.2'],
  ['^1.0.0', '1.3.2'],
  ['^0.8.0', '0.8.10']
];

describe('Given a set of versions', () => {
  cases.map(runAssertion);
});
