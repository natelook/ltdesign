import groq from 'groq';
import { useState } from 'react';
import client, { urlFor } from '../lib/client';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import Image from 'next/image';
import { getConfig } from '@bigcommerce/storefront-data-hooks/api';
import getAllProducts from '@bigcommerce/storefront-data-hooks/api/operations/get-all-products';
import useAddItem from '@bigcommerce/storefront-data-hooks/cart/use-add-item';
import YouTube from 'react-youtube';
import { motion } from 'framer-motion';
import { InView } from 'react-intersection-observer';
import getYouTubeId from 'get-youtube-id';
import Modal from '../components/Modal';
import { useContext } from 'react';
import { UiContext } from '../components/context';

const serializers = {
  types: {
    youtube: ({ node }) => {
      const opt = {
        height: '275',
        width: '100%',
      };
      const { url, caption } = node;
      const id = getYouTubeId(url);
      return <YouTube videoId={id} opts={opt} />;
    },
  },
};

export default function Product({ product }) {
  const { state, dispatch } = useContext(UiContext);
  const addItem = useAddItem();
  const [isOpen, setIsOpen] = useState();
  const [selectedImage, setSelectedImage] = useState();

  const addToCart = async () => {
    // Add a set loading
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

  const setPopup = (imageUrl) => {
    setIsOpen(true);
    setSelectedImage(imageUrl);
  };

  return (
    <>
      <div
        className={`container mx-auto md:p-5 ${
          product.images.length == 1 && 'max-w-lg'
        }`}
      >
        <div
          className={`grid grid-cols-1  gap-4 ${
            product.images.length == 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'
          }`}
        >
          <div className='container mx-auto px-4'>
            <div className='sticky mb-2 top-20'>
              <h1
                onClick={() => setIsOpen(true)}
                className='text-3xl font-bold md:text-left text-center'
              >
                {product.title}
              </h1>
              <p className='italic text-gray-200 md:text-left text-lg text-center mb-2'>
                {product.notes}
              </p>
              <div className={`${product.images.length != 1 && 'md:hidden'}`}>
                <Image
                  height='400'
                  width='500'
                  className='rounded-sm mb-2'
                  src={urlFor(product.images[0]).height(400).width(500).url()}
                />
              </div>

              <div className='flex justify-between items-center'>
                <button
                  className='bg-red-500 hover:bg-black transtion duration-300 border-red-500 border-2 text-white px-5 py-2 rounded font-bold uppercase mt-5 mb-5 text-lg'
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
                <span className='text-white text-2xl'>${product.price}</span>
              </div>

              <BlockContent
                blocks={product.body}
                projectId='k9dvzqe9'
                dataset='production'
                serializers={serializers}
              />
            </div>
          </div>
          <div
            className={`text-white grid lg:grid-cols-2 gap-2 px-4 ${
              product.images.length == 1 && 'hidden'
            }`}
          >
            {product.images.map((image, i) => (
              <InView key={i} triggerOnce threshold={0.8}>
                {({ inView, ref, entry }) => (
                  <motion.div
                    ref={ref}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inView ? 1 : 0 }}
                    className='overflow-x-hidden lg:ml-2'
                  >
                    <div
                      onClick={() => {
                        setPopup(urlFor(image).height(600).width(1000).url());
                      }}
                    >
                      <Image
                        height='400'
                        width='500'
                        src={urlFor(image).height(400).width(500).url()}
                      />
                    </div>
                  </motion.div>
                )}
              </InView>
            ))}
          </div>
        </div>
      </div>
      {isOpen && <Modal image={selectedImage} close={() => setIsOpen(false)} />}
    </>
  );
}

export async function getStaticPaths() {
  const products = await client().fetch(
    groq`*[_type == 'product'] { slug { current }}`,
  );
  const paths = products.map((product) => ({
    params: { slug: product.slug.current },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const config = getConfig();
  const product = await client().fetch(
    groq`*[_type == 'product' && slug.current == $slug]`,
    {
      slug: params.slug,
    },
  );
  const bigcommerce = await getAllProducts({ config });
  return {
    props: { product: product[0] },
  };
}
