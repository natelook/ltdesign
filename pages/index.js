import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import client, { urlFor } from '../lib/client';
import groq from 'groq';
import imageUrlBuilder from '@sanity/image-url';
import { InView } from 'react-intersection-observer';

export default function Home({ homeData }) {
  const [innerH, setInnerH] = useState();

  useEffect(() => {
    setInnerH(window.innerHeight * 0.01);
  });

  return (
    <div>
      <div
        className='bg-hero bg-center bg-cover flex justify-center items-center'
        style={{ height: `calc(${innerH} * 100px)` }}
      >
        <div className='z-20 text-center'>
          <div className='container mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className='container max-w-xs mx-auto md:max-w-max'>
                <Image src='/ltlogo.png' height='132' width='567.25' />
              </div>
            </motion.div>
            <motion.h5
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className='text-3xl md:text-5xl text-white line mb-5 leading-snug'
            >
              {homeData.tag}
            </motion.h5>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <HeroButton
              link={homeData.link.current}
              text={homeData.buttonText}
            />
          </motion.div>
        </div>
        <div
          className='bg-black bg-opacity-10 absolute w-full z-10'
          style={{ height: '75vh' }}
        ></div>
      </div>
      <FeaturedProducts products={homeData.featured} />
    </div>
  );
}

let initialDealay = 0.3;

const transitions = {
  delay: initialDealay,
  duration: 0.5,
};

function FeaturedProducts({ products }) {
  return (
    <div className='bg-black pt-5 container mx-auto'>
      {products.map((product, i) => (
        <InView key={i} triggerOnce threshold={0.5}>
          {({ inView, ref, entry }) => (
            <motion.div
              ref={ref}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={transitions}
              className='flex flex-col md:flex-row'
            >
              <div className='flex flex-col md:flex-row md:mb-2 '>
                <FeaturedImage
                  image={product.image}
                  buttonText={product.buttonText}
                  title={product.title}
                  buttonColor={product.buttonColor}
                  slug={product.product.slug.current}
                />
                <div
                  className={`text-center px-5 flex-1 py-20 md:py-0 flex justify-center items-center ${
                    i % 2 && 'md:order-first'
                  } `}
                >
                  <h3 className='text-white text-center text-4xl font-bold mb-2'>
                    {product.description}
                  </h3>
                </div>
              </div>
            </motion.div>
          )}
        </InView>
      ))}
    </div>
  );
}

function FeaturedImage({ image, buttonText, title, buttonColor, slug }) {
  return (
    <div className='relative flex-1'>
      <img
        src={urlFor(image).width(1400).height(900).url()}
        className='w-full relative'
      />
      <div className='absolute bottom-2 left-2 p-3 bg-black z-10 rounded-md'>
        <h3 className='text-white md:text-3xl text-2xl font-bold'>{title}</h3>
        <Link href={`/${slug}`}>
          <a
            className={`w-full text-white p-2 block text-center mt-3 rounded-md text-xl font-bold ${buttonColor}`}
          >
            {buttonText}
          </a>
        </Link>
      </div>
    </div>
  );
}

function HeroButton({ link, text }) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Link href={link}>
        <a
          whileHover={{ scale: 1.2 }}
          className='border-2 border-red-600 text-white rounded text-xl py-2 px-3 mt-2 uppercase tracking-widest hover:bg-red-600 transition duration-300 hover:text-white z-30'
        >
          {text}
        </a>
      </Link>
    </motion.div>
  );
}

export async function getStaticProps() {
  const homeData = await client().fetch(groq`*[_type == "home"][0]{
    tag,
    link { current },
    buttonText,
    featured[] {
      image,
      buttonText,
      title,
      buttonColor,
      description,
      product->{slug { current }}
    }
  }`);
  return { props: { homeData } };
}
