'use client'

import { useState, useContext } from 'react'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FcGoogle } from 'react-icons/fc'
import { AppContext } from '@/context/Appcontext'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/firebaseConfig'
import { toast } from 'react-toastify'

/* ─────────────────────────────────────────
   Field is defined OUTSIDE AuthPage so it
   keeps a stable identity across renders —
   inputs never lose focus mid-typing.
───────────────────────────────────────── */
function Field({ label, type, value, onChange, error, showToggle, showPassword, onTogglePassword }) {
  return (
    <div>
      <div className="relative">
        <input
          type={showToggle ? (showPassword ? 'text' : 'password') : type}
          placeholder={label}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 bg-[#111] border text-[#f5f5f0] text-sm placeholder-[#444] outline-none transition-colors ${
            error ? 'border-red-500/70' : 'border-[#232323] focus:border-[#C9A96E]/50'
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#aaa] transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-[11px] mt-1.5">{error}</p>}
    </div>
  )
}

function Divider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#1e1e1e]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-[#0f0f0f] px-3 text-[10px] text-[#444] tracking-[0.2em] uppercase">
          or continue with
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main page component
───────────────────────────────────────── */
export default function AuthPage() {
  const { handleLogin, handleSignUp } = useContext(AppContext)
  const router = useRouter()

  const [showPassword, setShowPassword]   = useState(false)
  const [loading, setLoading]             = useState(false)
  const [signInForm, setSignInForm]       = useState({ email: '', password: '' })
  const [signUpForm, setSignUpForm]       = useState({ name: '', email: '', password: '' })
  const [errors, setErrors]               = useState({})

  const togglePassword = () => setShowPassword(v => !v)

  const validate = (form, type) => {
    const e = {}
    if (type === 'signup' && !form.name?.trim())  e.name     = 'Name is required'
    if (!form.email?.trim())                       e.email    = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password)                            e.password = 'Password is required'
    else if (form.password.length < 6)             e.password = 'Minimum 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSignIn = async (e) => {
    e.preventDefault()
    if (!validate(signInForm, 'signin')) return
    setLoading(true)
    const result = await handleLogin(signInForm.email, signInForm.password)
    setLoading(false)
    if (result.success) router.push('/')
  }

  const onSignUp = async (e) => {
    e.preventDefault()
    if (!validate(signUpForm, 'signup')) return
    setLoading(true)
    const result = await handleSignUp(signUpForm.email, signUpForm.password, signUpForm.name)
    setLoading(false)
    if (result.success) router.push('/')
  }

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast.success('Signed in with Google!')
      router.push('/')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const submitBtn = (label) => (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#C9A96E] hover:bg-[#E2C68A] disabled:opacity-60 disabled:cursor-not-allowed text-[#0a0a0a] font-semibold tracking-[0.12em] uppercase text-[12px] py-3.5 flex items-center justify-center gap-2 transition-colors"
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
        : <>{label} <ArrowRight className="w-4 h-4" /></>
      }
    </button>
  )

  const googleBtn = (label) => (
    <button
      type="button"
      onClick={handleGoogle}
      className="w-full py-3 border border-[#232323] hover:border-[#C9A96E]/40 flex items-center justify-center gap-2 text-[13px] text-[#666] hover:text-[#f5f5f0] transition-colors"
    >
      <FcGoogle className="text-lg" /> {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-playfair text-[#C9A96E] text-2xl font-bold tracking-[0.18em]">
            A.S FRAGRANCE
          </Link>
          <p className="text-[#444] text-[10px] tracking-[0.25em] uppercase mt-1">Luxury Fragrances</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f0f] border border-[#1e1e1e] p-8">
          <Tabs defaultValue="signin" className="w-full">

            {/* Tab switcher */}
            <TabsList className="grid grid-cols-2 w-full mb-8 bg-[#111] border border-[#1e1e1e] p-0.5">
              <TabsTrigger
                value="signin"
                className="text-[11px] tracking-[0.12em] uppercase font-semibold data-[state=active]:bg-[#C9A96E] data-[state=active]:text-[#0a0a0a] transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="text-[11px] tracking-[0.12em] uppercase font-semibold data-[state=active]:bg-[#C9A96E] data-[state=active]:text-[#0a0a0a] transition-all"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* ── Sign In ── */}
            <TabsContent value="signin">
              <h2 className="font-playfair text-2xl font-bold text-[#f5f5f0] mb-1">Welcome back</h2>
              <p className="text-[13px] text-[#555] mb-6">Sign in to your account</p>

              <form onSubmit={onSignIn} className="space-y-4">
                <Field
                  label="Email Address"
                  type="email"
                  value={signInForm.email}
                  onChange={e => setSignInForm(f => ({ ...f, email: e.target.value }))}
                  error={errors.email}
                />
                <Field
                  label="Password"
                  type="password"
                  value={signInForm.password}
                  onChange={e => setSignInForm(f => ({ ...f, password: e.target.value }))}
                  error={errors.password}
                  showToggle
                  showPassword={showPassword}
                  onTogglePassword={togglePassword}
                />
                <div className="text-right">
                  <Link href="/forgot-password" className="text-[12px] text-[#C9A96E] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                {submitBtn('Sign In')}
              </form>

              <Divider />
              {googleBtn('Sign in with Google')}
            </TabsContent>

            {/* ── Sign Up ── */}
            <TabsContent value="signup">
              <h2 className="font-playfair text-2xl font-bold text-[#f5f5f0] mb-1">Create account</h2>
              <p className="text-[13px] text-[#555] mb-6">Join A.S Fragrance today</p>

              <form onSubmit={onSignUp} className="space-y-4">
                <Field
                  label="Full Name"
                  type="text"
                  value={signUpForm.name}
                  onChange={e => setSignUpForm(f => ({ ...f, name: e.target.value }))}
                  error={errors.name}
                />
                <Field
                  label="Email Address"
                  type="email"
                  value={signUpForm.email}
                  onChange={e => setSignUpForm(f => ({ ...f, email: e.target.value }))}
                  error={errors.email}
                />
                <Field
                  label="Password"
                  type="password"
                  value={signUpForm.password}
                  onChange={e => setSignUpForm(f => ({ ...f, password: e.target.value }))}
                  error={errors.password}
                  showToggle
                  showPassword={showPassword}
                  onTogglePassword={togglePassword}
                />
                {submitBtn('Create Account')}
              </form>

              <Divider />
              {googleBtn('Sign up with Google')}
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  )
}
