import {
  groq,
  createClient,
  createImageUrlBuilder,
  createProtableTextComponent,
  createPreviewSubscriptionHook,
  createCurrentUserHook,
} from 'next-sanity';

const API = process.env.SANITY_API;

const options = {
  projectId: 'k9dvzqe9',
  dataset: 'production',
  useCdn: true,
};
export const usePreviewSubscription = createPreviewSubscriptionHook(options);

export const urlFor = (source) => createImageUrlBuilder(options).image(source);

export const previewClient = createClient({
  ...options,
  useCdn: true,
  token: API,
});

const client = (usePreview) =>
  usePreview ? previewClient : createClient(options);
export default client;
