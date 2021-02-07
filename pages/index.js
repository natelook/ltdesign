import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import client, { urlFor } from '../lib/client'
import groq from 'groq'
import ProductCard from '../components/ProductCard'
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
        className='bg-center bg-cover flex justify-center items-center h-seventy md:h-eighty'
        style={{
          backgroundImage: `url(${urlFor(homeData.backgroundImage)
            .width(2000)
            .height(800)
            .url()})`,
        }}
      >
        <div className='z-20 text-center max-w-xl'>
          <div className='container mx-auto'>
            <h5 className='text-3xl md:text-5xl text-white line mb-5 '>
              {homeData.tag}
            </h5>
          </div>
          <HeroButton link={homeData.link.current} text={homeData.buttonText} />
        </div>
        <div className='bg-black bg-opacity-60 absolute w-full z-10 h-seventy md:h-eighty'></div>
      </div>
      <h2 className='text-white text-4xl md:text-6xl uppercase text-center py-10 tracking-widest font-bold'>
        <Link href='/products'>
          <a>All Products</a>
        </Link>
      </h2>
      <FeaturedProducts products={homeData.productListing} />
    </div>
  )
}

function FeaturedProducts({ products }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 place-items-center place-content-center container px-4 mx-auto'>
      {products.map((product, i) => (
        <ProductCard key={i} product={product.product} />
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
