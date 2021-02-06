import { getPreviewPostBySlug } from '../../lib/api'

export default async (req, res) => {
  const product = await getPreviewPostBySlug(req.query.slug)

  if (!product) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  res.setPreviewData({})
  res.writeHead(307, { Location: `/${product.slug.current}` })
  res.end()
}
