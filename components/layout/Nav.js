import Head from 'next/head'
import Link from 'next/link'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import Cart from '../cart/Cart'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import useCart from '@bigcommerce/storefront-data-hooks/cart/use-cart'
import { useContext } from 'react'
import { UiContext } from '../context'
import Image from 'next/image'
import cn from 'classnames'
import { route } from 'next/dist/next-server/server/router'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { useState, useEffect } from 'react'
import { usePreventScroll } from '@react-aria/overlays'

const date = 'date'

const countItem = (count, item) => count + item.quantity
const countItems = (count, items) => items.reduce(countItem, count)

export default function Nav() {
  const { state, dispatch } = useContext(UiContext)
  const router = useRouter()
  const { data } = useCart()
  const [transparent, setTransparent] = useState()

  useEffect(() => {
    router.pathname == '/' ? setTransparent(true) : setTransparent(false)
  }, [router.query])

  useScrollPosition(({ currPos }) => {
    if (router.pathname == '/') {
      if (currPos.y < -75) {
        console.log(true)
        setTransparent(false)
      }

      if (!transparent) {
        if (currPos.y > -75) {
          setTransparent(true)
        }
      }
    }
  })

  const itemsCount = Object.values(data?.line_items ?? {}).reduce(countItems, 0)

  const openCart = () => {
    dispatch({ type: 'OPEN' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE' })
  }

  usePreventScroll({
    isDisabled: !state.displayCart,
  })

  return (
    <>
      <div>
        <Meta />
        <div
          className={cn(
            'bg-black fixed w-full z-30 py-4 md:py-5 transition-colors duration-500',
            {
              'bg-opacity-0': transparent,
            },
          )}
        >
          <div className='mx-auto px-10 flex md:flex-row flex-col items-center justify-between'>
            <div className='flex items-center md:pt-2 pb-3  md:pb-0'>
              <Link href='/'>
                <a className='block'>
                  <Image src='/logo-logo.png' width='250' height='51' />
                </a>
              </Link>
            </div>
            <div className='relative flex justify-between md:justify-end items-center cursor-pointer -mt-1 space-x-20 md:space-x-0'>
              <Link href='/products'>
                <a className='text-white text-lg -ml-5 md:ml-0 md:mr-6 font-bold uppercase hover:bg-red-600 transition duration-200 py-1 px-2 tracking-wide rounded block'>
                  Products
                </a>
              </Link>

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
