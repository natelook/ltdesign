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
    <div className='mx-auto relative w-full'>
      <div className='w-full -mb-2'>
        <Image
          src={urlFor(product.images[0]).height(520).width(700).url()}
          height='520'
          width='700'
          layout='intrinsic'
        />
      </div>
      <div className='text-center py-2 bg-gray-800 bg-opacity-10'>
        <span className='block text-2xl mb-3 mt-1'>{product.title}</span>
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
