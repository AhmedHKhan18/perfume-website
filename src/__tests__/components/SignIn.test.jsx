/**
 * Sign-in / Sign-up page tests.
 * Covers rendering, tab switching, form validation, submission, and password toggle.
 */
import { render, screen, within, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthPage from '@/app/Sign-in/page'
import { AppContext } from '@/context/Appcontext'

// ── Module mocks ──────────────────────────────────────────────
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}))

jest.mock('@/firebaseConfig', () => ({ auth: {} }))

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  signInWithPopup: jest.fn().mockResolvedValue({ user: { email: 'g@test.com' } }),
}))

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), warning: jest.fn() },
}))

// ── Helpers ───────────────────────────────────────────────────
const mockHandleLogin  = jest.fn().mockResolvedValue({ success: true })
const mockHandleSignUp = jest.fn().mockResolvedValue({ success: true })

const baseCtx = {
  handleLogin:  mockHandleLogin,
  handleSignUp: mockHandleSignUp,
}

const renderPage = (ctxOverrides = {}) =>
  render(
    <AppContext.Provider value={{ ...baseCtx, ...ctxOverrides }}>
      <AuthPage />
    </AppContext.Provider>
  )

beforeEach(() => {
  jest.clearAllMocks()
  mockHandleLogin.mockResolvedValue({ success: true })
  mockHandleSignUp.mockResolvedValue({ success: true })
})

// ── Rendering ─────────────────────────────────────────────────

describe('Sign-in page – rendering', () => {
  test('renders the brand logo', () => {
    renderPage()
    expect(screen.getByText('A.S FRAGRANCE')).toBeInTheDocument()
  })

  test('renders "Luxury Fragrances" sub-label', () => {
    renderPage()
    expect(screen.getByText(/luxury fragrances/i)).toBeInTheDocument()
  })

  test('renders Sign In tab', () => {
    renderPage()
    expect(screen.getByRole('tab', { name: /sign in/i })).toBeInTheDocument()
  })

  test('renders Sign Up tab', () => {
    renderPage()
    expect(screen.getByRole('tab', { name: /sign up/i })).toBeInTheDocument()
  })

  test('shows "Welcome back" heading by default', () => {
    renderPage()
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })

  test('renders Email Address input on sign-in tab', () => {
    renderPage()
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument()
  })

  test('renders Password input', () => {
    renderPage()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  test('renders Forgot password link', () => {
    renderPage()
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
  })

  test('renders Google sign-in button', () => {
    renderPage()
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument()
  })
})

// ── Tab switching ─────────────────────────────────────────────

describe('Sign-in page – tab switching', () => {
  test('clicking Sign Up tab shows "Create account" heading', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('tab', { name: /sign up/i }))
    expect(screen.getByText('Create account')).toBeInTheDocument()
  })

  test('clicking Sign Up tab reveals Full Name input', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('tab', { name: /sign up/i }))
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
  })

  test('clicking Sign Up tab shows Google sign-up button', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('tab', { name: /sign up/i }))
    expect(screen.getByText(/sign up with google/i)).toBeInTheDocument()
  })
})

// ── Sign-in validation ────────────────────────────────────────

