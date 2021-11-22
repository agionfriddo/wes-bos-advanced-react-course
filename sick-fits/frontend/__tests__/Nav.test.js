import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser, fakeCartItem } from '../lib/testUtils';
import { CartStateProvider } from '../lib/cartState';
import Nav from '../components/Nav';

// Make some mocks for being logged out, logged in, and logged in with cart items;
const notSignedInMocks = [
	{
		request: { query: CURRENT_USER_QUERY },
		result: { data: { authenticatedItem: null } },
	},
];

const signedInMocks = [
	{
		request: { query: CURRENT_USER_QUERY },
		result: { data: { authenticatedItem: fakeUser() } },
	},
];

const signedInMocksWithCartItems = [
	{
		request: { query: CURRENT_USER_QUERY },
		result: {
			data: {
				authenticatedItem: fakeUser({
					cart: [fakeCartItem()],
				}),
			},
		},
	},
];

describe('<Nav />', () => {
	it('Renders a minimal nav when signed out', () => {
		const { container, debug } = render(
			<CartStateProvider>
				<MockedProvider mocks={notSignedInMocks}>
					<Nav />
				</MockedProvider>
			</CartStateProvider>
		);
		expect(container).toHaveTextContent('Sign In');
		expect(container).toMatchSnapshot();
		const link = screen.getByText('Sign In');
		expect(link).toHaveAttribute('href', '/signin');
		const productsLink = screen.getByText('Products');
		expect(productsLink).toHaveAttribute('href', '/products');
	});

	it('renders full nav when signed in', async () => {
		const { container, debug } = render(
			<CartStateProvider>
				<MockedProvider
					mocks={signedInMocks}
					defaultOptions={{ watchQuery: { fetchPolicy: 'no-cache' } }}
				>
					<Nav />
				</MockedProvider>
			</CartStateProvider>
		);
		await screen.findByText('Account');
		expect(container).toMatchSnapshot();
		expect(container).toHaveTextContent('Sign Out');
		expect(container).toHaveTextContent('My Cart');
	});

	it('renders the amount of items in the cart', async () => {
		const { container, debug } = render(
			<CartStateProvider>
				<MockedProvider
					mocks={signedInMocksWithCartItems}
					defaultOptions={{ watchQuery: { fetchPolicy: 'no-cache' } }}
				>
					<Nav />
				</MockedProvider>
			</CartStateProvider>
		);
		await screen.findByText('Account');
		expect(screen.getByText('3')).toBeInTheDocument();
	});
});
