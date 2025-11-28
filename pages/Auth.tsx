import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Briefcase, User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, RefreshCw, Check } from 'lucide-react';

interface AuthProps {
  onNavigate: (page: string) => void;
  initialMode?: 'login' | 'register';
  initialRole?: 'survivor' | 'supporter';
}

export const Auth: React.FC<AuthProps> = ({ onNavigate, initialMode = 'login', initialRole = 'survivor' }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'survivor' | 'supporter'>(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [profession, setProfession] = useState('therapist');
  const [showPassword, setShowPassword] = useState(false);

  // Generate a random alias
  const generateAlias = () => {
    const prefixes = ['Sky', 'River', 'Mountain', 'Echo', 'Shield', 'Safe', 'North', 'Light'];
    const suffixes = ['Walker', 'Guard', 'Keeper', 'Path', 'Way', 'Hope', 'Voice'];
    const num = Math.floor(Math.random() * 9000) + 1000;
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    setAlias(`${randomPrefix}${randomSuffix}_${num}`);
  };

  // Run generation once if empty and survivor
  React.useEffect(() => {
    if (mode === 'register' && role === 'survivor' && !alias) {
      generateAlias();
    }
  }, [mode, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          onNavigate('dashboard');
        } else {
          setError('Invalid email or password.');
        }
      } else {
        // Register
        const success = await register(
          role === 'survivor' ? (alias || name) : name, // Use alias as name for survivor internal record if desired, or keep separate
          email,
          password,
          role,
          role === 'survivor' ? { alias } : { profession }
        );
        
        if (success) {
          onNavigate('dashboard');
        } else {
          setError('Registration failed. Email might be in use.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Visuals & Context */}
        <div className={`p-10 md:w-2/5 flex flex-col justify-between text-white ${
          role === 'survivor' ? 'bg-slate-900' : 'bg-brand-700'
        } transition-colors duration-500`}>
          <div>
            <div className="flex items-center gap-2 font-bold text-2xl mb-8">
              <Shield className="fill-current" />
              <span>Veritas</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              {mode === 'login' ? 'Welcome Back' : (role === 'survivor' ? 'Secure Your Story' : 'Join the Network')}
            </h2>
            <p className="text-opacity-90 leading-relaxed">
              {mode === 'login' 
                ? 'Access your secure dashboard to manage evidence or support cases.' 
                : (role === 'survivor' 
                    ? 'Create an encrypted, anonymous account to start documenting evidence securely.' 
                    : 'Verify your credentials to help survivors of online harassment seek justice.')}
            </p>
          </div>

          <div className="mt-12 space-y-4">
             {role === 'survivor' ? (
                 <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-2 font-bold mb-2">
                        <Lock size={16} /> End-to-End Privacy
                    </div>
                    <p className="text-sm text-slate-300">Your data is encrypted. We recommend using a secure email and private browsing mode.</p>
                 </div>
             ) : (
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-2 font-bold mb-2">
                        <Check size={16} /> Verified Professionals
                    </div>
                    <p className="text-sm text-brand-100">Your license and credentials will be reviewed before you can accept cases.</p>
                 </div>
             )}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 md:w-3/5 bg-white relative">
          
          {/* Tabs */}
          <div className="flex gap-6 mb-8 border-b border-slate-100">
            <button 
              onClick={() => setMode('login')}
              className={`pb-4 font-bold text-sm transition-colors relative ${mode === 'login' ? 'text-slate-900' : 'text-slate-400'}`}
            >
              Sign In
              {mode === 'login' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setMode('register')}
              className={`pb-4 font-bold text-sm transition-colors relative ${mode === 'register' ? 'text-slate-900' : 'text-slate-400'}`}
            >
              Create Account
              {mode === 'register' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-t-full"></div>}
            </button>
          </div>

          {/* Role Toggle for Register */}
          {mode === 'register' && (
             <div className="grid grid-cols-2 gap-4 mb-8">
                 <button
                    type="button"
                    onClick={() => setRole('survivor')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        role === 'survivor' 
                        ? 'border-slate-800 bg-slate-50 text-slate-900 ring-1 ring-slate-800' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                 >
                    <User size={24} />
                    <span className="font-bold text-sm">Survivor</span>
                 </button>
                 <button
                    type="button"
                    onClick={() => setRole('supporter')}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        role === 'supporter' 
                        ? 'border-brand-600 bg-brand-50 text-brand-700 ring-1 ring-brand-600' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                 >
                    <Briefcase size={24} />
                    <span className="font-bold text-sm">Professional</span>
                 </button>
             </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Supporter Name */}
            {mode === 'register' && role === 'supporter' && (
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Legal Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                        placeholder="Dr. Jane Smith"
                        required
                    />
                </div>
            )}

             {/* Survivor Alias */}
             {mode === 'register' && role === 'survivor' && (
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Anonymous Alias</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={alias}
                            onChange={e => setAlias(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 font-mono text-slate-700"
                            placeholder="Generated Alias"
                            required
                        />
                        <button 
                            type="button"
                            onClick={generateAlias}
                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                            title="Generate new alias"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">This is how you will be identified to supporters.</p>
                </div>
            )}

            {/* Supporter Profession */}
             {mode === 'register' && role === 'supporter' && (
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Profession</label>
                    <select
                        value={profession}
                        onChange={e => setProfession(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg bg-white"
                    >
                        <option value="therapist">Therapist / Counselor</option>
                        <option value="lawyer">Lawyer / Legal Aide</option>
                        <option value="ngo_worker">NGO Worker</option>
                        <option value="digital_safety">Digital Safety Expert</option>
                    </select>
                </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder={role === 'survivor' ? "secure.email@proton.me" : "name@organization.com"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                 {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.99] ${
                  role === 'survivor' 
                  ? 'bg-slate-900 hover:bg-slate-800' 
                  : 'bg-brand-600 hover:bg-brand-700'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                  <Loader2 className="animate-spin" />
              ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={20} />
                  </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
             {mode === 'login' ? (
                 <>
                    Don't have an account?{' '}
                    <button onClick={() => setMode('register')} className="font-bold text-brand-600 hover:underline">
                        Sign up securely
                    </button>
                 </>
             ) : (
                 <>
                    Already have an account?{' '}
                    <button onClick={() => setMode('login')} className="font-bold text-brand-600 hover:underline">
                        Sign in
                    </button>
                 </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};