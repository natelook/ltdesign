module.exports = {
  images: {
    domains: ['cdn.sanity.io'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    iconSizes: [],
    path: '/_next/image',
    loader: 'default',
  },
  async rewrites() {
    return [
      {
        source: '/checkout',
        destination: '/api/bigcommerce/checkout',
      },
    ];
  },
};
