import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegisterSelect = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center bg-background">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-textPrimary mb-4"
      >
        Join VisitCeylonX
      </motion.h1>
      <p className="text-textSecondary mb-12">Choose how you want to use our platform</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Tourist Option */}
        <Link to="/register/tourist">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:border-primary transition-colors">
            <div className="w-16 h-16 bg-teal-50 text-primary rounded-full flex items-center justify-center mb-6">
              <User size={32} />
            </div>
            <h3 className="text-xl font-bold text-textPrimary mb-2">Register as Tourist</h3>
            <p className="text-textSecondary text-sm">Find places, plan trips, and book expert guides.</p>
          </motion.div>
        </Link>

        {/* Guide Option */}
        <Link to="/register/guide">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center hover:border-primary transition-colors">
            <div className="w-16 h-16 bg-amber-50 text-accent rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-textPrimary mb-2">Register as Guide</h3>
            <p className="text-textSecondary text-sm">Join our network and help travelers explore Sri Lanka.</p>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default RegisterSelect;