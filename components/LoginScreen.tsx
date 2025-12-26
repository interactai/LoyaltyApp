import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Languages, Phone, User as UserIcon, Store, TicketPercent, Building2, Gift, Shield, MessageCircle, ArrowRight, Lock, MapPin, Zap, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BRAND_CONFIG, AUTH_CONFIG } from '../config';
import { User } from '../types';
import { AuthService } from '../services/backend';

interface LoginScreenProps {
  onLogin: (mobile: string, password: string) => Promise<User | null>;
  onRegister: (userData: any) => Promise<User | null>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasPendingCoupon, setHasPendingCoupon] = useState(false);

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'STORE_ADMIN' | 'MEMBER'>('MEMBER');
  const [gstNumber, setGstNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { t, toggleLanguage, language, setLanguage } = useLanguage();
  const { appName } = BRAND_CONFIG;

  useEffect(() => {
    if (localStorage.getItem('pendingCoupon')) {
      setHasPendingCoupon(true);
      setRole('MEMBER');
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     if (!mobile || !password || !name) {
         setError("All fields required.");
         return;
     }
     setLoading(true);
     try {
         await AuthService.sendOtp(mobile);
         setOtpSent(true);
     } catch (err: any) {
         setError("Failed to send verification.");
     } finally {
         setLoading(false);
     }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!enteredOtp) {
        setError("OTP Required.");
        return;
    }
    setLoading(true);
    try {
        const user = await onRegister({
            mobile, password, name, role,
            gstNumber: role === 'STORE_ADMIN' ? gstNumber : undefined
        });
        if (user?.role === 'MEMBER') setLanguage('hi');
    } catch (err: any) {
        setError("Error during registration.");
    } finally {
        setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!mobile || !password) {
        setError("Credentials required.");
        return;
    }
    setLoading(true);
    try {
        const user = await onLogin(mobile, password);
        if (!user) {
           setError(t.invalidPassword || "Login Failed");
        } else {
           if (user.role === 'MEMBER') setLanguage('hi');
        }
    } catch (err: any) {
        setError("Network error.");
    } finally {
        setLoading(false);
    }
  };

  const handleDemoFill = (role: string) => {
    const demoUser = AUTH_CONFIG.users.find(u => u.role === role);
    if (demoUser) {
        setMobile(demoUser.mobile);
        setPassword(demoUser.password);
        setError('');
        setIsRegistering(false);
        if (role === 'SUPER_ADMIN') setIsAdminMode(true);
        else setIsAdminMode(false);
    }
  };

  const benefits = [
    { 
      title: t.login_benefit_geo_title, 
      desc: t.login_benefit_geo_desc, 
      icon: MapPin, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      title: t.login_benefit_loyalty_title, 
      desc: t.login_benefit_loyalty_desc, 
      icon: TrendingUp, 
      color: "text-green-500", 
      bg: "bg-green-50" 
    },
    { 
      title: t.login_benefit_price_title, 
      desc: t.login_benefit_price_desc, 
      icon: Zap, 
      color: "text-yellow-600", 
      bg: "bg-yellow-50" 
    },
    { 
      title: t.login_benefit_perception_title, 
      desc: t.login_benefit_perception_desc, 
      icon: Award, 
      color: "text-orange-500", 
      bg: "bg-orange-50" 
    }
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans text-gray-900 animate-fade-in">
      {/* Left Side: Modern Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 text-white flex-col p-16 xl:p-24 overflow-y-auto scrollbar-hide">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(234,88,12,0.1),transparent_50%)] pointer-events-none"></div>
         <div className="relative z-10 flex items-center gap-4 mb-20">
             <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                 {isAdminMode ? <Shield className="w-7 h-7" /> : <TicketPercent className="w-7 h-7" />}
             </div>
             <span className="text-2xl font-bold tracking-tight">{appName}</span>
         </div>

         <div className="relative z-10 mb-16">
             <h2 className="text-5xl xl:text-7xl font-extrabold leading-none mb-6 tracking-tight">
                Build.<br />
                Reward.<br />
                <span className="text-orange-500">Succeed.</span>
             </h2>
             <p className="text-lg xl:text-xl text-gray-400 font-medium max-w-md leading-relaxed">
                 {t.login_benefit_title}
             </p>
         </div>

         {/* Benefits Guide Section */}
         <div className="relative z-10 grid grid-cols-1 gap-5">
             {benefits.map((b, idx) => (
                <div key={idx} className="flex gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group">
                    <div className={`w-12 h-12 shrink-0 rounded-2xl ${b.bg} ${b.color} flex items-center justify-center shadow-lg bg-opacity-10`}>
                        <b.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-white group-hover:text-orange-400 transition-colors">{b.title}</h4>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">{b.desc}</p>
                    </div>
                </div>
             ))}
         </div>

         <div className="relative z-10 flex items-center gap-10 mt-16 pt-16 border-t border-white/5">
             <div><p className="text-xl font-bold">100%</p><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Secure Data</p></div>
             <div><p className="text-xl font-bold">TRUSTED</p><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">B2B Network</p></div>
         </div>
      </div>

      {/* Right Side: Simple Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-white">
          <div className="w-full max-w-[440px] animate-fade-in-up">
              <div className="lg:hidden flex justify-center mb-10">
                  <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      {isAdminMode ? <Shield className="w-7 h-7" /> : <TicketPercent className="w-7 h-7" />}
                  </div>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 p-8 sm:p-12 relative overflow-hidden">
                  <div className="text-center mb-10">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                          {isAdminMode ? 'Staff Access' : (isRegistering ? 'New Account' : 'Welcome Back')}
                      </h1>
                      <p className="text-sm text-gray-500 font-medium">{isRegistering ? 'Join our distribution network' : 'Please sign in to your dashboard'}</p>
                  </div>

                  <form onSubmit={isRegistering ? (otpSent ? handleRegisterSubmit : handleSendOtp) : handleLoginSubmit} className="space-y-4">
                      {isRegistering && !isAdminMode && (
                        <>
                          <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                              <button type="button" onClick={() => setRole('MEMBER')} className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${role === 'MEMBER' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>Retailer</button>
                              <button type="button" onClick={() => setRole('STORE_ADMIN')} className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${role === 'STORE_ADMIN' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>Distributor</button>
                          </div>
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold outline-none focus:bg-white focus:border-orange-500" disabled={otpSent} />
                        </>
                      )}

                      <div className="relative">
                         <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile Number" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold outline-none focus:bg-white focus:border-orange-500" disabled={otpSent && isRegistering} />
                         <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      </div>

                      <div className="relative">
                          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Security Pin" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold outline-none focus:bg-white focus:border-orange-500" disabled={otpSent && isRegistering} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                      </div>

                      {isRegistering && otpSent && (
                          <input type="text" value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} placeholder="OTP" className="w-full px-5 py-4 bg-orange-50 border-2 border-orange-200 rounded-xl font-bold text-2xl text-center outline-none tracking-[0.5em]" maxLength={4} autoFocus />
                      )}

                      {error && (
                          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl text-center">{error}</div>
                      )}

                      <button type="submit" disabled={loading} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-orange-100 hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-3">
                        {loading ? 'Processing...' : (isRegistering ? (otpSent ? 'Verify' : 'Register') : 'Sign In')}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                  </form>
                  
                  <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
                        <button onClick={() => {setIsRegistering(!isRegistering); setOtpSent(false);}} className="text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors">
                            {isRegistering ? "Back to Login" : "Create New Account"}
                        </button>
                        <button onClick={() => setIsAdminMode(!isAdminMode)} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-gray-900 transition-colors">
                            <Lock className="w-3 h-3" /> {isAdminMode ? 'Portal Login' : 'Staff Access'}
                        </button>
                  </div>
              </div>

              <div className="mt-8 flex justify-center gap-3">
                   <button onClick={() => handleDemoFill('STORE_ADMIN')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-600 transition-colors">Store</button>
                   <button onClick={() => handleDemoFill('MEMBER')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-600 transition-colors">Partner</button>
              </div>
          </div>
      </div>
    </div>
  );
};