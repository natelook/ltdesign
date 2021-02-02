import Head from 'next/head'
import Link from 'next/link'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import Cart from '../cart/Cart'
import { motion } from 'framer-motion'
import useCart from '@bigcommerce/storefront-data-hooks/cart/use-cart'
import { useContext } from 'react'
import { UiContext } from '../context'

const countItem = (count, item) => count + item.quantity
const countItems = (count, items) => items.reduce(countItem, count)

export default function Nav() {
  const { state, dispatch } = useContext(UiContext)
  const { data } = useCart()
  const itemsCount = Object.values(data?.line_items ?? {}).reduce(countItems, 0)

  const openCart = () => {
    dispatch({ type: 'OPEN' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE' })
  }
  return (
    <>
      <div>
        <Meta />
        <div className='bg-black fixed w-full z-30 pt-4 pb-2 '>
          <div className='container mx-auto px-4 flex items-center justify-between'>
            <div className='relative flex items-center cursor-pointer'>
              <Link href='/'>
                <a className='text-white text-lg mr-4 md:mr-6 font-bold uppercase hover:bg-red-600 transition duration-500 py-1 px-2 tracking-wide rounded'>
                  Home
                </a>
              </Link>
              <Link href='/products'>
                <a className='text-white text-lg mr-4 md:mr-6 font-bold uppercase hover:bg-red-600 transition duration-500 py-1 px-2 tracking-wide rounded'>
                  Products
                </a>
              </Link>
            </div>
            <div
              className='-mt-1 flex items-center relative'
              onClick={() => openCart()}
            >
              <AiOutlineShoppingCart color='#fff' size='1.5em' />
              {itemsCount > 0 && (
                <span className='bg-red-500 -right-3 -top-2 absolute h-5 w-5 text-sm flex items-center justify-center rounded-full'>
                  {itemsCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <Cart open={state.displayCart} close={() => closeCart()} />
      {state.displayCart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='h-screen w-screen fixed bg-black bg-opacity-70 z-30'
          onClick={() => closeCart()}
        ></motion.div>
      )}
    </>
  )
}

function Meta() {
  return (
    <Head>
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/apple-touch-icon.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/favicon-16x16.png'
      />
      <link rel='manifest' href='/site.webmanifest' />
      <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#fc0202' />
      <meta name='msapplication-TileColor' content='#da532c' />
      <meta name='theme-color' content='#ffffff' />
      <title>LT Design</title>
      <link
        href='https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'
        rel='stylesheet'
      ></link>
      <script
        async
        src='https://www.googletagmanager.com/gtag/js?id=G-9T4ME2CHDQ'
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          gtag('config', 'G-9T4ME2CHDQ')
          `,
        }}
      />
    </Head>
  )
}
