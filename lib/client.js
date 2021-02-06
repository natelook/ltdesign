import {
  groq,
  createClient,
  createImageUrlBuilder,
  createProtableTextComponent,
  createPreviewSubscriptionHook,
  createCurrentUserHook,
} from 'next-sanity'

const API = process.env.SANITY_API

const options = {
  projectId: 'k9dvzqe9',
  dataset: 'production',
}
export const usePreviewSubscription = createPreviewSubscriptionHook(options)

export const urlFor = (source) => createImageUrlBuilder(options).image(source)

export const previewClient = createClient({
  projectId: 'k9dvzqe9',
  dataset: 'production',
  useCdn: true,
  token:
    'skNfhoDdt4RDHFI5kavH0hY4Z5stFTKjRwqKsrlcEJqRI5Fk4mE0LEy4jUMrDSag6MqHzvrvGoyKzYLsKY7P41lByHmkuEhBzxYpOrw7AoM83Aan52T5GOTzEuDoHQOOnKDEyYelpVhl3Dp1wunG6WvrizZJlyqdwK36JNToT8qWipKI2hcx',
})

const client = (usePreview) =>
  usePreview ? previewClient : createClient(options)

export default client
