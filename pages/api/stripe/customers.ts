import { NextApiRequest, NextApiResponse } from 'next';
import { stripeClient } from '../../../data/stripe';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(`Request URL: ${req.url}`)
    if (req.method === 'POST') {
        const body = req.body
        const customer = await searchCustomerByKey(body.email);
        
        if (!customer) {
            const customer = await stripeClient.customers.create(
                { ...body }
            );
            console.log(`customer is created. ${JSON.stringify(customer)}`)
            res.status(201).json(customer);
        } else {
            console.log(`customer is already registered.`)
            res.status(200).json(customer)
        }
        return;
    }
    res.status(400).send({})
}

const searchCustomerByKey = async (email: string) => {
    const customers = await stripeClient.customers.search({
        // ref. https://stripe.com/docs/search#search-query-language
        query: `email:'${email}'`,
    })
    const ret = customers.data
    if (ret?.length > 0) {
        return ret[0]
    }
    return undefined;
}