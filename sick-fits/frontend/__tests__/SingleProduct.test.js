import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import SingleProduct, { SINGLE_ITEM_QUERY } from '../components/SingleProduct';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();

const mocks = [
	{
		// when someone makes a request with this query and variable combo
		request: { query: SINGLE_ITEM_QUERY, variables: { id: 'abc123' } },
		// return this fake data (mocked data)
		result: {
			data: {
				Product: product,
			},
		},
	},
];
describe('<SingleProduct />', () => {
	it('renders the proper data', async () => {
		// we need to make some fake data
		const { container, debug } = render(
			<MockedProvider mocks={mocks}>
				<SingleProduct id="abc123" />
			</MockedProvider>
		);

		// wait for the test ID to show up
		await screen.findByTestId('singleProduct');
		expect(container).toMatchSnapshot();
	});

	it('errors out when an item is not found', async () => {
		const errorMock = [
			{
				request: { query: SINGLE_ITEM_QUERY, variables: { id: 'abc123' } },
				result: { errors: [{ message: 'Item not found!!!' }] },
			},
		];
		const { container, debug } = render(
			<MockedProvider mocks={errorMock}>
				<SingleProduct id="abc123" />
			</MockedProvider>
		);

		// wait for the test ID to show up
		await screen.findByTestId('graphql-error');
		expect(container).toHaveTextContent('Shoot!');
		expect(container).toHaveTextContent('Item not found!!!');
	});
});
