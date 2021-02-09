import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { GrView } from 'react-icons/gr'
import { HiDotsHorizontal } from 'react-icons/hi'
import { urlFor } from '../lib/client'
import { UiContext } from '../components/context'
import useAddItem from '@bigcommerce/storefront-data-hooks/cart/use-add-item'

export default function NewProduct({ product }) {
  const { state, dispatch } = useContext(UiContext)
  const addItem = useAddItem()
  const addToCart = async () => {
    try {
      await addItem({
        productId: product.bcId,
        variantId: product.bcVariant,
      })
      dispatch({ type: 'OPEN' })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Link href={`/${product.slug.current}`}>
      <a>
        <div className='mx-2 mb-5 border-4 hover:border-red-500 border-transparent md:p-3 cursor-pointer transition duration-100'>
          <Image
            height='250'
            width='350'
            src={urlFor(product.images[0]).height(250).width(350).url()}
          />
          <div className='text-center'>
            <div className='max-w-xs px-2 mx-auto'>
              <h3 className='mt-1 text-sm md:text-lg text-center font-bold capitalize'>
                {product.title}
              </h3>
            </div>
            <span className='text-center text-sm md:text-lg'>
              ${product.price}
            </span>
          </div>
        </div>
      </a>
    </Link>
  )
}
