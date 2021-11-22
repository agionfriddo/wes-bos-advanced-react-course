import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTATION = gql`
	mutation CREATE_PRODUCT_MUTATION(
		# which variables get passed in? what types are they?
		$name: String!
		$description: String!
		$price: Int!
		$image: Upload
	) {
		createProduct(
			data: {
				name: $name
				description: $description
				price: $price
				status: "AVAILABLE"
				photo: { create: { image: $image, altText: $name } }
			}
		) {
			id
			price
			description
			name
		}
	}
`;

export default function CreateProduct() {
	const { inputs, handleChange, clearForm, resetForm } = useForm({
		image: '',
		name: 'Nice Shoes',
		price: 34323,
		description: 'these are the best shoes',
	});

	const [createProduct, { loading, error, data }] = useMutation(
		CREATE_PRODUCT_MUTATION,
		{
			variables: inputs,
			refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
		}
	);

	return (
		<Form
			onSubmit={async (e) => {
				e.preventDefault();
				// Submit inputfields to the backend;
				const res = await createProduct();
				clearForm();
				Router.push({
					pathname: `/product/${res.data.createProduct.id}`,
				});
			}}
		>
			<DisplayError error={error} />
			<fieldset disabled={loading} aria-busy={loading}>
				<label htmlFor="image">
					Image
					<input
						type="file"
						id="image"
						name="image"
						placeholder="Name"
						onChange={handleChange}
					/>
				</label>
				<label htmlFor="name">
					Name
					<input
						type="text"
						id="name"
						name="name"
						placeholder="Name"
						value={inputs.name}
						onChange={handleChange}
					/>
				</label>
				<label htmlFor="price">
					Price
					<input
						type="number"
						id="price"
						name="price"
						placeholder="Price"
						value={inputs.price}
						onChange={handleChange}
					/>
				</label>
				<label htmlFor="price">
					Description
					<textarea
						id="description"
						name="description"
						placeholder="Description"
						value={inputs.description}
						onChange={handleChange}
					/>
				</label>
				<button type="submit">+ Add Product</button>
			</fieldset>
		</Form>
	);
}
