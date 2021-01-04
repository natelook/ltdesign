import client from '../../../lib/client';
import groq from 'groq';
import axios from 'axios';
import imageUrlBuilder from '@sanity/image-url';
import Cors from 'cors';

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

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const cors = Cors({
  methods: ['GET', 'POST'],
});

async function createProductUpdateSanity(data, sanityId) {
  try {
    const bigCommerceData = await axios.post(
      BIGCOMMERCE_URL,
      data,
      BIGCOMMERCE_HEADERS,
    );

    const sanityData = {
      mutations: [
        {
          patch: {
            id: sanityId,
            set: {
              bcId: bigCommerceData.data.data.id,
              bcVariant: bigCommerceData.data.data.base_variant_id,
            },
          },
        },
      ],
    };
    // Update Sanity
    await axios.post(SANITY_URL, sanityData, SANITY_HEADERS);
    const message = `Created ${data.name} in Big Commerce`;
    console.log(message);
    return message;
  } catch (error) {
    console.log(error);
  }
}

export default async (req, res) => {
  await runMiddleware(req, res, cors);
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

  const message = [];

  const promises = sanity.map(async (product) => {
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
      // Send Data to Bigcommerce
      await createProductUpdateSanity(productData, product._id);
      message.push(`Created ${product.title} in Big Commerce`);
    } else {
      // Update Big Commerce Product Information
      await axios.put(
        `${BIGCOMMERCE_URL}/${product.bcId}`,
        productData,
        BIGCOMMERCE_HEADERS,
      );
      message.push(`Updated ${product.title} in Big Commerce`);
    }
  });

  await Promise.all(promises);
  res.statusCode = 200;
  return res.json({ message });
};
