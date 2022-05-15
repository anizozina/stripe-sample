import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { FormEvent, useState } from 'react';

export const SetupForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const { error } = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: 'http://localhost:3000/complete',
            }
        });

        if (error) {
            setErrorMessage((error as any).message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button disabled={!stripe}>Submit</button>
            {errorMessage && <div>{errorMessage}</div>}
        </form>
    )
};
