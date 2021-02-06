import client, { previewClient } from './client'
import groq from 'groq'

export async function getPreviewPostBySlug(slug) {
  const data = await client(
    slug,
  ).fetch(groq`*[_type == "product" && slug.current == $slug][0]`, { slug })
  return data
}
