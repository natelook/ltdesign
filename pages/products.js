import client from '../lib/client'
import groq from 'groq'
import Product from '../components/Product'
import ProductCard from '../components/ProductCard'
import NewProduct from '../components/NewProduct'
import { useState } from 'react'
import { CgDarkMode } from 'react-icons/cg'

export default function Products({ products }) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div
      className={`${
        darkMode ? 'bg-black text-white' : 'bg-white text-black'
      } transition-colors duration-300`}
    >
      <div className='container px-4 mx-auto'>
        <h1 className='md:text-6xl text-4xl text-center uppercase font-bold tracking-widest pt-5 mb-5'>
          All Products
        </h1>
        <div className='flex flex-wrap justify-center'>
          {products.map((product) => (
            <ProductCard key={product.product._id} product={product.product} />
          ))}
        </div>
      </div>
      <div>
        <div
          className={`fixed bottom-5 left-5 rounded-full shadow-lg transition-colors duration-200 ${
            !darkMode ? 'bg-black text-white' : 'bg-white text-black'
          }`}
          onClick={() => setDarkMode(!darkMode ? true : false)}
        >
          <span className='block p-4 cursor-pointer'>
            <CgDarkMode size='2.5em' />
          </span>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const products = await client().fetch(
    groq`*[_type == 'home'][0] {
      productListing[] {
        "product": @->
      }
    }`,
  )

  return { props: { products: products.productListing } }
}
