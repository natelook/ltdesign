import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import client from '../lib/client';

// const builder = imageUrlBuilder(client);

// function urlFor(source) {
//   return builder.image(source);
// }

export default function Modal({ image, close }) {
  return (
    <div
      className='bg-black bg-opacity-70 fixed top-0 z-50 w-full h-screen flex items-center'
      onClick={close}
    >
      <div className='container mx-auto max-w-4xl -mt-20'>
        <Image src={image} height='600' width='1000' />
      </div>
    </div>
  );
}
