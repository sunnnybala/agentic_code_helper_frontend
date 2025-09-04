import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PolicyMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="policy-menu" ref={ref} style={{ position: 'relative' }}>
      <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Open policies">
        ☰
      </button>
      {open && (
        <div className="policy-dropdown" style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #ddd', padding: 8, zIndex: 50 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/refund">Refund & Cancellation</Link></li>
            <li><Link to="/shipping">Shipping Policy</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
}


