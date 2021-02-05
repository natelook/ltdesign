import type { InferGetStaticPropsType } from 'next'
import { useState } from 'react'
import groq from 'groq'
import { CgDarkMode } from 'react-icons/cg'
import client from '../lib/client'
import ProductCard from '../components/ProductCard'

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

export default function Products({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className='bg-black text-white'>
      <div className='container px-4 mx-auto'>
        <h1 className='md:text-6xl text-4xl text-center uppercase font-bold tracking-widest pt-5 mb-5'>
          All Products
        </h1>
        <div className='grid md:grid-cols-3 place-items-center place-content-center container px-4 mx-auto'>
          {products.map((product: any) => (
            <ProductCard key={product.product._id} product={product.product} />
          ))}
        </div>
      </div>
    </div>
  )
}
