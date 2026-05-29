import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
     
      //1.google eken dena token eka decode krala userge wisthara gannawa
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google User Object:", decoded);

      
      //2. m daththa ape backend ekata yawanawa db eke save krnna 
      const { data } = await axios.post("http://localhost:5002/api/auth/google-login", {
        token: credentialResponse.credential,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture
      });

      
      //3. sarthaka nam data localstorage eke thabagena home page ho planner ekata yawanawa
      localStorage.setItem("token", data.jwtToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert(`Welcome back, ${data.user.name}! 👋`);
      navigate("/planner");

    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google Authentication Failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 max-w-md w-full text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 mb-8">Sign in to VisitCeylonX to access your AI Travel Planner.</p>
        
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert('Login Failed. Please try again.')}
            useOneTap
            shape="pill"
            theme="filled_blue"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;