import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Globe, Phone, Shield, Briefcase, Camera, Save, ArrowLeft } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { authLoginSuccess } from '../store/authSlice.js';

const ProfilePage = () => {
  const dispatch = useDispatch();
  
  // 🎯 Redux Store එකෙන් දැනට ලොග් වී ඉන්න කෙනාගේ විස්තර කියවීම
  const { authData } = useSelector((state) => state.auth);
  const user = authData?.user || authData?.result || authData;

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Field States
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    country: 'Sri Lanka',
    contactNumber: '',
    gender: 'Male',
    profession: '',
    picture: ''
  });

  // පේජ් එක ලෝඩ් වෙද්දී දැනට තියෙන දත්ත ෆෝම් එකට ඇතුලත් කිරීම
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        country: user.country || 'Sri Lanka',
        contactNumber: user.contactNumber || '',
        gender: user.gender || 'Male',
        profession: user.profession || '',
        picture: user.picture || user.imageUrl || ''
      });
    }
  }, [authData]);

  const handleInputChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  // ☁️ IMAGE UPLOAD TO CLOUD HANDLER (Backend file upload architecture)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      // 🚀 ඔයාගේ backend එකේ අපි කලින් හදපු image upload route එකට image එක යැවීම
      const { data } = await axios.post('http://localhost:5002/api/tourists/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Cloud එකෙන් සේව් වෙලා එන සැබෑ image URL එක profile state එකට දැමීම
      setProfileData({ ...profileData, picture: data.imageUrl });
      alert("Profile matrix assets synchronized to cloud cluster successfully! ☁️✨");
    } catch (error) {
      console.error("Cloud Asset Storage Error:", error);
      alert("Failed to upload image to cloud node. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // 💾 SAVE CHANGES SUBMIT HANDLER
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend එකට දත්ත යවා ඩේටාබේස් එක අප්ඩේට් කිරීම
     const { data } = await axios.put(`http://localhost:5002/api/tourists/update-profile/${profileData.email}`, profileData);
      
      // 🎯 Redux Store එක සහ LocalStorage එක අලුත් දත්ත වලින් update කිරීම
      dispatch(authLoginSuccess(data));
      alert("Ecosystem profile changes successfully committed to main database layer! 💾🔒");
    } catch (error) {
      console.error("Profile Save Crash:", error);
      alert(error.response?.data?.message || " Handshake error during update process.");
    } finally {
      setLoading(false);
    }
  };

  const isGoogleAccount = user?.googleId || user?.picture?.includes('googleusercontent');

  return (
    <div className="min-h-screen bg-slate-50/60 pt-32 pb-24 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Back navigation link hook */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors mb-6 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
        </Link>

        <form onSubmit={handleSaveChanges} className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-3xl p-8 relative space-y-8">
          
          {/* PROFILE AVATAR MATRIX UPLOAD AREA */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative group">
              <div className="w-24 h-24 bg-blue-50 border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center text-slate-400">
                {profileData.picture ? (
                  <img src={profileData.picture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-slate-300" />
                )}
              </div>
              
              {/* If it's a native account, show the camera overlay to upload to cloud */}
              {!isGoogleAccount && (
                <label className="absolute inset-0 bg-black/40 text-white rounded-2xl flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200 text-[10px] font-bold uppercase tracking-wider">
                  <Camera size={16} />
                  {uploadingImage ? "Syncing..." : "Upload"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                </label>
              )}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{profileData.fullName || "Verified Traveler"}</h2>
              <p className="text-xs font-semibold text-slate-400">{profileData.email}</p>
              {isGoogleAccount && (
                <span className="inline-block bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 border border-blue-100">
                  Managed by Google Node
                </span>
              )}
            </div>
          </div>

          {/* MAIN FORM GRID PARAMETERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
                <User size={16} className="text-slate-400" />
                <input type="text" required value={profileData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="bg-slate-50/60 border border-slate-200/40 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-slate-400">
                <Mail size={16} />
                <input type="email" disabled value={profileData.email} className="w-full bg-transparent border-0 outline-none text-xs font-semibold cursor-not-allowed text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact Number</label>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
                <Phone size={16} className="text-slate-400" />
                <input type="text" placeholder="+94 7X XXX XXXX" value={profileData.contactNumber} onChange={(e) => handleInputChange('contactNumber', e.target.value)} className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Country Matrix</label>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
                <Globe size={16} className="text-slate-400" />
                <input type="text" value={profileData.country} onChange={(e) => handleInputChange('country', e.target.value)} className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gender Core</label>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
                <Shield size={16} className="text-slate-400" />
                <select value={profileData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700 bg-slate-50">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Profession / Occupation</label>
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 focus-within:border-blue-500 transition-colors">
                <Briefcase size={16} className="text-slate-400" />
                <input type="text" placeholder="e.g. Software Engineer, Doctor" value={profileData.profession} onChange={(e) => handleInputChange('profession', e.target.value)} className="w-full bg-transparent border-0 outline-none text-xs font-semibold text-slate-700" />
              </div>
            </div>
          </div>

          {/* RIGHT BOTTOM SAVE CHANGES BUTTON CONTAINER */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-60 uppercase tracking-wider"
            >
              <Save size={14} />
              {loading ? "Saving Vector Changes..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfilePage;