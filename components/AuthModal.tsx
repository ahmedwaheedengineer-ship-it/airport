
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';
import { LuxuryButton } from './LuxuryButton';

interface AuthModalProps {
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const users = StorageService.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onSuccess(user);
      } else {
        setError('Invalid email or password.');
      }
    } else {
      if (!email || !password || !name) {
        setError('All fields are required.');
        return;
      }
      const existing = StorageService.getUsers().find(u => u.email === email);
      if (existing) {
        setError('Email already registered.');
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password,
        name,
        role: UserRole.USER
      };
      StorageService.saveUser(newUser);
      onSuccess(newUser);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="glass-card p-8 rounded-2xl shadow-2xl border border-white/10">
        <h2 className="text-3xl font-serif font-bold text-gold-400 mb-2 text-center uppercase tracking-widest">
          {isLogin ? 'Welcome Back' : 'Ascend with Us'}
        </h2>
        <p className="text-white/50 text-center mb-8 text-[10px] uppercase tracking-[0.2em]">
          {isLogin ? 'Enter your credentials to proceed' : 'Join Prime Air for exclusive travel benefits'}
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-gold-400 transition-all"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-gold-400 transition-all"
              placeholder="user@prime.com"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-gold-400 transition-all"
              placeholder="••••••••"
            />
          </div>

          <LuxuryButton type="submit" className="w-full">
            {isLogin ? 'Sign In' : 'Create Account'}
          </LuxuryButton>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-xs text-white/40 uppercase tracking-widest">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-gold-400 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
