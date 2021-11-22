/* eslint-disable react/prop-types */
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
	mutation ADD_TO_CART_MUTATION($id: ID!) {
		addToCart(productId: $id) {
			id
		}
	}
`;

export default function AddToCart({ id }) {
	const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
		variables: { id },
		refetchQueries: [{ query: CURRENT_USER_QUERY }],
	});
	// const { openCart } = useCart();

	async function handleAddToCartClick() {
		await addToCart();
		// openCart();
	}

	return (
		<button disabled={loading} type="button" onClick={handleAddToCartClick}>
			Add{loading && 'ing'} To Cart{' '}
		</button>
	);
}
