import { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from '../../../data/stripe';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const body = req.body
        // ref. https://stripe.com/docs/api/setup_intents/create
        const setupIntent = await stripeClient.setupIntents.create({
          customer: body.customerId,
          payment_method_types: ['card'],
        });
        res.status(201).send(setupIntent)
        return;
    }
    res.status(400).send({})
}