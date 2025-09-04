import BuyCredits from '../components/Billing/BuyCredits';

export default function Pricing() {
  return (
    <div className="page">
      <h2>Pricing</h2>
      <p>We offer credits-based pricing. Purchase credits and spend them to solve problems.</p>
      <div className="pricing-grid">
        <div className="pricing-card">
          <h4>Starter</h4>
          <p>5 credits — ₹50</p>
        </div>
        <div className="pricing-card">
          <h4>Pro</h4>
          <p>20 credits — ₹150</p>
        </div>
        <div className="pricing-card">
          <h4>Enterprise</h4>
          <p>100 credits — ₹700</p>
        </div>
      </div>
      <h3>Buy Credits</h3>
      <BuyCredits />
    </div>
  );
}


