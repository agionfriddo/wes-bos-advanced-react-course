/* eslint-disable react/prop-types */

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import ErrorMesage from '../components/ErrorMessage';
import OrderStyles from '../components/styles/OrderStyles';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from '../components/styles/OrderItemStyles';

const USER_ORDERS_QUERY = gql`
	query USER_ORDERS_QUERY {
		allOrders {
			id
			charge
			total
			user {
				id
			}
			items {
				id
				name
				description
				price
				quantity
				photo {
					image {
						publicUrlTransformed
					}
				}
			}
		}
	}
`;

const OrderUl = styled.ul`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
	grid-gap: 4rem;
`;

function countItemsInAnOrder(order) {
	return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

function pluralize(amount, str) {
	return `${str}${amount === 1 ? '' : 's'}`;
}

export default function OrdersPage() {
	const { data, error, loading } = useQuery(USER_ORDERS_QUERY);
	if (loading) return <p>Loading...</p>;
	if (error) return <ErrorMesage error={error} />;
	const { allOrders } = data;
	return (
		<div>
			<Head>
				<title>Your Orders ({allOrders.length})</title>
			</Head>
			<h2>You have {allOrders.length} orders!</h2>
			<OrderUl>
				{allOrders.map((order) => {
					const totalItemsInOrder = countItemsInAnOrder(order);
					return (
						<OrderItemStyles>
							<Link href={`/order/${order.id}`}>
								<a>
									<div className="order-meta">
										<p>
											{totalItemsInOrder} {pluralize(totalItemsInOrder, 'Item')}
										</p>
										<p>
											{order.items.length}{' '}
											{pluralize(order.items.length, 'Product')}
										</p>
										<p>{formatMoney(order.total)}</p>
									</div>
									<div className="images">
										{order.items.map((item) => (
											<img
												key={item.id}
												src={item.photo?.image?.publicUrlTransformed}
												alt={item.name}
											/>
										))}
									</div>
								</a>
							</Link>
						</OrderItemStyles>
					);
				})}
			</OrderUl>
		</div>
	);
}