import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SignIn, SpinnerGap, ShieldWarning } from '@phosphor-icons/react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { MENU_ITEMS } from '../constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const navigate = useNavigate();

  const seedData = async () => {
    setIsSeeding(true);
    try {
      const batch = writeBatch(db);
      
      for (const item of MENU_ITEMS) {
        const docRef = doc(db, 'menu', item.id);
        batch.set(docRef, { ...item, createdAt: new Date().toISOString() });
      }
      
      await batch.commit();
      alert('Menu seeded successfully! To become an admin, manually add your UID to the "admins" collection in Firebase Console.');
    } catch (err: any) {
      alert('Seeding failed: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const adminDoc = await getDoc(doc(db, 'admins', result.user.uid));
      if (adminDoc.exists()) {
        navigate('/admin');
      } else {
        setError('Unauthorized: Your account is not an admin.');
        await auth.signOut();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const adminDoc = await getDoc(doc(db, 'admins', result.user.uid));
      if (adminDoc.exists()) {
        navigate('/admin');
      } else {
        setError('Unauthorized access.');
        await auth.signOut();
      }
    } catch (err: any) {
      setError('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-panel p-10 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-accent/10 text-brand-accent border border-brand-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
            <SignIn size={40} weight="fill" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 text-white">System Access</h1>
          <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Secure Gateway for Tabogon Hub Staff</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl mb-8 text-sm font-bold uppercase tracking-wide">
            <ShieldWarning size={20} weight="bold" />
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-6 mb-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">Clearance ID (Email)</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:bg-white/10 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all text-white placeholder:text-white/20"
              placeholder="admin@streetfoods.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-2">Passcode</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:bg-white/10 focus:ring-1 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all text-white placeholder:text-white/20"
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={isLoading}
            className="w-full btn-primary py-4 text-sm font-bold flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {isLoading ? <SpinnerGap size={20} weight="bold" className="animate-spin" /> : "Authenticate"}
          </button>
        </form>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <span className="relative bg-brand-surface px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Or bypass via</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-4 glass-inner hover:bg-white/10 border border-white/10 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-colors disabled:opacity-50 text-white"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale opacity-80" alt="Google" />
          Google Authentication
        </button>

        <div className="mt-12 text-center">
            <button 
              onClick={seedData} 
              disabled={isSeeding}
              className="text-[10px] font-bold text-white/20 hover:text-brand-accent transition-colors uppercase tracking-widest"
            >
              {isSeeding ? 'Seeding...' : 'Inject Catalog Data (Dev Override)'}
            </button>
        </div>
      </motion.div>
    </div>
  );
}
