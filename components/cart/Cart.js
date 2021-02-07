import Link from 'next/link'
import useCart from '@bigcommerce/storefront-data-hooks/cart/use-cart'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AiOutlineClose } from 'react-icons/ai'
import CartItem from './CartItem'

export default function Cart({ open, close }) {
  const { data, isEmpty } = useCart()
  const items = data?.line_items.physical_items ?? []

  const [innerH, setInnerH] = useState()

  useEffect(() => {
    setInnerH(window.innerHeight * 0.01)
  })

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: open ? 0 : 400 }}
      transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
      className='bg-white right-0 fixed z-40 shadow-lg rounded-l-lg rounded-bl-lg'
      style={{ width: '375px', height: `calc(${innerH} * 100px)` }}
    >
      <div className='flex items-center justify-between mb-2 border-black border-b px-6 pt-8 pb-2'>
        <h3 className='text-black text-3xl font-bold'>Cart</h3>
        <div className='cursor-pointer' onClick={close}>
          <AiOutlineClose size='2.25em' color='#000' />
        </div>
      </div>
      <div className='px-1'>
        {isEmpty && <p className='text-black px-5'>Cart is empty</p>}
        {items.map((item, i) => (
          <CartItem item={item} key={i} />
        ))}
      </div>
      {!isEmpty && (
        <div className='absolute w-full px-6 bottom-10'>
          <div className='flex flex-col mb-6 text-black font-bold text-lg'>
            <Link href='/products'>
              <a className=' mb-2 block' onClick={close}>
                View all Products
              </a>
            </Link>
            <span className='block cursor-pointer select-none' onClick={close}>
              Continue Shopping
            </span>
          </div>
          <p className='text-black text-lg flex justify-between mb-2 border-t pt-4'>
            <span className='font-bold'>Total </span>
            <span className='select-none'>
              ${Number(data.cart_amount).toFixed(2)}
            </span>
          </p>

          <a
            href='/checkout'
            className='bg-red-500 w-full rounded shadow text-center text-lg uppercase py-2 block select-none font-bold'
          >
            Checkout
          </a>
        </div>
      )}
    </motion.div>
  )
}
