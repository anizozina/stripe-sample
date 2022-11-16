import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ''
);
const Status = () => {
  const stripe = useStripe();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!stripe) {
      return;
    }
    // Retrieve the "setup_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      'setup_intent_client_secret'
    );

    // Retrieve the SetupIntent
    stripe.retrieveSetupIntent(clientSecret || '').then(({ setupIntent }) => {
      // Inspect the SetupIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (setupIntent?.status) {
        case 'succeeded':
          setMessage('Success! Your payment method has been saved. ');
          break;

        case 'processing':
          setMessage(
            "Processing payment details. We'll update you when processing is complete."
          );
          break;

        case 'requires_payment_method':
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setMessage(
            'Failed to process payment details. Please try another payment method.'
          );
          break;
      }
    });
  }, [stripe]);
  return (
    <div>
      <h1>Complete!</h1>
      <p>{message}</p>
    </div>
  );
};
const Complete = () => {
  return (
    <Elements stripe={stripePromise}>
      <Status />
    </Elements>
  );
};

export default Complete;
