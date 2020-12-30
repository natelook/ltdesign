import Link from 'next/link';
import useCart from '@bigcommerce/storefront-data-hooks/cart/use-cart';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import CartItem from './CartItem';

export default function Cart({ open, close }) {
  const { data, isEmpty } = useCart();
  const items = data?.line_items.physical_items ?? [];

  const [innerH, setInnerH] = useState();

  useEffect(() => {
    setInnerH(window.innerHeight * 0.01);
  });

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: open ? 0 : 400 }}
      transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
      className='bg-gray-200 right-0 fixed z-40 shadow-lg'
      style={{ width: '350px', height: `calc(${innerH} * 100px)` }}
    >
      <div className='flex py-2 items-center justify-between mb-2 border-gray-200 border-b-2 px-6'>
        <h3 className='text-black text-3xl font-bold'>My Cart</h3>
        <div className='cursor-pointer' onClick={close}>
          <AiOutlineClose size='2em' color='#000' />
        </div>
      </div>
      <div className='px-6'>
        {isEmpty && <p className='text-black'>Cart is empty</p>}
        {items.map((item, i) => (
          <CartItem item={item} key={i} />
        ))}
      </div>
      {!isEmpty && (
        <div className='absolute w-full px-6 bottom-4'>
          <div className='flex flex-col mb-4'>
            <Link href='/products'>
              <a className='text-md text-gray-700 mb-2 block' onClick={close}>
                View all Products
              </a>
            </Link>
            <span
              className='text-md text-gray-700 block cursor-pointer select-none'
              onClick={close}
            >
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
    </motion.div>
  );
}
