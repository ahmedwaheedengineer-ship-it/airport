
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';

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
    <div className="max-w-md mx-auto py-12">
      <div className="glass-card p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-serif font-bold text-gold-400 mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Join Aura Airways'}
        </h2>
        <p className="text-white/50 text-center mb-8 text-sm uppercase tracking-widest">
          {isLogin ? 'Enter your credentials to proceed' : 'Create an account for exclusive travel perks'}
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-sm mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:outline-none focus:border-gold-400"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:outline-none focus:border-gold-400"
              placeholder="aura@luxury.com"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-3 rounded-sm text-white focus:outline-none focus:border-gold-400"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 btn-gold text-black font-bold uppercase tracking-widest text-sm rounded-sm"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-sm text-white/40">
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
