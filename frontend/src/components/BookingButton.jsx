import React, { useState } from 'react';
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import axios from 'axios';
import { CreditCard, ShieldCheck, CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react';

const BookingButton = ({ amount = "25.00", guideId, guideName }) => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error' | 'warning', message: string }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  // 1. Create Order handler - sends dynamic amount, guideId, and metadata to backend
  const createOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5002/api/payments/create-order", {
        amount: Number(amount).toFixed(2),
        guideId: guideId,
        guideName: guideName,
      });

      setLoading(false);
      return response.data.id;
    } catch (error) {
      setLoading(false);
      console.error("Error creating card payment order:", error);
      showToast("error", "Unable to initiate card payment. Please check your connection.");
      throw error;
    }
  };

  // 2. On Approve handler - captures the payment via backend /api/payments/capture endpoint
  const onApprove = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5002/api/payments/capture", {
        orderID: data.orderID,
        guideId: guideId,
      });

      setLoading(false);

      if (response.data.status === "COMPLETED") {
        showToast("success", `Payment of $${Number(amount).toFixed(2)} completed successfully! Guide booked.`);
      } else {
        showToast("warning", `Payment status: ${response.data.status}. Please check your account.`);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error capturing card payment:", error);
      showToast("error", "Payment verification failed. If charged, please contact support.");
    }
  };

  // 3. Error handler
  const onError = (err) => {
    setLoading(false);
    console.error("Card payment error:", err);
    showToast("error", "Card transaction failed. Please check your card details and try again.");
  };

  // 4. Cancel handler
  const onCancel = () => {
    setLoading(false);
    showToast("warning", "Payment process was cancelled.");
  };

  const formattedAmount = Number(amount || 25.00).toFixed(2);

  return (
    <div className="w-full relative">
      {/* Toast Notification Banner */}
      {toast && (
        <div 
          className={`mb-3 p-3 rounded-xl flex items-start gap-2.5 text-xs font-medium transition-all shadow-sm ${
            toast.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : toast.type === 'error'
              ? 'bg-rose-50 text-rose-800 border border-rose-200'
              : 'bg-amber-50 text-amber-800 border border-amber-200'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />}
          {toast.type === 'error' && <XCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />}
          <div className="flex-1">{toast.message}</div>
          <button 
            type="button" 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 ml-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-2 mb-2 text-primary font-medium text-xs bg-emerald-50/80 rounded-lg border border-emerald-100">
          <Loader2 size={15} className="animate-spin text-primary" />
          <span>Processing payment...</span>
        </div>
      )}

      {/* Direct Credit / Debit Card Payment Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1 px-0.5">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <CreditCard size={14} className="text-primary" />
            Debit or Credit Card
          </span>
          <span className="font-bold text-primary">${formattedAmount}</span>
        </div>

        {/* PayPal SDK Direct Card Button with explicit CARD funding */}
        <div className="w-full relative z-0">
          <PayPalButtons 
            fundingSource={FUNDING.CARD}
            style={{ 
              layout: "vertical", 
              color: "black",
              shape: "rect", 
              label: "pay",
              height: 44,
              tagline: false,
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
          />
        </div>

        {/* Security & Card info badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 pt-1">
          <ShieldCheck size={13} className="text-primary" />
          <span>Direct Card Payment • 256-bit Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default BookingButton;