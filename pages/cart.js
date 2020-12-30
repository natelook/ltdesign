import useCart from '@bigcommerce/storefront-data-hooks/cart/use-cart';
import Link from 'next/link';
import CartItem from '../components/cart/CartItem';

export default function Cart() {
  const { data, isEmpty } = useCart();
  const items = data?.line_items.physical_items ?? [];
  return (
    <div className='container mx-auto max-w-5xl text-white relative'>
      <h1 className='text-4xl font-bold mb-2'>Cart</h1>

      <div className=''>
        {isEmpty && (
          <div>
            <p className='text-white text-lg mb-2'>Cart is empty</p>
            <Link href='/products'>
              <a className='bg-red-600 px-3 py-2 rounded text-xl uppercase'>
                Continue Shopping
              </a>
            </Link>
          </div>
        )}
        {items.map((item, i) => (
          <CartItem item={item} key={i} dark />
        ))}
      </div>
      {!isEmpty && (
        <div className='w-full px-6 bottom-4'>
          <div className='flex flex-col mb-4'>
            <Link href='/products'>
              <a className='text-md text-gray-200 mb-2 block'>
                View all Products
              </a>
            </Link>
            <span className='text-md text-gray-200 block cursor-pointer select-none'>
              Continue Shopping
            </span>
          </div>
          <p className='text-black text-lg flex justify-between mb-2'>
            <span className='font-bold'>Total </span>
            <span className='select-none'>${data.cart_amount}</span>
          </p>

          <a
            href='/checkout'
            className='bg-red-500 w-full rounded shadow text-center text-lg uppercase py-2 block select-none'
          >
            Checkout
          </a>
        </div>
      )}
    </div>
  );
}
