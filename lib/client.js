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
  projectId: process.env.SANITY_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: true,
};
export const usePreviewSubscription = createPreviewSubscriptionHook(options);

export const previewClient = createClient({
  ...options,
  useCdn: true,
  token: API,
});

const client = (usePreview) =>
  usePreview ? previewClient : createClient(options);
export default client;
