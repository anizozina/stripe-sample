import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Stripe from 'stripe';
import { SetupForm } from '../components/SetupForm';
import { saveCustomer, useCustomer } from '../hooks/storage';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

const Home: NextPage = () => {
  const [email, setEmail] = useState('')
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('')
  const [customer, setCustomer] = useState<Stripe.Customer | undefined>();
  const { customer: savedCustomer, loading } = useCustomer();
  useEffect(() => {
    if (loading) setCustomer(savedCustomer)
  }, [
    loading,
    savedCustomer
  ])

  const [clientSecret, setSecretKey] = useState('')
  const registerCustomer = async () => {
    try {
      setProcessing(true);
      const ret = await fetch('/api/stripe/customers', {
        method: 'POST',
        body: JSON.stringify({
          email
        }),
        headers: {
          'content-type': 'application/json'
        }
      })
      const customer = await ret.json()
      setCustomer(customer);
      saveCustomer(customer);
      const intentResponse = await fetch('/api/stripe/intents', {
        method: 'POST',
      })
      const intent: Stripe.SetupIntent = await intentResponse.json()
      setSecretKey(intent.client_secret || '')
    } catch (err) {
      console.error(err);
      setMessage((err as any).message);
    } finally {
      setProcessing(false)
    }
  }
  return (
    <>
      {!clientSecret && (
        <div>
          <label>Input Mail Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
          <button onClick={registerCustomer} disabled={processing}>submit</button>
          <p>{message}</p>
        </div>
      )}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }} >
          <SetupForm />
        </Elements>)}
    </>
  );
};

export default Home