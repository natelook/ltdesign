import axios from 'axios';
import { urlFor } from '../../../lib/client';

import Cors from 'cors';

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
  await runMiddleware(req, res, cors);
  try {
    // Set product object
    const product = req.body;
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

    // Check if creating or updating product
    if (!product.bcId) {
      // Add product to big commerce
      const bigCommerceData = await axios.post(
        BIGCOMMERCE_URL,
        productData,
        BIGCOMMERCE_HEADERS,
      );
      // Update Sanity
      const sanityData = {
        mutations: [
          {
            patch: {
              id: product._id,
              set: {
                bcId: bigCommerceData.data.data.id,
                bcVariant: bigCommerceData.data.data.base_variant_id,
              },
            },
          },
        ],
      };
      await axios.post(SANITY_URL, sanityData, SANITY_HEADERS);

      res.statusCode = 200;
      return res.json({ msg: `Created ${product.title} in Big Commerce.` });
    }

    await axios.put(
      `${BIGCOMMERCE_URL}/${product.bcId}`,
      productData,
      BIGCOMMERCE_HEADERS,
    );

    res.statusCode = 200;
    return res.json({ msg: `Updated ${product.title} in Big Commerce.` });
  } catch (error) {
    res.statusCode = 400;
    console.log(error);
    return res.json({ error });
  }
};
