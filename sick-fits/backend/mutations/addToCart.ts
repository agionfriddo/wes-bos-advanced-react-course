/* eslint-disable */

import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // 1. Query the current user to see if they are signed in
  const session = context.session as Session;
  if (!session.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2. Query the current users's cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: session.itemId }, product: { id: productId } },
    resolveFields: 'id, quantity'
  });
  const [existingCartItem] = allCartItems;

  console.log(existingCartItem);
  // 3. See if the item they are adding is already in the cart
  if (existingCartItem) {
    console.log(`There are already ${existingCartItem.quantity} in the cart, increment by 1`);
    // 4a. if it is increment by one
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  // 4b. if it isn't, create a new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: session.itemId } }
    }
  })
}
