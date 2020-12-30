import useCart from '@bigcommerce/storefront-data-hooks/cart/use-cart';
import Link from 'next/link';

export default function Cart() {
  const { data, isEmpty } = useCart();
  const items = data?.line_items.physical_items ?? [];
  return (
    <div className='container mx-auto max-w-5xl'>
      <h1 className='text-4xl font-bold mb-2'>Cart</h1>
      {isEmpty && <p>Cart is Empty</p>}

      {items.map((item, i) => (
        <div key={i}>
          <p>Name: {item.name}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Price: {item.list_price}</p>
        </div>
      ))}
      <Link href='/checkout'>
        <a href='bg-red-500 p-2 rounded'>Buy now</a>
      </Link>
    </div>
  );
}
