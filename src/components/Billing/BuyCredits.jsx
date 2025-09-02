import { useState } from 'react';
import { PaymentsAPI } from '../../services/api';

export default function BuyCredits() {
  const [credits, setCredits] = useState(10);
  const [error, setError] = useState('');

  const onBuy = async () => {
    setError('');
    console.log('[BuyCredits] onBuy called, credits:', credits);
    try {
      const res = await PaymentsAPI.createOrder(Number(credits));
      console.log('[BuyCredits] createOrder response:', res);
      if (!res.success) { setError(res.error || 'Failed to create order'); return; }
      const options = {
        key: res.razorpayKeyId,
        amount: res.amount,
        currency: res.currency,
        name: 'Code Turtle',
        description: `${credits} credits`,
        order_id: res.orderId,
        handler: async function (response) {
          const verifyRes = await PaymentsAPI.verify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          if (!verifyRes.success) setError('Payment verification failed');
        }
      };
      if (!window.Razorpay) {
        setError('Razorpay checkout is not available. Make sure checkout script is loaded.');
        console.error('Razorpay not available on window');
        return;
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setError(e.message || 'Failed to buy credits');
    }
  };

  return (
    <div className="buy-credits">
      <input type="number" min="1" value={credits} onChange={e => setCredits(Number(e.target.value))} />
      <button type="button" onClick={onBuy}>Buy Credits (₹5 each)</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}


