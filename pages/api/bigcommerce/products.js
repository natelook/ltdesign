import client from '../../../lib/client';
import groq from 'groq';
import axios from 'axios';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client());

function urlFor(source) {
  return builder.image(source);
}

const BIGCOMMERCE_URL =
  'https://api.bigcommerce.com/stores/va6axyykm5/v3/catalog/products';

const BIGCOMMERCE_HEADERS = {
  headers: {
    'X-Auth-Token': process.env.BIGCOMMERCE_STORE_API_TOKEN,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
};

const SANITY_URL = 'https://k9dvzqe9.api.sanity.io/v1/data/mutate/production';

const SANITY_HEADERS = {
  headers: {
    Authorization: `Bearer ${process.env.SANITY_API}`,
  },
};

export default async (req, res) => {
  const sanity = await client().fetch(groq`
    *[_type == 'product'] {
      _id,
      title,
      price,
      grams,
      bcId,
      images
    }
  `);

  sanity.forEach((product) => {
    const productData = {
      name: product.title,
      price: product.price,
      weight: product.grams,
      type: 'physical',
      images: [
        {
          image_url: urlFor(product.images[0]).width(300).height(300).url(),
          is_thumbnail: true,
        },
      ],
    };

    if (!product.bcId) {
      axios
        .post(BIGCOMMERCE_URL, productData, BIGCOMMERCE_HEADERS)
        .then((result) => {
          const bigcommerceId = result.data.data.id;
          const bigcommerceBaseVariantId = result.data.data.base_variant_id;

          const sanityUpdate = {
            mutations: [
              {
                patch: {
                  id: product._id,
                  set: {
                    bcId: bigcommerceId,
                    bcVariant: bigcommerceBaseVariantId,
                  },
                },
              },
            ],
          };

          axios
            .post(SANITY_URL, sanityUpdate, SANITY_HEADERS)
            .then(() => console.log(`${product.title} Big Commerce ID added`))
            .catch((error) =>
              console.log({ sanityError: error.response.data.error }),
            );
        })
        .catch((error) => console.log({ bcError: error }));
    } else {
      axios
        .put(
          `${BIGCOMMERCE_URL}/${product.bcId}`,
          productData,
          BIGCOMMERCE_HEADERS,
        )
        .then((result) => {
          const bigcommerceId = result.data.data.id;

          const sanityUpdate = {
            mutations: [
              {
                patch: {
                  id: product._id,
                  set: {
                    bcId: bigcommerceId,
                  },
                },
              },
            ],
          };
        })
        .catch((error) => console.log({ bcError: error }));
    }
  });

  res.statusCode = 200;
  res.json('Updated/Added Items');
};
