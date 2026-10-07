import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { DigitalPass, DonationRecord } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { verifyNpciUtr } from '../utils/upiVerification';
import { openRazorpayCheckout } from '../utils/razorpay';
import { 
  Ticket, 
  Heart, 
  CheckCircle2, 
  Download, 
  Printer, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  QrCode,
  UserCheck,
  Building,
  Award,
  Copy,
  Check,
  Lock,
  ArrowRight,
  Shield,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';

export const PassesAndDonation: React.FC = () => {
  const { language, createPass, createDonation, upiId, registerModalOpen } = useApp();

  const [activeTab, setActiveTab] = useState<'pass' | 'donation'>('donation');

  // Pass Form State
  const [passForm, setPassForm] = useState({
    passType: 'Senior Citizen' as DigitalPass['passType'],
    fullName: '',
    phone: '',
    idProofNumber: '',
    numberOfGuests: 1,
    visitDate: '2026-10-18',
    timeSlot: '09:00 AM - 12:00 PM'
  });
  const [generatedPass, setGeneratedPass] = useState<DigitalPass | null>(null);

  // Donation Form State
  const [donationForm, setDonationForm] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: 251,
    category: 'Bhog Seva' as DonationRecord['category'],
    paymentMethod: 'UPI' as 'UPI' | 'Card' | 'NetBanking'
  });
  const [generatedDonation, setGeneratedDonation] = useState<DonationRecord | null>(null);
  const [customAmountInput, setCustomAmountInput] = useState('251');

  // Real-time Payment Input States
  const [copiedVpa, setCopiedVpa] = useState(false);

  // Card
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // NetBanking
  const [selectedBank, setSelectedBank] = useState('SBI');

  // Interactive Payment Gateway Modal Simulation State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    registerModalOpen('payment-modal', isProcessingPayment);
    return () => registerModalOpen('payment-modal', false);
  }, [isProcessingPayment, registerModalOpen]);
  const [paymentStep, setPaymentStep] = useState<'connecting' | 'upi_qr' | 'otp' | 'success'>('connecting');
  const [otpInput, setOtpInput] = useState('123456');

  // Payment confirmation & verification state
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState('');
  const [verifiedBankName, setVerifiedBankName] = useState('');

  const verifyUpiPaymentReceived = () => {
    const res = verifyNpciUtr(utrInput);
    if (!res.isValid) {
      setUtrError(res.errorMessage || '⚠️ Invalid UTR Number!');
      return;
    }
    setUtrError('');
    setIsVerifyingUpi(true);
    setTimeout(() => {
      setIsVerifyingUpi(false);
      setIsPaymentConfirmed(true);
      if (res.bankName) setVerifiedBankName(res.bankName);
    }, 1800);
  };

  const handleRazorpayCheckout = () => {
    const finalAmt = Number(customAmountInput) || donationForm.amount;
    openRazorpayCheckout({
      amount: finalAmt,
      donorName: donationForm.donorName || 'Devotee',
      email: donationForm.email || 'donor@jharapada.org',
      phone: donationForm.phone || '9999999999',
      onSuccess: (payment) => {
        setUtrInput(payment.razorpay_payment_id);
        setIsPaymentConfirmed(true);
        setVerifiedBankName('Razorpay Verified Gateway');
        confirmPaymentAndGenerateReceipt();
      },
      onFailure: (err) => {
        alert(err || 'Payment cancelled or failed.');
      }
    });
  };

  const triggerMarigoldConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#D4AF37', '#B8001F', '#FFFFFF', '#FF8C00']
    });
  };

  const handlePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passForm.fullName || !passForm.phone) return;
    const newPass = createPass(passForm);
    setGeneratedPass(newPass);
    triggerMarigoldConfetti();
  };

  // Real-time Payment Verification & Checkout Trigger
  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationForm.donorName || !donationForm.phone) {
      alert('Please enter Donor Name and Mobile Number!');
      return;
    }

    const finalAmt = Number(customAmountInput) || donationForm.amount;
    if (finalAmt <= 0) {
      alert('Please enter a valid donation amount!');
      return;
    }

    setIsProcessingPayment(true);
    setIsPaymentConfirmed(false);
    setIsVerifyingUpi(false);
    setUtrInput('');
    setUtrError('');

    if (donationForm.paymentMethod === 'UPI') {
      setPaymentStep('upi_qr');
    } else {
      setPaymentStep('connecting');
      setTimeout(() => {
        setPaymentStep('otp');
      }, 1500);
    }
  };

  const confirmPaymentAndGenerateReceipt = () => {
    setPaymentStep('success');
    setTimeout(() => {
      setIsProcessingPayment(false);
      const finalAmt = Number(customAmountInput) || donationForm.amount;
      const refNo = utrInput.trim() ? `UTR-${utrInput.trim()}` : ('PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase());
      const record = createDonation({
        ...donationForm,
        amount: finalAmt,
        paymentId: refNo
      });
      setGeneratedDonation(record);
      triggerMarigoldConfetti();
    }, 1200);
  };

  return (
    <section id="passes-donations" className="py-16 bg-[#FFFDF8] relative text-amber-950 border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[#B8001F] text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#B8001F]" />
            <span>{language === 'en' ? 'Digital Passes & E-Donation Portal' : 'ଇ-ପାସ୍ ଓ ଅନଲାଇନ୍ ଦାନ'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-royal royal-gold-heading mb-3">
            {language === 'en' ? 'VIP QR Pass & Online E-Donations' : 'VIP ଇ-ପାସ୍ ଓ ଅନଲାଇନ୍ ସେବା ଦାନ'}
          </h2>
          <p className="text-amber-950/80 text-sm sm:text-base font-medium">
            {language === 'en'
              ? 'Get instant fast-track QR passes for Senior Citizens/VIPs or contribute to Bhog Seva with instant 80G e-Receipt.'
              : 'ବରିଷ୍ଠ ନାଗରିକଙ୍କ ପାଇଁ ତୁରନ୍ତ ଇ-ପାସ୍ ସୃଷ୍ଟି କରନ୍ତୁ ଏବଂ ଅନଲାଇନ୍ ମାଧ୍ୟମରେ ମହାପ୍ରସାଦ ସେବା ଦାନ କରନ୍ତୁ ।'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="glass-card p-1.5 rounded-2xl flex items-center gap-2 shadow-md">
            <button
              onClick={() => setActiveTab('pass')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'pass'
                  ? 'crimson-button text-white shadow-md'
                  : 'text-amber-950 hover:bg-amber-100/60'
              }`}
            >
              <Ticket className="w-4 h-4 text-[#FFD700]" />
              <span>{language === 'en' ? 'Get Express QR Pass' : 'ଇ-ପାସ୍ ହାସଲ କରନ୍ତୁ'}</span>
            </button>

            <button
              onClick={() => setActiveTab('donation')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'donation'
                  ? 'crimson-button text-white shadow-md'
                  : 'text-amber-950 hover:bg-amber-100/60'
              }`}
            >
              <Heart className="w-4 h-4 fill-current text-rose-300" />
              <span>{language === 'en' ? 'Instant E-Donation' : 'ଅନଲାଇନ୍ ଦାନ'}</span>
            </button>
          </div>
        </div>

        {/* PASS TAB */}
        {activeTab === 'pass' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Pass Registration Form */}
            <div className="lg:col-span-7 glass-card p-6 rounded-2xl border-t-4 border-t-[#B8001F] shadow-md">
              <h3 className="text-xl font-bold font-serif-royal text-[#7D0000] mb-2 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#B8001F]" />
                <span>{language === 'en' ? 'Senior Citizen / VIP Express Pass Form' : 'ବରିଷ୍ଠ ନାଗରିକ ଓ ଭିନ୍ନକ୍ଷମ ପାସ୍ ବୁକିଂ'}</span>
              </h3>
              <p className="text-xs text-amber-950/80 font-medium mb-6">
                {language === 'en' ? 'Generates an express QR pass for Gate-B fast-track entry with wheelchair support.' : 'ଗେଟ୍-B ସ୍ୱତନ୍ତ୍ର ପ୍ରବେଶ ଦ୍ୱାର ପାଇଁ QR ପାସ୍ ହାସଲ କରନ୍ତୁ ।'}
              </p>

              <form onSubmit={handlePassSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      {language === 'en' ? 'Pass Category' : 'ପାସ୍ ଶ୍ରେଣୀ'}
                    </label>
                    <select
                      value={passForm.passType}
                      onChange={(e) => setPassForm({ ...passForm, passType: e.target.value as any })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                    >
                      <option value="Senior Citizen">Senior Citizen (Age 60+)</option>
                      <option value="Differently Abled">Differently Abled (Divyangjan)</option>
                      <option value="VIP Guest">VIP Special Guest</option>
                      <option value="Committee Patron">Committee Patron</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      {language === 'en' ? 'Full Name' : 'ସମ୍ପୂର୍ଣ୍ଣ ନାମ'}
                    </label>
                    <input
                      type="text"
                      value={passForm.fullName}
                      onChange={(e) => setPassForm({ ...passForm, fullName: e.target.value })}
                      placeholder="e.g. Rabindra Nath Dash"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      {language === 'en' ? 'Mobile Number' : 'ମୋବାଇଲ୍ ନମ୍ବର'}
                    </label>
                    <input
                      type="tel"
                      value={passForm.phone}
                      onChange={(e) => setPassForm({ ...passForm, phone: e.target.value })}
                      placeholder="+91 98610 XXXXX"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      {language === 'en' ? 'ID Proof No (Aadhaar / Voter ID)' : 'ପରିଚୟ ପତ୍ର ନମ୍ବର'}
                    </label>
                    <input
                      type="text"
                      value={passForm.idProofNumber}
                      onChange={(e) => setPassForm({ ...passForm, idProofNumber: e.target.value })}
                      placeholder="XXXX XXXX 1234"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      {language === 'en' ? 'Preferred Visit Date' : 'ଦର୍ଶନ ତାରିଖ'}
                    </label>
                    <select
                      value={passForm.visitDate}
                      onChange={(e) => setPassForm({ ...passForm, visitDate: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                    >
                      <option value="2026-10-16">Oct 16 (Maha Shasthi)</option>
                      <option value="2026-10-17">Oct 17 (Maha Saptami)</option>
                      <option value="2026-10-18">Oct 18 (Maha Ashtami Sandhi Puja)</option>
                      <option value="2026-10-19">Oct 19 (Maha Navami)</option>
                      <option value="2026-10-20">Oct 20 (Vijayadasami Ravan Podi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      {language === 'en' ? 'Time Slot' : 'ସମୟ'}
                    </label>
                    <select
                      value={passForm.timeSlot}
                      onChange={(e) => setPassForm({ ...passForm, timeSlot: e.target.value })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                    >
                      <option value="08:00 AM - 12:00 PM">08:00 AM - 12:00 PM (Morning Pushpanjali)</option>
                      <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM (Evening Sandhya Aarti)</option>
                      <option value="07:00 PM - 10:00 PM">07:00 PM - 10:00 PM (Night Illuminations)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full crimson-button py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md"
                >
                  <QrCode className="w-4 h-4 text-[#FFD700]" />
                  <span>{language === 'en' ? 'Generate Instant Digital QR Pass' : 'ଇ-ପାସ୍ QR କୋଡ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ'}</span>
                </button>
              </form>
            </div>

            {/* Generated QR Pass Preview Card */}
            <div className="lg:col-span-5">
              {generatedPass ? (
                <div className="glass-card-gold p-6 rounded-2xl border-2 border-[#D4AF37] text-center shadow-xl animate-fadeIn relative">
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
                      VERIFIED PASS
                    </span>
                  </div>

                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#B8001F] flex items-center justify-center text-[#FFD700] shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>

                  <h4 className="text-xl font-bold font-serif-royal text-[#7D0000]">
                    Jharapada Durga Puja 2026
                  </h4>
                  <p className="text-xs text-amber-950/80 font-medium mb-4">Express Fast-Track Entrance QR Pass</p>

                  {/* QR Code Container */}
                  <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-md border-4 border-[#B8001F]">
                    <QRCodeSVG value={generatedPass.qrCodeValue} size={150} level="H" />
                  </div>

                  <div className="bg-white/90 p-3 rounded-xl text-left text-xs space-y-1.5 border border-amber-200 mb-4 shadow-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-900/70 font-semibold">Pass ID:</span>
                      <span className="font-bold text-[#8B0000]">{generatedPass.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-900/70 font-semibold">Name:</span>
                      <span className="font-bold text-amber-950">{generatedPass.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-900/70 font-semibold">Category:</span>
                      <span className="font-bold text-amber-700">{generatedPass.passType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-900/70 font-semibold">Gate:</span>
                      <span className="font-bold text-emerald-700">Gate-B (Jharapada Jail Side)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-900/70 font-semibold">Valid Date:</span>
                      <span className="font-bold text-amber-950">{generatedPass.visitDate} ({generatedPass.timeSlot})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="w-full crimson-button py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-[#FFD700]" />
                    <span>{language === 'en' ? 'Print / Download QR Pass' : 'ପ୍ରିଣ୍ଟ କରନ୍ତୁ'}</span>
                  </button>
                </div>
              ) : (
                <div className="glass-card p-8 rounded-2xl text-center border-dashed border-2 border-amber-300">
                  <QrCode className="w-16 h-16 text-amber-600/70 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-lg font-bold text-[#7D0000] font-serif-royal mb-2">
                    {language === 'en' ? 'Your QR Pass Will Appear Here' : 'ଆପଣଙ୍କ QR ପାସ୍ ଏଠାରେ ଦେଖାଯିବ'}
                  </h4>
                  <p className="text-xs text-amber-950/70 font-medium">
                    {language === 'en' ? 'Fill in your details on the left form to generate an instant express entrance QR pass.' : 'ବାମ ପଟ ଫର୍ମ ପୂରଣ କରି ତୁରନ୍ତ ଇ-ପାସ୍ ହାସଲ କରନ୍ତୁ ।'}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* DONATION TAB */}
        {activeTab === 'donation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Donation Form & Real-time Payment Options */}
            <div className="lg:col-span-7 glass-card p-6 rounded-2xl border-t-4 border-t-amber-500 shadow-md">
              <h3 className="text-xl font-bold font-serif-royal text-[#7D0000] mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#B8001F] fill-[#B8001F]" />
                <span>{language === 'en' ? 'Bhog Seva & Festival Welfare E-Donation' : 'ଅନଲାଇନ୍ ସେବା ଦାନ'}</span>
              </h3>
              <p className="text-xs text-amber-950/80 font-medium mb-6">
                {language === 'en' ? 'Support community Mahaprasad distribution & socio-cultural activities. Instant 80G tax benefit receipt generated.' : 'ମହାପ୍ରସାଦ ବଣ୍ଟନ ଏବଂ ସାମାଜିକ କାର୍ଯ୍ୟକ୍ରମ ପାଇଁ ସହଯୋଗର ହାତ ବଢ଼ାନ୍ତୁ ।'}
              </p>

              <form onSubmit={handleDonationSubmit} className="space-y-5">
                
                {/* Preset Amount Badges */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-2">
                    {language === 'en' ? 'Select Donation Amount (₹)' : 'ଦାନ ପରିମାଣ ବାଛନ୍ତୁ (ଟଙ୍କା)'}
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[251, 1001, 2100, 5001].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setCustomAmountInput(amt.toString());
                          setDonationForm(prev => ({ ...prev, amount: amt }));
                        }}
                        className={`py-2.5 rounded-xl font-extrabold text-xs transition-all border ${
                          customAmountInput === amt.toString()
                            ? 'crimson-button text-white shadow-md scale-105'
                            : 'bg-white text-amber-950 border-amber-300 hover:border-amber-500'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-[#B8001F]">₹</span>
                    <input
                      type="number"
                      value={customAmountInput}
                      onChange={(e) => setCustomAmountInput(e.target.value)}
                      placeholder="Enter custom amount (₹)"
                      className="w-full bg-white border border-amber-300 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-amber-950 focus:outline-none focus:border-[#B8001F]"
                      required
                    />
                  </div>
                </div>

                {/* Donor Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      {language === 'en' ? 'Donor Full Name' : 'ଦାତାଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ନାମ'}
                    </label>
                    <input
                      type="text"
                      value={donationForm.donorName}
                      onChange={(e) => setDonationForm({ ...donationForm, donorName: e.target.value })}
                      placeholder="e.g. Soumya Ranjan Patnaik"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      {language === 'en' ? 'Mobile Number' : 'ମୋବାଇଲ୍ ନମ୍ବର'}
                    </label>
                    <input
                      type="tel"
                      value={donationForm.phone}
                      onChange={(e) => setDonationForm({ ...donationForm, phone: e.target.value })}
                      placeholder="+91 94370 XXXXX"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      {language === 'en' ? 'Seva Category' : 'ସେବା ବର୍ଗ'}
                    </label>
                    <select
                      value={donationForm.category}
                      onChange={(e) => setDonationForm({ ...donationForm, category: e.target.value as any })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 focus:outline-none focus:border-[#B8001F]"
                    >
                      <option value="Bhog Seva">Maha Ashtami Bhog & Mahaprasad Distribution Seva</option>
                      <option value="Gold Sanctum">Goddess Gold & Silver Ornament Decor Seva</option>
                      <option value="Illumination">Bauda Garh Fort Gate Illumination Seva</option>
                      <option value="General Welfare">Socio-Cultural & Medical Aid Fund</option>
                    </select>
                  </div>
                </div>

                {/* Real-time Multi-Option Payment Gateway Selector */}
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#7D0000] uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#B8001F]" />
                      Select Payment Method
                    </label>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                      🔒 256-Bit SSL Encrypted
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDonationForm({ ...donationForm, paymentMethod: 'UPI' })}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        donationForm.paymentMethod === 'UPI'
                          ? 'crimson-button text-white shadow-sm'
                          : 'bg-white border-amber-300 text-amber-950 hover:border-amber-400'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-[#FFD700]" />
                      <span className="text-xs font-bold">UPI / GPay / PhonePe</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDonationForm({ ...donationForm, paymentMethod: 'Card' })}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        donationForm.paymentMethod === 'Card'
                          ? 'crimson-button text-white shadow-sm'
                          : 'bg-white border-amber-300 text-amber-950 hover:border-amber-400'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#FFD700]" />
                      <span className="text-xs font-bold">Credit / Debit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDonationForm({ ...donationForm, paymentMethod: 'NetBanking' })}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        donationForm.paymentMethod === 'NetBanking'
                          ? 'crimson-button text-white shadow-sm'
                          : 'bg-white border-amber-300 text-amber-950 hover:border-amber-400'
                      }`}
                    >
                      <Building className="w-5 h-5 text-[#FFD700]" />
                      <span className="text-xs font-bold">NetBanking</span>
                    </button>
                  </div>

                  {/* Payment Details Sub-Form */}
                  {donationForm.paymentMethod === 'UPI' && (
                    <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                        <Smartphone className="w-4 h-4 text-[#B8001F]" />
                        <span>Official Committee UPI VPA ID:</span>
                        <span className="font-mono font-extrabold text-[#8B0000] bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300">
                          {upiId}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-950/80 font-medium">
                        Clicking <b>"Proceed to Pay"</b> below will display the official <b>UPI QR Code</b> for instant scanning & receipt issuance.
                      </p>
                    </div>
                  )}

                  {donationForm.paymentMethod === 'Card' && (
                    <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-amber-950">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                          placeholder="4532 •••• •••• 8910"
                          className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs text-amber-950 font-mono focus:outline-none focus:border-[#B8001F]"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-amber-950">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-amber-950 text-center focus:outline-none"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-amber-950">CVV Code</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-amber-950 text-center focus:outline-none"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold text-amber-950">Card Holder</label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Name on card"
                            className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-amber-950 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {donationForm.paymentMethod === 'NetBanking' && (
                    <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3">
                      <label className="block text-[11px] font-bold text-amber-950">Select Internet Banking Provider</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-xs text-amber-950 font-bold focus:outline-none"
                      >
                        <option value="SBI">State Bank of India (SBI)</option>
                        <option value="HDFC">HDFC Bank</option>
                        <option value="ICICI">ICICI Bank</option>
                        <option value="AXIS">Axis Bank</option>
                        <option value="PNB">Punjab National Bank (PNB)</option>
                        <option value="BOB">Bank of Baroda</option>
                      </select>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full crimson-button py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg"
                >
                  <Lock className="w-4 h-4 text-[#FFD700]" />
                  <span>
                    Proceed to Pay ₹{(Number(customAmountInput) || 251).toLocaleString('en-IN')} & Get 80G Receipt
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#FFD700]" />
                </button>
              </form>
            </div>

            {/* Instant Generated 80G E-Receipt Preview */}
            <div className="lg:col-span-5">
              {generatedDonation ? (
                <div className="glass-card-gold p-6 rounded-2xl border-2 border-[#D4AF37] text-center shadow-xl animate-fadeIn relative">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-300 mb-4">
                    <div className="flex items-center gap-1.5 text-[#8B0000] font-bold text-xs">
                      <Award className="w-4 h-4" />
                      <span>80G Tax Exempted Receipt</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black">
                      PAID VERIFIED
                    </span>
                  </div>

                  <h4 className="text-xl font-bold font-serif-royal text-[#7D0000] mb-1">
                    Jharapada Durga Puja Samitee
                  </h4>
                  <p className="text-[11px] text-amber-950/70 font-medium mb-4">Official E-Donation Receipt</p>

                  <div className="bg-white/90 p-4 rounded-xl text-left text-xs space-y-2 border border-amber-200 mb-4 shadow-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-900/70">Receipt No:</span>
                      <span className="font-mono font-bold text-[#8B0000]">{generatedDonation.receiptNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-900/70">Donor Name:</span>
                      <span className="font-bold text-amber-950">{generatedDonation.donorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-900/70">Category:</span>
                      <span className="font-bold text-amber-700">{generatedDonation.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-amber-900/70">Payment Mode:</span>
                      <span className="font-bold text-blue-700">{generatedDonation.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-amber-200">
                      <span className="font-bold text-amber-950">Amount Paid:</span>
                      <span className="font-black text-lg text-emerald-700">₹{generatedDonation.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="w-full crimson-button py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#FFD700]" />
                    <span>{language === 'en' ? 'Download 80G Tax Receipt (PDF)' : 'ରସିଦ୍ ଡାଉନଲୋଡ୍ କରନ୍ତୁ'}</span>
                  </button>
                </div>
              ) : (
                <div className="glass-card p-8 rounded-2xl text-center border-dashed border-2 border-amber-300">
                  <Heart className="w-16 h-16 text-rose-500/80 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-lg font-bold text-[#7D0000] font-serif-royal mb-2">
                    {language === 'en' ? 'Your 80G Receipt Will Be Generated Here' : 'ଆପଣଙ୍କ ଦାନ ରସିଦ୍ ଏଠାରେ ପ୍ରସ୍ତୁତ ହେବ'}
                  </h4>
                  <p className="text-xs text-amber-950/70 font-medium">
                    {language === 'en' ? 'Fill in your name and amount on the left form to proceed to instant payment.' : 'ବାମ ପଟ ଫର୍ମ ପୂରଣ କରି ତୁରନ୍ତ ଦାନ କରନ୍ତୁ ।'}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Real-time Payment Gateway Modal */}
      {isProcessingPayment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsProcessingPayment(false);
          }}
        >
          <div className="bg-white p-4 sm:p-5 rounded-2xl max-w-md w-full max-h-[88vh] overflow-y-auto border-2 border-[#D4AF37] text-center shadow-2xl space-y-3 relative">
            
            {/* Top Right Prominent Close/Cancel Button */}
            <button
              type="button"
              onClick={() => setIsProcessingPayment(false)}
              className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer z-10 shadow-sm"
              title="Cancel Payment"
            >
              <X className="w-3.5 h-3.5 text-red-700" />
              <span>Cancel</span>
            </button>

            {/* UPI QR PAYMENT MODAL STEP */}
            {paymentStep === 'upi_qr' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2.5 pr-20">
                  <div className="flex items-center gap-1.5 text-[#8B0000] font-bold text-xs sm:text-sm font-serif-royal">
                    <Smartphone className="w-4 h-4 text-[#B8001F]" />
                    <span>Scan & Pay via UPI</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-300">
                    ₹{(Number(customAmountInput) || 251).toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-xs text-amber-950 font-medium text-left">
                  Scan QR code with <b>GPay, PhonePe, Paytm, or BHIM</b> to pay <b>₹{(Number(customAmountInput) || 251).toLocaleString('en-IN')}</b> for <b>{donationForm.category}</b>:
                </p>

                {/* QR Code SVG */}
                <div className="bg-white p-2.5 rounded-2xl border-4 border-[#B8001F] inline-block shadow-md">
                  <QRCodeSVG 
                    value={`upi://pay?pa=${encodeURIComponent(upiId)}&pn=Jharapada%20Durga%20Puja%20Samitee&am=${customAmountInput || '251'}&cu=INR&tn=E-Donation%20Bhog%20Seva`} 
                    size={140} 
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-100/90 rounded-lg text-xs font-bold text-amber-950 border border-amber-300">
                    <span>VPA: {upiId}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(upiId);
                        setCopiedVpa(true);
                        setTimeout(() => setCopiedVpa(false), 2000);
                      }}
                      className="ml-1"
                    >
                      {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-amber-800" />}
                    </button>
                  </div>

                  {/* Direct Mobile Deep Link & Razorpay Gateway */}
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={handleRazorpayCheckout}
                      className="w-full py-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-sky-300" />
                      <span>⚡ Instant Pay via Razorpay (GPay/PhonePe/Cards)</span>
                    </button>

                    <a
                      href={`upi://pay?pa=${encodeURIComponent(upiId)}&pn=Jharapada%20Durga%20Puja%20Samitee&am=${customAmountInput || '251'}&cu=INR&tn=E-Donation%20Bhog%20Seva`}
                      className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center justify-center gap-1.5"
                    >
                      <span>📱 Open UPI App (GPay / PhonePe / Paytm)</span>
                    </a>
                  </div>
                </div>

                {/* UPI PAYMENT STATUS INDICATOR & CONFIRMATION BOX */}
                <div className="bg-amber-50/90 p-2.5 rounded-xl border border-amber-300 space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-950">Payment Status:</span>
                    {!isPaymentConfirmed ? (
                      <span className="inline-flex items-center gap-1.5 text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                        Awaiting Payment
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Confirmed {verifiedBankName ? `(${verifiedBankName})` : ''}
                      </span>
                    )}
                  </div>

                  {!isPaymentConfirmed && (
                    <div className="space-y-1.5 pt-0.5">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-950 mb-0.5">
                          Enter 12-Digit Bank UTR / Ref No (from GPay / PhonePe / Paytm):
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="e.g. 428910394812"
                          value={utrInput}
                          onChange={(e) => {
                            setUtrInput(e.target.value.replace(/\D/g, ''));
                            if (utrError) setUtrError('');
                          }}
                          className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-xs text-amber-950 font-mono focus:outline-none focus:border-[#B8001F]"
                        />
                        {utrError && (
                          <p className="text-[10px] text-red-600 font-bold mt-1 leading-tight">{utrError}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={verifyUpiPaymentReceived}
                        disabled={isVerifyingUpi}
                        className="w-full py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 border border-amber-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isVerifyingUpi ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#B8001F]" />
                            <span>Validating NPCI UTR Checksum...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-[#B8001F]" />
                            <span>Verify 12-Digit NPCI Bank UTR</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Verification & Disabled/Enabled Receipt Button */}
                <div className="pt-2 border-t border-amber-200 flex flex-col gap-2">
                  <button
                    onClick={confirmPaymentAndGenerateReceipt}
                    disabled={!isPaymentConfirmed}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isPaymentConfirmed
                        ? 'crimson-button text-white shadow-lg animate-bounce cursor-pointer'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300 opacity-60'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${isPaymentConfirmed ? 'text-[#FFD700]' : 'text-gray-400'}`} />
                    <span>
                      {isPaymentConfirmed 
                        ? '🎉 Payment Received! Generate 80G Tax Receipt' 
                        : '🔒 Enter Valid 12-Digit UTR to Enable Receipt'}
                    </span>
                  </button>

                  {!isPaymentConfirmed && (
                    <p className="text-[10px] text-amber-900/80 font-medium text-center">
                      ⚠️ Complete payment in your UPI app, enter your 12-digit Bank UTR above, and click "Verify 12-Digit Bank UTR" to unlock your receipt.
                    </p>
                  )}

                  {/* Prominent Red Cancel Button */}
                  <button
                    onClick={() => setIsProcessingPayment(false)}
                    className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4 text-red-600" />
                    <span>Cancel Payment & Return to Page</span>
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'connecting' && (
              <div className="py-6 space-y-3">
                <RefreshCw className="w-10 h-10 text-[#B8001F] animate-spin mx-auto" />
                <h4 className="text-base font-bold text-amber-950">Connecting to Bank Gateway...</h4>
                <p className="text-xs text-amber-900/70">Encrypting 256-Bit SSL Payment Tokens</p>
                <button
                  onClick={() => setIsProcessingPayment(false)}
                  className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-xs font-bold mt-2"
                >
                  Cancel
                </button>
              </div>
            )}

            {paymentStep === 'otp' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between border-b pb-2 pr-8">
                  <span className="text-xs font-bold text-amber-950">2FA OTP Verification</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">LIVE TEST</span>
                </div>
                <p className="text-xs text-amber-950 font-medium">
                  Enter 6-digit OTP sent to your registered mobile ending in <b>••••{donationForm.phone.slice(-4) || '9810'}</b>:
                </p>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full bg-amber-50 border border-amber-300 rounded-xl py-2.5 text-center text-lg font-mono font-bold tracking-widest text-amber-950"
                  maxLength={6}
                />
                <div className="flex gap-2">
                  <button
                    onClick={confirmPaymentAndGenerateReceipt}
                    className="flex-1 crimson-button py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                    <span>Verify OTP & Authorize</span>
                  </button>
                  <button
                    onClick={() => setIsProcessingPayment(false)}
                    className="px-3 py-2.5 bg-gray-200 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce mx-auto" />
                <h4 className="text-lg font-bold text-emerald-900">Payment Successful!</h4>
                <p className="text-xs text-amber-900">Generating Official 80G E-Receipt...</p>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
