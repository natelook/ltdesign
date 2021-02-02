import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import client, { urlFor } from '../lib/client'
import groq from 'groq'
import NewProduct from '../components/NewProduct'
import imageUrlBuilder from '@sanity/image-url'
import { InView } from 'react-intersection-observer'

export default function Home({ homeData }) {
  const [innerH, setInnerH] = useState()

  useEffect(() => {
    setInnerH(window.innerHeight * 0.01)
  })

  return (
    <div>
      <div
        className='bg-center bg-cover flex justify-center items-center'
        style={{
          height: `calc(${innerH} * 100px)`,
          backgroundImage: `url(${urlFor(homeData.backgroundImage).url()})`,
        }}
      >
        <div className='z-20 text-center'>
          <div className='container mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className='container max-w-xs mx-auto md:max-w-max'>
                <Image src='/ltlogo.png' height='132' width='567.25' />
              </div>
            </motion.div>
            <motion.h5
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className='text-3xl md:text-5xl text-white line mb-5 leading-snug'
            >
              {homeData.tag}
            </motion.h5>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <HeroButton
              link={homeData.link.current}
              text={homeData.buttonText}
            />
          </motion.div>
        </div>
        <div
          className='bg-black bg-opacity-60 absolute w-full z-10'
          style={{ height: `calc(${innerH} * 100px)` }}
        ></div>
      </div>
      <h2 className='text-white text-4xl uppercase text-center py-5 tracking-wider font-bold'>
        Products
      </h2>
      <FeaturedProducts products={homeData.productListing} />
    </div>
  )
}

function FeaturedProducts({ products }) {
  return (
    <div className='bg-black grid md:grid-cols-3 container mx-auto px-2'>
      {products.map((product, i) => (
        <NewProduct key={i} product={product.product} />
      ))}
    </div>
  )
}

function HeroButton({ link, text }) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Link href={link}>
        <a
          whileHover={{ scale: 1.2 }}
          className='border-2 border-red-600 text-white rounded text-xl py-2 px-3 mt-2 uppercase tracking-widest hover:bg-red-600 transition duration-300 hover:text-white z-30'
        >
          {text}
        </a>
      </Link>
    </motion.div>
  )
}

export async function getStaticProps() {
  const homeData = await client().fetch(groq`*[_type == "home"][0]{
    tag,
    link { current },
    buttonText,
    backgroundImage,
    avalible,
    featured[] {
      image,
      buttonText,
      title,
      buttonColor,
      description,
      product->{slug { current }}
    },
    productListing[] {
      "product": @->
    }
  }`)
  return { props: { homeData } }
}
