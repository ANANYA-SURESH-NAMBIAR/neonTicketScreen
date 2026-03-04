
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TicketPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {};
  const { showId, selectedSeats, totalAmount, movieTitle, theatreName, time } = bookingData;

  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Form field state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bank, setBank] = useState('');
  const [upiId, setUpiId] = useState('');

  const methods = [
    { id: 'netbanking', label: 'Netbanking' },
    { id: 'credit', label: 'Credit Card' },
    { id: 'debit', label: 'Debit Card' },
    { id: 'upi', label: 'UPI' },
  ];

  const validateFields = () => {
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
      if (!cardName.trim()) return 'Please enter the name on card';
      if (!cardNumber.trim()) return 'Please enter the card number';
      if (!expiry.trim()) return 'Please enter the expiry date';
      if (!cvv.trim()) return 'Please enter the CVV';
    } else if (paymentMethod === 'netbanking') {
      if (!bank) return 'Please select a bank';
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim()) return 'Please enter your UPI ID';
    }
    return '';
  };

  const handlePayNow = async () => {
    const error = validateFields();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/book-tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          showId,
          selectedSeats,
          totalAmount,
          paymentMethod
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || 'Booking could not be processed');
      }

      const result = await response.json();
      // Navigate to payment success screen with booking details
      navigate('/payment-success', { state: { booking: result.booking } });
    } catch (err) {
      setValidationError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5F5] font-sans pb-10">
      {/* Header */}
      <header className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center">
          <span className="text-2xl font-black text-[#FF8C00] tracking-tighter mr-2 italic">S</span>
          <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Screenema</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
          </svg>
        </div>
      </header>

      {/* Breadcrumbs */}
      <nav className="px-4 py-3 bg-[#E5EEEE] text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center">
        <span>Path to this page</span>
        <span className="mx-2 text-gray-300">/</span>
        <span className="text-[#FF8C00]">Ticket Payment</span>
      </nav>

      <main className="px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Payment Options */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => { setPaymentMethod(method.id); setValidationError(''); }}
                  className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${paymentMethod === method.id
                    ? 'border-[#FF8C00] bg-white shadow-lg shadow-[#FF8C00]/5'
                    : 'border-transparent bg-white/50 hover:bg-white'
                    }`}
                >
                  <span className={`font-black uppercase tracking-widest text-sm ${paymentMethod === method.id ? 'text-[#FF8C00]' : 'text-gray-400'}`}>
                    {method.label}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${paymentMethod === method.id ? 'text-[#FF8C00]' : 'text-gray-300'}`}>
                    <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Credit / Debit Card Form */}
            {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 animate-in fade-in slide-in-from-top-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Name on Card</label>
                  <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Card Number</label>
                  <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Expiry</label>
                    <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">CVV</label>
                    <input type="password" value={cvv} onChange={e => setCvv(e.target.value)} placeholder="***" className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20" />
                  </div>
                </div>
              </div>
            )}

            {/* Netbanking Form */}
            {paymentMethod === 'netbanking' && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 animate-in fade-in slide-in-from-top-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Select Your Bank</label>
                  <select value={bank} onChange={e => setBank(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20 text-gray-700">
                    <option value="">-- Choose a Bank --</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="bob">Bank of Baroda</option>
                    <option value="canara">Canara Bank</option>
                  </select>
                </div>
              </div>
            )}

            {/* UPI Form */}
            {paymentMethod === 'upi' && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 animate-in fade-in slide-in-from-top-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">UPI ID</label>
                  <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#FF8C00]/20" />
                </div>
              </div>
            )}

            {/* Validation Error */}
            {validationError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                  <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                {validationError}
              </div>
            )}

            {/* Universal Pay Button — always visible */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full bg-[#5D7BFF] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-[#5D7BFF]/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  Pay Rs. {totalAmount || 0}
                </>
              )}
            </button>
          </div>

          {/* Booking Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-[#C2C9FF] p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl">
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

              <h3 className="text-xl font-black text-[#1A1A1A] mb-8 uppercase tracking-widest">Order Summary</h3>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-widest">Movie</span>
                  <span className="text-sm font-black text-[#1A1A1A] text-right ml-4">{movieTitle || 'THE GALACTIC VOYAGE'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-widest">Theatre</span>
                  <span className="text-sm font-black text-[#1A1A1A]">{theatreName || 'PVR: Lulu Mall'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-widest">Showtime</span>
                  <span className="text-sm font-black text-[#1A1A1A]">{time || '10:30 AM'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-widest">Tickets</span>
                  <span className="text-sm font-black text-[#1A1A1A]">{selectedSeats?.length || 0} X Seats</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1A1A1A]/50 uppercase tracking-widest">Taxes</span>
                  <span className="text-sm font-black text-[#1A1A1A]">Rs. 0.00</span>
                </div>
              </div>

              <div className="pt-8 border-t border-black/10 flex justify-between items-center">
                <span className="text-sm font-black text-[#1A1A1A] uppercase tracking-[0.2em]">Total Amount</span>
                <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter">Rs. {totalAmount || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="px-6 py-10 bg-[#00666B] mt-10">
        <div className="flex items-center mb-6">
          <span className="text-white font-black text-2xl tracking-tighter italic mr-2">S</span>
          <span className="text-white font-bold text-xl uppercase tracking-widest">Screenema</span>
        </div>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
          Secured Payment Gateway • © 2026
        </p>
      </footer>
    </div>
  );
};

export default TicketPayment;
