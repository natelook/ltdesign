import { useState } from 'react'
import useRemoveItem from '@bigcommerce/storefront-data-hooks/cart/use-remove-item'
import useUpdateItem from '@bigcommerce/storefront-data-hooks/cart/use-update-item'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { BiTrash } from 'react-icons/bi'

export default function CartItem({ item, dark }) {
  const [remove, setRemove] = useState(false)
  const [q, setQ] = useState(item.quantity)
  const removeItem = useRemoveItem()
  const updateItem = useUpdateItem(item)

  const updateQuanity = async (val) => {
    setQ(val)
    await updateItem({ quantity: val })
  }

  const handleRemove = async (id) => {
    setRemove(true)
    try {
      await removeItem({ id })
      setRemove(false)
    } catch (error) {
      setRemove(false)
    }
  }

  return (
    <>
      <div className='flex justify-between border-black  border-b px-6 py-2 pb-4 mb-4'>
        <div className={`${dark ? 'text-white' : 'text-black'}`}>
          <span className=' block mb-2'>{item.name}</span>
          {remove ? (
            <span className={`block ${dark ? 'text-white' : 'text-black'}`}>
              Removing ...
            </span>
          ) : (
            <div className='flex justify-between cols-span-2'>
              <div className='flex items-center'>
                <div
                  className='cursor-pointer'
                  onClick={() => updateQuanity(q - 1)}
                >
                  <AiOutlineMinus size='.8em' />
                </div>
                <span className='mx-4 select-none'>{q}</span>
                <div
                  className='cursor-pointer'
                  onClick={() => updateQuanity(q + 1)}
                >
                  <AiOutlinePlus size='.8em' />
                </div>
              </div>
              <span className='select-none'>
                ${Number(item.list_price * q).toFixed(2)} each
              </span>
            </div>
          )}
        </div>
        <div
          className='text-red-500 ml-5 cursor-pointer mt-1'
          onClick={() => handleRemove(item.id)}
        >
          <BiTrash size='1.5em' />
        </div>
      </div>
    </>
  )
}
