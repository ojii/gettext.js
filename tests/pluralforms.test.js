import compile from '../src/pluralforms';
import fixtures from './data/pluralform_fixture.json';


describe('pluralforms', () => {
  for (let {pluralform, fixture} of fixtures) {
    describe(pluralform, () => {
      let pf = compile(pluralform);
      fixture.map(([num, expected]) => {
        test(num, () => {
          expect(pf(num)).toBe(expected);
        });
      });
    });
  }
});
