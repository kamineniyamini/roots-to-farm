import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentForm.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ order, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders?payment_success=true`,
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message);
      onError(submitError.message);
    } else {
      onSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-section">
        <h3>Payment Details</h3>
        <PaymentElement />
      </div>

      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-primary pay-button"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : `Pay $${order.totalAmount}`}
      </button>
    </form>
  );
};

const PaymentForm = ({ order, onSuccess, onError }) => {
  const [clientSecret, setClientSecret] = useState('');

  React.useEffect(() => {
    // Fetch payment intent from your server
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payment/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId: order._id }),
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        onError('Failed to initialize payment');
      }
    };

    if (order) {
      fetchPaymentIntent();
    }
  }, [order, onError]);

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2e7d32',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm 
        order={order} 
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default PaymentForm;