import formatMoney from '../lib/formatMoney';

describe('format money function', () => {
	it('works with fractional dollars', () => {
		expect(formatMoney(1)).toEqual('$0.01');
		expect(formatMoney(10)).toEqual('$0.10');
		expect(formatMoney(9)).toEqual('$0.09');
		expect(formatMoney(40)).toEqual('$0.40');
	});

	it('leaves off cents when it is whole dollars', () => {
		expect(formatMoney(5000)).toEqual('$50');
		expect(formatMoney(100)).toEqual('$1');
		expect(formatMoney(5000000)).toEqual('$50,000');
	});

	it('works with whole and fractional numbers', () => {
		expect(formatMoney(140)).toEqual('$1.40');
		expect(formatMoney(5012)).toEqual('$50.12');
		expect(formatMoney(110)).toEqual('$1.10');
		expect(formatMoney(101)).toEqual('$1.01');
		expect(formatMoney(5434534543345)).toEqual('$54,345,345,433.45');
	});
});
