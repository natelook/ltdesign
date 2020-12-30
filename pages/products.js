import client from '../lib/client';
import groq from 'groq';
import Product from '../components/Product';

export default function Products({ products }) {
  return (
    <div className='container px-4'>
      <h1 className='text-4xl text-center uppercase my-10 font-bold tracking-widest'>
        All Products
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {products.map((product) => (
          <Product key={product._id} {...product} />
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const products = await client().fetch(
    groq`*[_type == 'product' && public == true]`,
  );
  return { props: { products } };
}