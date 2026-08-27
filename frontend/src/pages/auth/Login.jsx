import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 700))

      // TEMPORARY DEVELOPMENT LOGIN
      // The real backend will determine the role later.

      const mockUsers = {
        'admin@interviewiq.com': {
          password: 'admin123',
          role: 'admin',
        },

        'recruiter@interviewiq.com': {
          password: 'recruiter123',
          role: 'recruiter',
        },

        'candidate@interviewiq.com': {
          password: 'candidate123',
          role: 'candidate',
        },
      }

      const user = mockUsers[email.toLowerCase()]

      // Check whether account exists
      if (!user) {
        setError('Account not found. Please check your email.')
        return
      }

      // Check password
      if (user.password !== password) {
        setError('Incorrect password. Please try again.')
        return
      }

      // Store temporary user information
      const userData = {
        email,
        role: user.role,
      }

      localStorage.setItem(
        'interviewai_user',
        JSON.stringify(userData)
      )

      // Role-based navigation
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard')
      } else {
        navigate('/candidate/dashboard')
      }

    } catch (err) {
      setError('Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  const handleGoogleLogin = () => {
    console.log('Google login')
  }

  const handleAppleLogin = () => {
    console.log('Apple login')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">

      {/* =====================================================
          LEFT BRAND PANEL
      ====================================================== */}

      <section className="relative hidden h-full w-[48%] overflow-hidden bg-[#dcecff] lg:flex">

        {/* Decorative background */}

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#c9e0fb]" />

        <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#c5ddf8]" />

        <div className="absolute right-20 top-1/3 h-32 w-32 rounded-full bg-white/20 blur-3xl" />

        {/* Content */}

        <div className="relative z-10 flex h-full w-full flex-col justify-between px-12 py-10 xl:px-16">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173b63]">

              <div className="h-5 w-5 rounded-full border-[4px] border-white border-r-[#8fc5ff]" />

            </div>

            <span className="text-lg font-bold tracking-tight text-[#173b63]">
              InterviewIQ
            </span>

          </div>


          {/* Main Content */}

          <div className="max-w-xl">

            {/* Badge */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b8d3ef] bg-white/60 px-4 py-2 text-xs font-semibold text-[#315d89]">

              <span className="h-2 w-2 rounded-full bg-[#4b9bea]" />

              AI-POWERED INTERVIEW PLATFORM

            </div>


            {/* Heading */}

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#17324f] xl:text-6xl">

              Smarter interviews.
              <br />

              Better hiring.

            </h1>


            {/* Description */}

            <p className="mt-6 max-w-lg text-base leading-7 text-[#54708d] xl:text-lg">

              Evaluate how candidates think, not just what they code.
              Our adaptive AI interviewer dynamically explores reasoning,
              algorithms, complexity, and edge cases.

            </p>


            {/* Features */}

            <div className="mt-9 grid max-w-xl grid-cols-1 gap-3 xl:grid-cols-3">

              <Feature
                number="01"
                title="Adaptive"
                description="Dynamic questioning"
              />

              <Feature
                number="02"
                title="Intelligent"
                description="Deep evaluation"
              />

              <Feature
                number="03"
                title="Actionable"
                description="Clear insights"
              />

            </div>

          </div>


          {/* Bottom */}

          <div className="flex items-center justify-between text-xs text-[#66809d]">

            <span>
              AI Interview Platform
            </span>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-[#4b9bea]" />

              Secure &amp; Private

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          RIGHT LOGIN PANEL
      ====================================================== */}

      <section className="flex h-full w-full flex-col bg-white lg:w-[52%]">

        {/* ===================================================
            TOP BAR
        ==================================================== */}

        <div className="flex shrink-0 items-center justify-between px-7 py-6 sm:px-10">

          {/* Mobile logo */}

          <div className="flex items-center gap-3 lg:hidden">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173b63]">

              <div className="h-4 w-4 rounded-full border-[3px] border-white border-r-[#8fc5ff]" />

            </div>

            <span className="font-bold text-[#173b63]">
              InterviewAI
            </span>

          </div>

          <div className="hidden lg:block" />

          {/* Signup */}

          <p className="text-sm text-slate-500">

            Don't have an account?{' '}

            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="font-semibold text-[#285b8f] underline-offset-4 transition hover:underline"
            >
              Sign Up
            </button>

          </p>

        </div>


        {/* ===================================================
            LOGIN AREA
        ==================================================== */}

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-7 py-6 sm:px-12">

          <div className="w-full max-w-[420px]">

            {/* Heading */}

            <div className="text-center">

              <h2 className="text-3xl font-bold tracking-tight text-[#17324f]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to your interview workspace
              </p>

            </div>


            {/* =================================================
                SOCIAL LOGIN
            ================================================== */}

            <div className="mt-8 space-y-3">

              {/* Google */}

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 border border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >

                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.5 5.5 0 0 1-2.4 3.61v3h3.89c2.28-2.1 3.55-5.19 3.55-8.64Z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.89-3A7.18 7.18 0 0 1 12 19.2c-3.05 0-5.63-2.06-6.56-4.83H1.42v3.09A12 12 0 0 0 12 24Z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M5.44 14.37A7.2 7.2 0 0 1 5.06 12c0-.82.14-1.62.38-2.37V6.54H1.42A12 12 0 0 0 0 12c0 1.93.46 3.76 1.42 5.46l4.02-3.09Z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 4.8c1.76 0 3.34.61 4.59 1.81l3.44-3.44C17.95 1.18 15.23 0 12 0A12 12 0 0 0 1.42 6.54l4.02 3.09C6.37 6.86 8.95 4.8 12 4.8Z"
                  />

                </svg>

                Continue with Google

              </button>


              {/* Apple */}

              <button
                type="button"
                onClick={handleAppleLogin}
                className="flex w-full items-center justify-center gap-3 border border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >

                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.07-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25C11.88 5.02 13.69 3.18 15.75 3c.29 2.58-2.34 4.5-3.72 4.25Z" />

                </svg>

                Continue with Apple

              </button>

            </div>


            {/* Divider */}

            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-[10px] font-medium tracking-wider text-slate-400">
                OR SIGN IN WITH
              </span>

              <div className="h-px flex-1 bg-slate-200" />

            </div>


            {/* =================================================
                LOGIN FORM
            ================================================== */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5797d2] focus:ring-4 focus:ring-[#5797d2]/10"
                />

              </div>


              {/* Password */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5797d2] focus:ring-4 focus:ring-[#5797d2]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >

                    {showPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}

                  </button>

                </div>

              </div>


              {/* Remember / Forgot */}

              <div className="flex items-center justify-between">

                <label className="flex cursor-pointer items-center gap-2">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 border-slate-300 accent-[#285b8f]"
                  />

                  <span className="text-sm text-slate-500">
                    Remember me
                  </span>

                </label>


                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm font-medium text-[#285b8f] transition hover:underline"
                >
                  Forgot password?
                </button>

              </div>


              {/* Error */}

              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}


              {/* Sign In */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 bg-[#285b8f] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214d79] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span>→</span>
                  </>
                )}

              </button>

            </form>


            {/* Security */}

            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >

                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="10"
                  rx="2"
                />

                <path d="M7 11V7a5 5 0 0 1 10 0v4" />

              </svg>

              Your account information is securely encrypted.

            </div>

          </div>

        </div>


        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="flex shrink-0 items-center justify-between px-7 py-5 text-xs text-slate-400 sm:px-10">

          <span>
            © 2026 InterviewAI
          </span>

          <div className="flex gap-5">

            <button
              type="button"
              className="transition hover:text-slate-600"
            >
              Privacy Policy
            </button>

            <button
              type="button"
              className="transition hover:text-slate-600"
            >
              Support
            </button>

          </div>

        </footer>

      </section>

    </div>
  )
}


/* ============================================================
   FEATURE
============================================================ */

function Feature({ number, title, description }) {
  return (
    <div className="border border-[#bfd7ef] bg-white/50 p-4">

      <div className="mb-3 flex h-8 w-8 items-center justify-center bg-[#e7f2ff] text-[10px] font-bold text-[#3972a7]">
        {number}
      </div>

      <h3 className="text-sm font-semibold text-[#294b6b]">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-[#6b849e]">
        {description}
      </p>

    </div>
  )
}


/* ============================================================
   EYE ICON
============================================================ */

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


/* ============================================================
   EYE OFF ICON
============================================================ */

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a18.4 18.4 0 0 1-3.1 3.9" />
      <path d="M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7c1.5 0 2.8-.3 4-.8" />
    </svg>
  )
}

export default Login