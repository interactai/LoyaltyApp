
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Languages, Phone, User as UserIcon, Store, TicketPercent, Building2, Gift, Shield, MessageCircle, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
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
  
  // Coupon State
  const [hasPendingCoupon, setHasPendingCoupon] = useState(false);

  // Login State
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'STORE_ADMIN' | 'MEMBER'>('MEMBER');
  const [gstNumber, setGstNumber] = useState('');
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { t, toggleLanguage, language, setLanguage } = useLanguage();
  const { appName } = BRAND_CONFIG;

  useEffect(() => {
    // Check if user arrived via QR code
    if (localStorage.getItem('pendingCoupon')) {
      setHasPendingCoupon(true);
      setRole('MEMBER');
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');

     if (!mobile || !password || !name) {
         setError("Please fill in all required fields.");
         return;
     }

     if (role === 'STORE_ADMIN' && !gstNumber) {
         setError("GST Number is mandatory for Business Accounts.");
         return;
     }

     setLoading(true);
     try {
         await AuthService.sendOtp(mobile);
         setOtpSent(true);
         alert("DEMO OTP: 1234");
     } catch (err: any) {
         setError(err.message || "Failed to send OTP.");
     } finally {
         setLoading(false);
     }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!enteredOtp) {
        setError("Please enter the OTP sent to your mobile.");
        return;
    }

    setLoading(true);
    try {
        const isValid = await AuthService.verifyOtp(mobile, enteredOtp);
        if (!isValid) throw new Error("Invalid OTP. Please try again.");

        const user = await onRegister({
            mobile,
            password,
            name,
            email: email || undefined,
            role,
            gstNumber: role === 'STORE_ADMIN' ? gstNumber : undefined
        });

        if (!user) {
           setError("Registration failed.");
        } else {
            if (user.role === 'MEMBER') setLanguage('hi');
        }
    } catch (err: any) {
        setError(err.message || "An error occurred.");
    } finally {
        setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!mobile || !password) {
        setError("Please enter credentials.");
        return;
    }
    
    setLoading(true);
    try {
        const user = await onLogin(mobile, password);
        if (!user) {
           setError(t.invalidPassword || "Invalid Credentials");
        } else {
           if (isAdminMode && user.role === 'MEMBER') {
               throw new Error("Access Denied. Member accounts cannot use Admin Portal."); 
           }
           if (user.role === 'MEMBER') setLanguage('hi');
        }
    } catch (err: any) {
        setError(err.message || "An error occurred.");
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

  const switchMode = () => {
      setIsRegistering(!isRegistering);
      setError('');
      setOtpSent(false);
      setEnteredOtp('');
      setGstNumber('');
  };

  const toggleAdminMode = () => {
      setIsAdminMode(!isAdminMode);
      setIsRegistering(false);
      setError('');
      setMobile('');
      setPassword('');
      setOtpSent(false);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-900 animate-fade-in">
      {/* Left Side: Brand Visual (Desktop Only) */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gray-900 text-white flex-col justify-between p-16 overflow-hidden">
         {/* Background */}
         <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80" 
              alt="Abstract Background" 
              className="w-full h-full object-cover opacity-20 mix-blend-overlay grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-950 via-gray-900 to-black opacity-90" />
         </div>

         {/* Decor */}
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-600 rounded-full blur-[100px] opacity-20" />
         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-10" />

         {/* Logo Area */}
         <div className="relative z-10 flex items-center gap-3">
             <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 text-orange-500">
                 {isAdminMode ? <Shield className="w-6 h-6" /> : <TicketPercent className="w-6 h-6" />}
             </div>
             <span className="text-xl font-bold tracking-wide">{appName}</span>
         </div>

         {/* Main Text */}
         <div className="relative z-10 max-w-md">
             <h2 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
                 Build lasting <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">partnerships</span>.
             </h2>
             <p className="text-lg text-gray-400 leading-relaxed mb-10">
                 The complete loyalty platform for distributors and retailers. Track sales, reward partners, and grow your network effortlessly.
             </p>
             
             <div className="flex flex-col gap-4">
                 {[
                   { text: 'Instant QR Redemption', icon: TicketPercent },
                   { text: 'Direct Bank Payouts', icon: Gift },
                   { text: 'Real-time Analytics', icon: Building2 }
                 ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3 text-gray-300">
                         <div className="p-1.5 rounded-full bg-white/5 text-orange-400 border border-white/5">
                             <item.icon className="w-4 h-4" />
                         </div>
                         <span className="font-medium tracking-wide text-sm">{item.text}</span>
                     </div>
                 ))}
             </div>
         </div>

         {/* Footer */}
         <div className="relative z-10 text-xs text-gray-600 font-medium flex gap-4">
             <span>© 2024 {appName} Platform</span>
             <span className="opacity-50">•</span>
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
         </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-gray-50/50">
          
          {/* Language Toggle */}
          <button 
             onClick={toggleLanguage}
             className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:border-orange-200 hover:bg-orange-50 transition-all text-xs font-bold uppercase tracking-wider text-gray-600 group"
          >
             <Languages className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
             {language}
          </button>

          <div className="w-full max-w-[420px] mx-auto">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${isAdminMode ? 'bg-gray-800 shadow-gray-200' : 'bg-orange-600 shadow-orange-200'}`}>
                      {isAdminMode ? <Shield className="w-7 h-7" /> : <TicketPercent className="w-7 h-7" />}
                  </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 p-8 sm:p-10 border border-white relative overflow-hidden">
                  {/* Pending Coupon Banner */}
                  {hasPendingCoupon && !isAdminMode && (
                      <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                          <Gift className="w-3.5 h-3.5" />
                          Reward detected! Login to claim.
                      </div>
                  )}

                  {/* Header */}
                  <div className={`text-center mb-8 ${hasPendingCoupon && !isAdminMode ? 'mt-4' : ''}`}>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                          {isAdminMode ? 'System Portal' : (isRegistering ? 'Create Account' : t.welcome)}
                      </h1>
                      <p className="text-sm text-gray-500">
                          {isAdminMode ? 'Secure access for authorized staff' : (isRegistering ? 'Join our partner network today' : t.enterCredentials)}
                      </p>
                  </div>

                  {/* FORM */}
                  <form onSubmit={isRegistering ? (otpSent ? handleRegisterSubmit : handleSendOtp) : handleLoginSubmit} className="space-y-4">
                      
                      {isRegistering && !isAdminMode && (
                        <>
                          <div className="grid grid-cols-2 gap-3 mb-2">
                              <div 
                                onClick={() => !otpSent && setRole('MEMBER')}
                                className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all duration-200 ${role === 'MEMBER' ? `border-orange-500 bg-orange-50 text-orange-800 shadow-sm` : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                              >
                                 <UserIcon className="w-5 h-5 mx-auto mb-1.5" />
                                 <span className="text-[10px] font-bold uppercase tracking-wider block">{t.memberRole || 'Member'}</span>
                              </div>
                              <div 
                                onClick={() => !otpSent && setRole('STORE_ADMIN')}
                                className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all duration-200 ${role === 'STORE_ADMIN' ? `border-orange-500 bg-orange-50 text-orange-800 shadow-sm` : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                              >
                                 <Store className="w-5 h-5 mx-auto mb-1.5" />
                                 <span className="text-[10px] font-bold uppercase tracking-wider block">{t.storeOwner || 'Store Owner'}</span>
                              </div>
                          </div>

                          <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full px-4 py-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none font-medium transition-all"
                                    placeholder=" "
                                    disabled={otpSent}
                                />
                                <label className="absolute left-4 top-3.5 text-gray-400 text-sm pointer-events-none transition-all group-focus-within:-top-2.5 group-focus-within:bg-white group-focus-within:px-1 group-focus-within:text-xs group-focus-within:text-orange-600 peer-placeholder-shown:top-3.5">
                                    {role === 'STORE_ADMIN' ? "Business Name" : "Full Name"}
                                </label>
                            </div>

                            {role === 'STORE_ADMIN' && (
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={gstNumber}
                                        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                                        className="block w-full px-4 py-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none font-medium transition-all uppercase"
                                        placeholder=" "
                                        disabled={otpSent}
                                        maxLength={15}
                                    />
                                    <label className="absolute left-4 top-3.5 text-gray-400 text-sm pointer-events-none transition-all group-focus-within:-top-2.5 group-focus-within:bg-white group-focus-within:px-1 group-focus-within:text-xs group-focus-within:text-orange-600">GST Number</label>
                                    <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Mobile Number */}
                      <div className="relative group">
                         <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => { setMobile(e.target.value); setError(''); }}
                            className="block w-full px-4 py-3.5 text-base bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none font-bold transition-all text-gray-900"
                            placeholder=" "
                            disabled={otpSent && isRegistering}
                          />
                          <label className="absolute left-4 top-3.5 text-gray-400 text-sm pointer-events-none transition-all group-focus-within:-top-2.5 group-focus-within:bg-white group-focus-within:px-1 group-focus-within:text-xs group-focus-within:text-orange-600">
                             {t.mobilePlaceholder || "Mobile Number"}
                          </label>
                          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                      </div>

                      {/* Password */}
                      <div className="relative group">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            className="block w-full px-4 py-3.5 text-base bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none font-bold transition-all text-gray-900"
                            placeholder=" "
                            disabled={otpSent && isRegistering}
                          />
                          <label className="absolute left-4 top-3.5 text-gray-400 text-sm pointer-events-none transition-all group-focus-within:-top-2.5 group-focus-within:bg-white group-focus-within:px-1 group-focus-within:text-xs group-focus-within:text-orange-600">
                             {t.passwordPlaceholder || "Password"}
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                      </div>

                      {/* OTP Input */}
                      {isRegistering && otpSent && !isAdminMode && (
                          <div className="relative animate-fade-in-up">
                            <input
                                type="text"
                                value={enteredOtp}
                                onChange={(e) => setEnteredOtp(e.target.value)}
                                className="block w-full px-4 py-3.5 text-xl text-center tracking-[0.5em] bg-orange-50 border-2 border-orange-100 rounded-xl focus:border-orange-500 focus:ring-0 outline-none font-bold text-orange-900 placeholder-orange-200"
                                placeholder="••••"
                                maxLength={4}
                                autoFocus
                            />
                            <p className="text-center text-xs text-orange-600 font-bold mt-2">Enter code sent to {mobile}</p>
                          </div>
                      )}

                      {error && (
                          <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-center flex items-center justify-center gap-2">
                             <Shield className="w-3.5 h-3.5" />
                             {error}
                          </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-bold text-sm uppercase tracking-widest shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isAdminMode ? 'bg-gray-900 hover:bg-black shadow-gray-200' : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-orange-200'}`}
                      >
                        {loading ? 'Processing...' : (
                            <>
                                {isRegistering 
                                    ? (otpSent ? 'Verify & Register' : 'Send Verification') 
                                    : (isAdminMode ? 'Authenticate' : t.loginButton)}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                      </button>
                  </form>
                  
                  {/* Footer Actions */}
                  {!isAdminMode && (
                      <div className="mt-8 text-center space-y-5">
                        <button 
                            onClick={switchMode}
                            className="text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors"
                        >
                            {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Create one"}
                        </button>
                        
                        <a 
                          href="https://wa.me/919923993301" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-center p-3.5 rounded-xl bg-green-50 text-green-700 font-bold text-sm border border-green-100 hover:bg-green-100 hover:border-green-200 transition-all gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat with Support
                        </a>
                      </div>
                  )}
              </div>

              {/* Admin Toggle */}
              {!isRegistering && (
                  <div className="mt-8 flex justify-center">
                      <button 
                          onClick={toggleAdminMode}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${isAdminMode ? 'bg-white text-gray-900 border-gray-200 shadow-sm' : 'text-gray-400 border-transparent hover:bg-white hover:shadow-sm'}`}
                      >
                          {isAdminMode ? (
                              <>
                                <ArrowRight className="w-3 h-3 rotate-180" />
                                Back to Partner Login
                              </>
                          ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                Staff Access
                              </>
                          )}
                      </button>
                  </div>
              )}
              
              {/* Quick Fill Demos */}
              <div className="mt-4 flex justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                  {isAdminMode ? (
                      <button onClick={() => handleDemoFill('SUPER_ADMIN')} className="px-2 py-1 text-[9px] bg-gray-200 rounded text-gray-600 font-bold uppercase">Demo Admin</button>
                  ) : (
                      <>
                          <button onClick={() => handleDemoFill('STORE_ADMIN')} className="px-2 py-1 text-[9px] bg-gray-200 rounded text-gray-600 font-bold uppercase">Demo Store</button>
                          <button onClick={() => handleDemoFill('MEMBER')} className="px-2 py-1 text-[9px] bg-gray-200 rounded text-gray-600 font-bold uppercase">Demo Member</button>
                      </>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};
