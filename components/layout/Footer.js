import { AiOutlineInstagram } from 'react-icons/ai';

// script.onload = function () {
//   checkoutKitLoader
//     .load('checkout-sdk')
//     .then(function (module) {
//       var checkoutService = module.createCheckoutService();
//       return checkoutService.loadCheckout(window.checkoutConfig.checkoutId);
//     })
//     .then(function (state) {
//       console.log('Checkout SDK Quickstart', state.data.getCheckout());
//       document.getElementById(window.checkoutConfig.containerId).innerHTML =
//         'Checkout ID: ' + state.data.getCheckout().id;
//     });
// };
// script.src = 'https://checkout-sdk.bigcommerce.com/v1/loader.js';
// document.head.appendChild(script);

export default function Footer() {
  return (
    <div className='bg-gray-800 mt-5 bg-opacity-40'>
      <div className='container max-w-5xl mx-auto text-white py-5 flex justify-between '>
        <p>&copy; {new Date().getFullYear()} LT Design</p>
        {() => bigcommerce()}
        <div className='flex items-center'>
          <a
            href='https://instagram.com/ltpods'
            target='_blank'
            className='flex items-center'
          >
            <AiOutlineInstagram size='1.25em' />
          </a>
          <span className='mx-1'>&bull;</span>
          <p className='mx-1'>Return Policy</p>
          <span className='mx-1'>&bull;</span>
          <p className='mx-1'>Legal Stuff</p>
          <span className='mx-1'>&bull;</span>
          <p className='mx-1'>Contact</p>
        </div>
      </div>
    </div>
  );
}
