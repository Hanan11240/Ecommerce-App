import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js'
import StripeCheckout from '../components/StripeCheckout'
import '../stripe.css';

// load stripe outside of componenents render to avoid recreating stripe object on every render
 const promise = loadStripe('pk_test_51JRZkdSEFgSoqIKjCLlJZxFVPRitRVWQfeCsJBGca8OwjuCRVJ2ytR8odXoECjt5FSNxwxWocRMeH5dutTaL45hv00CCkuNK01')


const Payment = () =>{
    return(

        <div className="container p-5 text-center">
            <h4>Complete your Purchase</h4>
           <Elements stripe={promise}>
           <div className="col-md-8 offset-md-2">
               <StripeCheckout />
           </div>
           </Elements>
        </div>
    )
}


export default Payment;