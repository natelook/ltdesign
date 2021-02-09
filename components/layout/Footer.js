import Link from 'next/link'

export default function Footer() {
  return (
    <div className='border-t border-gray-600 mt-5 py-5 px-5 text-center text-sm md:text-md'>
      <div className='max-w-xl mx-auto'>
        <p>&copy; {new Date().getFullYear()} LT Design</p>
        <ul className='flex justify-between my-5'>
          <li>
            <Link href='/products'>
              <a>All Products</a>
            </Link>
          </li>
          <li>
            <a href='mailto:ltledpods@gmail.com'>Contact Us</a>
          </li>
          <li>
            <a href='https://www.instagram.com/liftedtundras/' target='ltpods'>
              Instagram
            </a>
          </li>
          <li>
            <a href='https://www.instagram.com/liftedtundras/' target='_blank'>
              Lifted Tundras
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
