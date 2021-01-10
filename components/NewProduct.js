import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { urlFor } from '../lib/client';
import { UiContext } from '../components/context';
import useAddItem from '@bigcommerce/storefront-data-hooks/cart/use-add-item';

export default function NewProduct({ product }) {
  const { state, dispatch } = useContext(UiContext);
  const addItem = useAddItem();
  const addToCart = async () => {
    try {
      await addItem({
        productId: product.bcId,
        variantId: product.bcVariant,
      });
      dispatch({ type: 'OPEN' });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='mx-auto relative mb-10' style={{ maxWidth: '500px' }}>
      <div className='w-full -mb-2'>
        <Link href={product.slug.current}>
          <a>
            <Image
              src={urlFor(product.images[0]).height(500).width(500).url()}
              height='500'
              width='500'
              layout='intrinsic'
            />
          </a>
        </Link>
      </div>
      <div className='text-center py-2 bg-gray-800 bg-opacity-10'>
        <span className='flex text-2xl mb-3 mt-1 px-5 md:h-16 items-center justify-center'>
          {product.title}
        </span>
        <span className='block text-xl'>${product.price}</span>
      </div>
      <div className='grid grid-cols-2'>
        <button className='bg-gray-800 py-3 text-xl uppercase tracking-wider font-bold flex justify-center'>
          <Link href={`${product.slug.current}`}>
            <a>
              <span className='flex items-center'>More</span>
            </a>
          </Link>
        </button>

        <button
          className='bg-red-600 py-3 text-xl uppercase tracking-wider font-bold flex justify-center'
          onClick={() => addToCart()}
        >
          <AiOutlineShoppingCart size='1.5em' />
        </button>
      </div>
    </div>
  );
}
