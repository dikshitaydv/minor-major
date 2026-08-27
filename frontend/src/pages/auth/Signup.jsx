
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!agreeTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.')
      return
    }

    setLoading(true)

    try {
      /*
        TEMPORARY MOCK SIGNUP

        Later this will become:

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
          }),
        })

        The backend automatically assigns:

        role: "candidate"

        The user cannot choose Admin or Recruiter.
      */

      await new Promise((resolve) => setTimeout(resolve, 800))

      navigate('/candidate/dashboard')
    } catch (err) {
      setError('Unable to create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    console.log('Google signup')
  }

  const handleAppleSignup = () => {
    console.log('Apple signup')
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">

      {/* =====================================================
          LEFT BRAND PANEL
      ====================================================== */}

      <section className="relative hidden h-full w-[48%] overflow-hidden bg-[#dcecff] lg:flex">

        {/* Background decoration */}

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#c9e0fb]" />

        <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-[#c5ddf8]" />

        <div className="absolute right-20 top-1/3 h-32 w-32 rounded-full bg-white/20 blur-3xl" />


        <div className="relative z-10 flex h-full w-full flex-col justify-between px-12 py-10 xl:px-16">

          {/* Logo */}

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex w-fit items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173b63]">

              <div className="h-5 w-5 rounded-full border-[4px] border-white border-r-[#8fc5ff]" />

            </div>

            <span className="text-lg font-bold tracking-tight text-[#173b63]">
              InterviewIQ
            </span>

          </button>


          {/* Main Content */}

          <div className="max-w-xl">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b8d3ef] bg-white/60 px-4 py-2 text-xs font-semibold text-[#315d89]">

              <span className="h-2 w-2 rounded-full bg-[#4b9bea]" />

              START YOUR INTERVIEW JOURNEY

            </div>


            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#17324f] xl:text-6xl">

              Show how you
              <br />
              think.

            </h1>


            <p className="mt-6 max-w-lg text-base leading-7 text-[#54708d] xl:text-lg">

              Create your candidate account and experience an adaptive
              technical interview designed to evaluate your complete
              problem-solving approach.

            </p>


            {/* Candidate benefits */}

            <div className="mt-9 space-y-4">

              <Benefit
                icon="✓"
                title="Adaptive questioning"
                description="The interview responds to your reasoning and answers."
              />

              <Benefit
                icon="✓"
                title="Fair evaluation"
                description="Your solution is evaluated across multiple dimensions."
              />

              <Benefit
                icon="✓"
                title="Detailed feedback"
                description="Understand your strengths and areas for improvement."
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
          RIGHT SIGNUP PANEL
      ====================================================== */}

      <section className="flex h-full w-full flex-col bg-white lg:w-[52%]">

        {/* Top Bar */}

        <div className="flex shrink-0 items-center justify-between px-7 py-6 sm:px-10">

          {/* Mobile Logo */}

          <div className="flex items-center gap-3 lg:hidden">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#173b63]">

              <div className="h-4 w-4 rounded-full border-[3px] border-white border-r-[#8fc5ff]" />

            </div>

            <span className="font-bold text-[#173b63]">
              InterviewAI
            </span>

          </div>

          <div className="hidden lg:block" />


          <p className="text-sm text-slate-500">

            Already have an account?{' '}

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-[#285b8f] underline-offset-4 transition hover:underline"
            >
              Sign In
            </button>

          </p>

        </div>


        {/* Signup Content */}

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-7 py-5 sm:px-12">

          <div className="w-full max-w-[440px]">

            {/* Heading */}

            <div className="text-center">

              <h2 className="text-3xl font-bold tracking-tight text-[#17324f]">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Join InterviewAI and start preparing for your next interview
              </p>

            </div>


            {/* Social Signup */}

            <div className="mt-7 space-y-3">

              <button
                type="button"
                onClick={handleGoogleSignup}
                className="flex w-full items-center justify-center gap-3 border border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >

                <GoogleIcon />

                Continue with Google

              </button>


              <button
                type="button"
                onClick={handleAppleSignup}
                className="flex w-full items-center justify-center gap-3 border border-slate-200 bg-white py-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >

                <AppleIcon />

                Continue with Apple

              </button>

            </div>


            {/* Divider */}

            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-[10px] font-medium tracking-wider text-slate-400">
                OR CREATE WITH EMAIL
              </span>

              <div className="h-px flex-1 bg-slate-200" />

            </div>


            {/* Form */}

            <form
              onSubmit={handleSignup}
              className="space-y-4"
            >

              {/* First + Last Name */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    First name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    required
                    className="w-full border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5797d2] focus:ring-4 focus:ring-[#5797d2]/10"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Last name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    required
                    className="w-full border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5797d2] focus:ring-4 focus:ring-[#5797d2]/10"
                  />

                </div>

              </div>


              {/* Email */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
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
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength={8}
                    className="w-full border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5797d2] focus:ring-4 focus:ring-[#5797d2]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
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

                <p className="mt-1.5 text-xs text-slate-400">
                  Use at least 8 characters.
                </p>

              </div>


              {/* Confirm Password */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm password
                </label>

                <div className="relative">

                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5797d2] focus:ring-4 focus:ring-[#5797d2]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >

                    {showConfirmPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}

                  </button>

                </div>

              </div>


              {/* Terms */}

              <label className="flex cursor-pointer items-start gap-3 pt-1">

                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 border-slate-300 accent-[#285b8f]"
                />

                <span className="text-xs leading-5 text-slate-500">

                  I agree to the{' '}

                  <button
                    type="button"
                    className="font-medium text-[#285b8f] hover:underline"
                  >
                    Terms of Service
                  </button>

                  {' '}and{' '}

                  <button
                    type="button"
                    className="font-medium text-[#285b8f] hover:underline"
                  >
                    Privacy Policy
                  </button>

                </span>

              </label>


              {/* Error */}

              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}


              {/* Create Account */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 bg-[#285b8f] py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214d79] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span>→</span>
                  </>
                )}

              </button>

            </form>


            {/* Security */}

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400">

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


        {/* Footer */}

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
   BENEFIT COMPONENT
============================================================ */

function Benefit({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-white/70 text-sm font-bold text-[#3972a7]">
        {icon}
      </div>

      <div>

        <h3 className="text-sm font-semibold text-[#294b6b]">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-[#6b849e]">
          {description}
        </p>

      </div>

    </div>
  )
}


/* ============================================================
   GOOGLE ICON
============================================================ */

function GoogleIcon() {
  return (
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
  )
}


/* ============================================================
   APPLE ICON
============================================================ */

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.07-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25C11.88 5.02 13.69 3.18 15.75 3c.29 2.58-2.34 4.5-3.72 4.25Z" />
    </svg>
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

export default Signup

