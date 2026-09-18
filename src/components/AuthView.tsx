import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  RefreshCw,
  Send,
  ShieldCheck
} from 'lucide-react';
import { 
  signInUser, 
  signUpUser, 
  verifyEmailCode, 
  resendVerificationCode, 
  signInWithGoogle,
  checkIsSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseConfig,
  clearSupabaseConfig,
  getPendingVerificationCode,
  checkEmailConfirmationStatus
} from '../lib/auth.ts';
import { UserProfile } from '../types.ts';

interface AuthViewProps {
  onAuthSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup' | 'verify';

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // 6-digit OTP code states
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Supabase Configuration States
  const [hasSupabase, setHasSupabase] = useState<boolean>(() => checkIsSupabaseConfigured());
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState<string>(() => getSupabaseCredentials().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState<string>(() => getSupabaseCredentials().anonKey);
  const [supabaseConfigSuccess, setSupabaseConfigSuccess] = useState<string | null>(null);
  const [supabaseConfigError, setSupabaseConfigError] = useState<string | null>(null);

  const handleSaveSupabaseConfig = () => {
    setSupabaseConfigError(null);
    setSupabaseConfigSuccess(null);
    const cleanUrl = supabaseUrlInput.trim();
    const cleanKey = supabaseKeyInput.trim();

    if (!cleanUrl || !cleanKey) {
      setSupabaseConfigError('يرجى إدخال كل من رابط المشروع Project URL ومفتاح الـ Anon Key.');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setSupabaseConfigError('يجب أن يبدأ رابط المشروع بـ https:// (مثال: https://xxxx.supabase.co)');
      return;
    }

    saveSupabaseConfig(cleanUrl, cleanKey);
    setHasSupabase(true);
    setSupabaseConfigSuccess('تم ربط وحفظ مشروع Supabase بنجاح! يعمل النظام الآن عبر سحابة Supabase.');
    setTimeout(() => {
      setSupabaseConfigSuccess(null);
      setShowSupabaseModal(false);
    }, 1500);
  };

  const handleResetSupabaseConfig = () => {
    clearSupabaseConfig();
    setHasSupabase(false);
    setSupabaseUrlInput('');
    setSupabaseKeyInput('');
    setSupabaseConfigSuccess('تم فصل مشروع Supabase والعودة إلى المصادقة المحلية.');
    setTimeout(() => {
      setSupabaseConfigSuccess(null);
    }, 1500);
  };

  const [checkingStatus, setCheckingStatus] = useState(false);

  // Check if confirmation link was clicked in email
  const handleCheckConfirmationLink = async () => {
    clearMessages();
    setCheckingStatus(true);
    try {
      const res = await checkEmailConfirmationStatus(email, password);
      if (res.success && res.user) {
        setSuccessMessage('تم تأكيد الحساب بنجاح! جاري الدخول...');
        setTimeout(() => {
          onAuthSuccess(res.user!);
        }, 800);
      } else {
        setErrorMessage(res.error || 'لم يتم تأكيد الحساب بعد من الرابط. تأكد من فتح الرابط في الإيميل.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل فحص الرابط');
    } finally {
      setCheckingStatus(false);
    }
  };

  // Skip verification option
  const handleSkipVerification = () => {
    const fallbackUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: email.trim().toLowerCase(),
      name: fullName.trim() || email.split('@')[0],
      createdAt: new Date().toISOString(),
      emailConfirmed: true,
      provider: hasSupabase ? 'email' : undefined,
    };
    onAuthSuccess(fallbackUser);
  };

  // Timer countdown effect for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim() || !password) {
      setErrorMessage('يرجى كتابة البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const res = await signInUser(email, password);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else if (res.needsEmailVerification) {
        setOtpDigits(['', '', '', '', '', '']);
        setResendCooldown(60);
        setMode('verify');
        setErrorMessage(res.error || 'تم إرسال رمز التحقق السري إلى بريدك الإلكتروني.');
      } else {
        setErrorMessage(res.error || 'فشل تسجيل الدخول. تحقق من بياناتك المدخلة');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim() || !password) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('يجب أن تكون كلمة المرور 6 أحرف على الأقل لحماية حسابك');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    try {
      const res = await signUpUser(email, password, fullName);
      if (res.success) {
        if (res.needsEmailVerification) {
          setOtpDigits(['', '', '', '', '', '']);
          setResendCooldown(60);
          setMode('verify');
          if (res.debugCode) {
            setActiveOtpCode(res.debugCode);
          }
          setSuccessMessage(
            hasSupabase
              ? 'تم إرسال رمز التأكيد السري إلى بريدك الإلكتروني عبر Supabase!'
              : 'تم إنشاء حسابك بنجاح! تفقد رمز التحقق السريع أدناه لتأكيد حسابك.'
          );
        } else if (res.user) {
          onAuthSuccess(res.user);
        }
      } else {
        setErrorMessage(res.error || 'تعذر إنشاء الحساب');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ في التسجيل');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const copy = [...otpDigits];
      copy[index] = '';
      setOtpDigits(copy);
      return;
    }

    // Handle paste of 6 digits
    if (clean.length > 1) {
      const chars = clean.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      chars.forEach((c, i) => {
        if (i < 6) newDigits[i] = c;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(chars.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const copy = [...otpDigits];
    copy[index] = clean;
    setOtpDigits(copy);

    // Auto-advance to next box
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Submit OTP Verification
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMessage('يرجى إدخال الرمز السري المكون من 6 أرقام كاملاً من بريدك');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmailCode(email, code);
      if (res.success && res.user) {
        setSuccessMessage('تم تأكيد ملكية البريد بنجاح! جاري الدخول...');
        setTimeout(() => {
          onAuthSuccess(res.user!);
        }, 500);
      } else {
        setErrorMessage(res.error || 'رمز التأكيد غير صحيح. تأكد من إدخال الرمز من بريدك الوارد');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل التحقق من الرمز');
    } finally {
      setLoading(false);
    }
  };

  // Resend code to user's email
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    clearMessages();
    setLoading(true);
    try {
      const res = await resendVerificationCode(email);
      if (res.success) {
        setResendCooldown(60);
        if (res.debugCode) {
          setActiveOtpCode(res.debugCode);
        }
        setSuccessMessage(
          hasSupabase
            ? 'تم إرسال رمز تأكيد جديد إلى بريدك الإلكتروني.'
            : 'تم إنشاء رمز تأكيد جديد! يمكنك استخدامه أدناه مباشرة.'
        );
      } else {
        setErrorMessage(res.error || 'تعذر إعادة إرسال الرمز');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'تعذر إعادة إرسال الرمز');
    } finally {
      setLoading(false);
    }
  };

  // Real Google Sign-In Trigger (Calls official OAuth / Google Identity Services)
  const handleGoogleAuthClick = async () => {
    clearMessages();
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل تسجيل الدخول عبر Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Brand / Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {mode === 'login' && 'تسجيل الدخول إلى QuickDrop'}
            {mode === 'signup' && 'إنشاء حساب جديد'}
            {mode === 'verify' && 'التحقق من البريد الإلكتروني'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            {mode === 'login' && 'سجّل دخولك للوصول إلى أجهزتك ومشاركة الملفات بأمان تام'}
            {mode === 'signup' && 'أنشئ حسابك الشخصي لتأمين جلساتك وحفظ ملفاتك وإعداداتك'}
            {mode === 'verify' && 'أدخل رمز الأمان السري المرسل إلى بريدك الإلكتروني لتفعيل الحساب'}
          </p>
        </div>

        {/* Security & Authentication Protocol Badge */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-xs">
          <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>نظام الأمان:</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {hasSupabase ? 'Supabase Auth Cloud' : 'نظام المصادقة المشفر'}
            </span>
            <button
              type="button"
              onClick={() => setShowSupabaseModal(true)}
              className="px-2 py-0.5 rounded-md bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 text-[11px] font-medium transition-colors cursor-pointer"
              title="إعدادات وربط Supabase"
            >
              ⚙️ {hasSupabase ? 'إعدادات' : 'ربط Supabase'}
            </button>
          </div>
        </div>

        {/* Error and Success Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* REAL GOOGLE AUTH BUTTON */}
        {mode !== 'verify' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleAuthClick}
              disabled={loading}
              id="google-signin-btn"
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 active:scale-[0.99] text-zinc-800 dark:text-zinc-100 font-medium text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-60"
            >
              {/* Official Google Color SVG Logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>المتابعة باستخدام Google (Google Auth)</span>
            </button>

            {/* Modern Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              <span className="absolute bg-white dark:bg-zinc-900 px-3 text-xs text-zinc-400 font-medium">
                أو المتابعة بالبريد الإلكتروني
              </span>
            </div>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                البريد الإلكتروني (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-left"
                  dir="ltr"
                  id="login-email-input"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                كلمة المرور (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-left"
                  dir="ltr"
                  id="login-password-input"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-60 transition-all cursor-pointer"
              id="login-submit-btn"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* REGISTER LINK UNDER LOGIN */}
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                ليس لديك حساب؟{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('signup');
                  }}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer transition-colors"
                  id="go-to-signup-btn"
                >
                  إنشاء حساب جديد (Register)
                </button>
              </p>
            </div>
          </form>
        )}

        {/* 2. SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                الاسم الكامل (Full Name)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  id="signup-name-input"
                />
                <User className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                البريد الإلكتروني (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-left"
                  dir="ltr"
                  id="signup-email-input"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                كلمة المرور (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6 أحرف على الأقل"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-left"
                  dir="ltr"
                  id="signup-password-input"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                تأكيد كلمة المرور (Confirm Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد كتابة كلمة المرور"
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-left"
                  dir="ltr"
                  id="signup-confirm-password-input"
                />
                <KeyRound className="w-4 h-4 text-zinc-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-60 transition-all cursor-pointer"
              id="signup-submit-btn"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>إرسال رمز التأكيد والمتابعة</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                لديك حساب بالفعل؟{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('login');
                  }}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer transition-colors"
                  id="back-to-login-btn"
                >
                  تسجيل الدخول (Sign in)
                </button>
              </p>
            </div>
          </form>
        )}

        {/* 3. OTP / EMAIL CONFIRMATION VERIFICATION */}
        {mode === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            {/* Secure Email Destination Badge */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 space-y-2 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-300">
                حسابك بانتظار التأكيد لعنوان البريد:
              </div>
              <div className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900/80 py-1 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 inline-block" dir="ltr">
                {email}
              </div>
            </div>

            {/* Supabase Link vs Code Guidance Box */}
            <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5 text-right">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
                <span>📬</span>
                <span>تنبيه هام حول رسائل التأكيد:</span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                إذا وصلتك رسالة تحتوي على <strong>رابط تأكيد (Confirmation Link)</strong>، اضغط عليه في بريدك، ثم انقر على زر <strong>"تحقق من تفعيل الرابط"</strong> أدناه.
                <br />
                أما إذا كان بالرسالة <strong>رمز أرقام (OTP)</strong>، فاكتبه في الخانات الستة بالأسفل.
              </p>
            </div>

            {/* Quick OTP Helper Banner (when code is available locally) */}
            {activeOtpCode && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm shadow-sm">
                <div className="text-right space-y-0.5">
                  <span className="text-zinc-600 dark:text-zinc-300 font-medium block text-xs">
                    رمز التحقق السريع:
                  </span>
                  <span className="font-mono font-bold text-xl text-emerald-600 dark:text-emerald-400 tracking-widest block" dir="ltr">
                    {activeOtpCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const digits = activeOtpCode.slice(0, 6).split('');
                    setOtpDigits(digits);
                    otpInputRefs.current[5]?.focus();
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  id="auto-fill-otp-btn"
                >
                  تعبئة الرمز تلقائياً ⚡
                </button>
              </div>
            )}

            {/* 6-Digit Segmented OTP Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block text-center">
                أدخل رمز التأكيد (OTP) المكون من 6 أرقام:
              </label>
              <div className="flex justify-center items-center gap-2 sm:gap-2.5" dir="ltr">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl bg-zinc-50 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                    id={`otp-digit-${idx}`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpDigits.join('').length < 6}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
              id="verify-submit-btn"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد الحساب والدخول بالرمز</span>
                </>
              )}
            </button>

            {/* Check Confirmation Link Button */}
            <button
              type="button"
              onClick={handleCheckConfirmationLink}
              disabled={checkingStatus}
              className="w-full py-2 px-3 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              id="check-confirmation-link-btn"
            >
              {checkingStatus ? (
                <div className="w-3.5 h-3.5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
              )}
              <span>تحقق من تفعيل الرابط (إذا ضغطت عليه في الإيميل) 🔄</span>
            </button>

            {/* Resend Cooldown, Skip, and Back to Login */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading || resendCooldown > 0}
                  className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  id="resend-code-btn"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCooldown > 0 ? `إعادة الإرسال بعد (${resendCooldown}ث)` : 'إعادة إرسال الرمز أو الرابط'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSkipVerification}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-bold cursor-pointer flex items-center gap-1 text-xs"
                  id="skip-verification-btn"
                  title="تخطي شاشة التأكيد والمتابعة للدخول مباشرة"
                >
                  <span>تخطي التأكيد والدخول ⚡</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('login');
                  }}
                  className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-xs cursor-pointer"
                >
                  العودة إلى شاشة تسجيل الدخول
                </button>
              </div>
            </div>
          </form>
        )}
        {/* Supabase Configuration Modal */}
        {showSupabaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4 text-right">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <button
                  type="button"
                  onClick={() => setShowSupabaseModal(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  ✕
                </button>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">إعدادات وربط Supabase</span>
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                اربط مشروعك على <strong>Supabase</strong> لتشغيل تسجيل الدخول السحابي الفعلي، وتأكيد البريد الإلكتروني (OTP)، وحفظ المستخدمين في لوحة تحكم Supabase الخاصة بك.
              </p>

              {supabaseConfigError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300">
                  {supabaseConfigError}
                </div>
              )}

              {supabaseConfigSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300">
                  {supabaseConfigSuccess}
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                    Supabase Project URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://xyzproject.supabase.co"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
                    Supabase Anon Public Key:
                  </label>
                  <input
                    type="text"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                  💡 تجد هذه القيم في لوحة تحكم <strong>Supabase Dashboard</strong> ⬅️ <strong>Project Settings</strong> ⬅️ <strong>API</strong>.
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveSupabaseConfig}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    حفظ وربط Supabase
                  </button>
                  {hasSupabase && (
                    <button
                      type="button"
                      onClick={handleResetSupabaseConfig}
                      className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      فصل المشروع
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
