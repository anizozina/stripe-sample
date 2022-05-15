import { useEffect, useState } from "react";
import Stripe from "stripe"

export const useCustomer = () => {
    const [customer, setCustomer] = useState<Stripe.Customer | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCustomer(readCustomer());
        setLoading(false);
    }, []);

    return {
        customer,
        loading,
    };
}
export const saveCustomer = (customer: Stripe.Customer) => {
    sessionStorage.setItem('customer', JSON.stringify(customer))
}
const readCustomer = (): Stripe.Customer | undefined => {
    const customer = sessionStorage.getItem('customer');
    return customer ? JSON.parse(customer) : undefined
}