describe('Sign-in page – form validation', () => {
  test('shows "Email is required" on empty submit', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(await screen.findByText('Email is required')).toBeInTheDocument()
  })

  test('shows "Password is required" on empty submit', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(await screen.findByText('Password is required')).toBeInTheDocument()
  })

  test('shows "Invalid email" for bad email format', async () => {
    // Note: userEvent.click on a type="submit" button respects HTML5 constraint
    // validation — JSDOM blocks submission for an invalid type="email" value before
    // React's onSubmit fires.  fireEvent.submit bypasses native validation so the
    // React-side validate() function can run and set the error.
    renderPage()
    const emailInput = screen.getByPlaceholderText('Email Address')
    fireEvent.change(emailInput, { target: { value: 'notanemail' } })
    fireEvent.submit(emailInput.closest('form'))
    await waitFor(() => expect(screen.getByText('Invalid email')).toBeInTheDocument())
  })

  test('shows "Minimum 6 characters" for short password', async () => {
    renderPage()
    const emailInput = screen.getByPlaceholderText('Email Address')
    fireEvent.change(emailInput, { target: { value: 'user@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'abc' } })
    fireEvent.submit(emailInput.closest('form'))
    await waitFor(() => expect(screen.getByText('Minimum 6 characters')).toBeInTheDocument())
  })

  test('does NOT call handleLogin when form is invalid', async () => {
    const handleLogin = jest.fn()
    const user = userEvent.setup()
    renderPage({ handleLogin })
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(handleLogin).not.toHaveBeenCalled()
  })
})

// ── Sign-up validation ────────────────────────────────────────

describe('Sign-in page – sign-up validation', () => {
  async function goToSignUp() {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('tab', { name: /sign up/i }))
    return user
  }

  test('shows "Name is required" when name is empty', async () => {
    const user = await goToSignUp()
    await user.type(screen.getByPlaceholderText('Email Address'), 'ali@test.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pass123')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
  })

  test('does NOT call handleSignUp when name is missing', async () => {
    const handleSignUp = jest.fn()
    const user = userEvent.setup()
    render(
      <AppContext.Provider value={{ ...baseCtx, handleSignUp }}>
        <AuthPage />
      </AppContext.Provider>
    )
    await user.click(screen.getByRole('tab', { name: /sign up/i }))
    await user.type(screen.getByPlaceholderText('Email Address'), 'ali@test.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pass123')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(handleSignUp).not.toHaveBeenCalled()
  })
})

// ── Password toggle ───────────────────────────────────────────

describe('Sign-in page – password visibility toggle', () => {
  test('password input type is "password" by default', () => {
    renderPage()
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')
  })

  test('clicking the toggle button shows the password (type becomes "text")', async () => {
    const user = userEvent.setup()
    renderPage()
    const passwordInput = screen.getByPlaceholderText('Password')
    // The toggle button is the only button inside the password field's relative container
    const fieldContainer = passwordInput.closest('.relative')
    const toggleBtn = within(fieldContainer).getByRole('button')
    await user.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  test('clicking toggle twice hides password again', async () => {
    const user = userEvent.setup()
    renderPage()
    const passwordInput = screen.getByPlaceholderText('Password')
    const fieldContainer = passwordInput.closest('.relative')
    const toggleBtn = within(fieldContainer).getByRole('button')
    await user.click(toggleBtn)
    await user.click(toggleBtn)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})

// ── Form submission ───────────────────────────────────────────

describe('Sign-in page – form submission', () => {
  test('calls handleLogin with email and password', async () => {
    const handleLogin = jest.fn().mockResolvedValue({ success: true })
    const user = userEvent.setup()
    render(
      <AppContext.Provider value={{ ...baseCtx, handleLogin }}>
        <AuthPage />
      </AppContext.Provider>
    )
    await user.type(screen.getByPlaceholderText('Email Address'), 'user@test.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pass123')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))
    expect(handleLogin).toHaveBeenCalledWith('user@test.com', 'pass123')
  })

  test('calls handleSignUp with name, email, password', async () => {
    const handleSignUp = jest.fn().mockResolvedValue({ success: true })
    const user = userEvent.setup()
    render(
      <AppContext.Provider value={{ ...baseCtx, handleSignUp }}>
        <AuthPage />
      </AppContext.Provider>
    )
    await user.click(screen.getByRole('tab', { name: /sign up/i }))
    await user.type(screen.getByPlaceholderText('Full Name'), 'Ali Khan')
    await user.type(screen.getByPlaceholderText('Email Address'), 'ali@test.com')
    await user.type(screen.getByPlaceholderText('Password'), 'pass123')
    await user.click(screen.getByRole('button', { name: /create account/i }))
    expect(handleSignUp).toHaveBeenCalledWith('ali@test.com', 'pass123', 'Ali Khan')
  })
})
