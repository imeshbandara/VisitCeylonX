import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

const BookingButton = ({ amount, guideId }) => {

  // 1. PayPal button eka click krpu gman backend ekt ynna kiyl oder ekak hadnw
  const createOrder = async () => {
    try {
      const { data } = await axios.post("http://localhost:5002/api/payments/create-order", {
        amount: amount, // Guide fee eka
      });
      return data.id; // PayPal Order ID එක Return කරයි
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Could not initiate PayPal Payment.");
    }
  };


  // 2. user thamange pappal pw eka dia payment eka approve krama meka run wenw
  const onApprove = async (data) => {
    try {
      const response = await axios.post("http://localhost:5002/api/payments/capture-order", {
        orderID: data.orderID,
      });
      if (response.data.status === "COMPLETED") {
        alert("Booking Successful! Payment captured successfully. 🎉");
        // මෙතනදී ඔබට පුළුවන් Database එකේ Booking එක "Paid" කියලා Update කරන්න
      }
    } catch (error) {
      console.error("Error capturing order:", error);
      alert("Payment verification failed.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <p className="text-sm font-medium text-textSecondary text-center mb-3">
        Secure Payment via PayPal (Amount: ${amount})
      </p>
      <PayPalButtons 
        style={{ layout: "vertical", shape: "pill", label: "pay" }}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </div>
  );
};

export default BookingButton;