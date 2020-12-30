import client from '../lib/client';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import Link from 'next/link';
import useAddItem from '@bigcommerce/storefront-data-hooks/cart/use-add-item';
import { useContext } from 'react';
import { UiContext } from '../components/context';

const builder = imageUrlBuilder(client());

function urlFor(source) {
  return builder.image(source);
}

export default function Product({
  title,
  images,
  price,
  bcId,
  bcVariant,
  slug,
}) {
  const { state, dispatch } = useContext(UiContext);
  const addItem = useAddItem();
  const addToCart = async () => {
    try {
      await addItem({
        productId: bcId,
        variantId: bcVariant,
      });
      dispatch({ type: 'OPEN' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center mb-5'>
      <h3 className='text-2xl mb-1 font-bold px-2 text-center'>{title}</h3>
      <div className='relative'>
        <Image
          src={urlFor(images[0]).height(400).width(500).url()}
          height='400'
          width='500'
        />

        <span className='bg-black absolute bottom-3 right-2 text-xl px-3 py-2 rounded select-none tracking tracking-wider font-bold'>
          ${price}
        </span>
      </div>
      <div className='grid md:grid-cols-2 grid-cols-1 gap-3 w-full max-w-md mt-2'>
        <Link href={`/${slug.current}`}>
          <a className='bg-gray-600 text-center text-lg py-2 rounded uppercase font-bold tracking-wide select-none'>
            More
          </a>
        </Link>
        <span
          onClick={() => addToCart()}
          className='bg-red-600 text-center text-lg py-2 rounded uppercase font-bold tracking-wide cursor-pointer select-none'
        >
          Add to Cart
        </span>
      </div>
    </div>
  );
}
