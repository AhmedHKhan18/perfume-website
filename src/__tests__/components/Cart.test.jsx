/**
 * Cart page component tests.
 * The AppContext is mocked so we can control state independently.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cart from '@/app/Cart/page'
import { AppContext } from '@/context/Appcontext'

// ── Module mocks ──────────────────────────────────────────────
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn(), back: jest.fn() }),
  usePathname: jest.fn().mockReturnValue('/Cart'),
}))

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn((_auth, cb) => { cb(null); return jest.fn() }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}))
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({ docs: [] }),
  doc: jest.fn(),
  addDoc: jest.fn().mockResolvedValue({ id: 'order-123' }),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}))
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() },
  ToastContainer: () => null,
}))

jest.mock('sweetalert2', () => ({
  default: {
    fire: jest.fn().mockResolvedValue({ isConfirmed: false }),
  },
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} />,
}))

// ── Fixtures ──────────────────────────────────────────────────
const item1 = { id: 'p1', name: 'Rose Perfume',  price: 1000, quantity: 1, image: '/rose.jpg', volume: '50ml' }
const item2 = { id: 'p2', name: 'Oud Classic',   price: 1500, quantity: 2, image: '/oud.jpg',  volume: '100ml' }
const loggedInUser = { uid: 'u1', email: 'buyer@test.com' }

const baseCtx = {
  user: loggedInUser,
  loading: false,
  cart: [item1],
  removeFromCart: jest.fn(),
  updateCartQuantity: jest.fn(),
  clearCart: jest.fn(),
}

const renderCart = (ctxOverrides = {}) =>
  render(
    <AppContext.Provider value={{ ...baseCtx, ...ctxOverrides }}>
      <Cart />
    </AppContext.Provider>
  )

// ── Empty state ───────────────────────────────────────────────

describe('Cart – empty state', () => {
  test('shows empty-cart heading when cart is empty', () => {
    renderCart({ cart: [] })
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  test('shows Shop Now link when cart is empty', () => {
    renderCart({ cart: [] })
    expect(screen.getByRole('link', { name: /shop now/i })).toBeInTheDocument()
  })

  test('does not render the item list when cart is empty', () => {
    renderCart({ cart: [] })
    expect(screen.queryByText('Rose Perfume')).not.toBeInTheDocument()
  })
})

// ── Item rendering ────────────────────────────────────────────

describe('Cart – item list', () => {
  test('renders item name', () => {
    renderCart()
    expect(screen.getByText('Rose Perfume')).toBeInTheDocument()
  })

  test('renders item volume', () => {
    renderCart()
    expect(screen.getByText('Volume: 50ml')).toBeInTheDocument()
  })

  test('renders Shopping Cart heading', () => {
    renderCart()
    expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument()
  })

  test('shows correct item count in header', () => {
    renderCart()
    expect(screen.getByText(/1 item/)).toBeInTheDocument()
  })

  test('shows plural "items" for multiple entries', () => {
    renderCart({ cart: [item1, item2] })
    expect(screen.getByText(/2 items/)).toBeInTheDocument()
  })

  test('calls removeFromCart with correct id when trash clicked', () => {
    const removeFromCart = jest.fn()
    renderCart({ removeFromCart })
    fireEvent.click(screen.getByLabelText('Remove item'))
    expect(removeFromCart).toHaveBeenCalledWith('p1')
  })

  test('calls updateCartQuantity +1 when plus button clicked', () => {
    const updateCartQuantity = jest.fn()
    renderCart({ updateCartQuantity })
    // Plus button is the last quantity-control button
    const buttons = screen.getAllByRole('button')
    const plusBtn = buttons.find(b => b.querySelector('.lucide-plus') || b.innerHTML.includes('Plus'))
    // Find by sibling structure: quantity span is between minus and plus
    const quantitySpan = screen.getByText('1') // quantity display
    const row = quantitySpan.parentElement
    const [, plusButton] = row.querySelectorAll('button')
    fireEvent.click(plusButton)
    expect(updateCartQuantity).toHaveBeenCalledWith('p1', 2)
  })

  test('calls updateCartQuantity -1 when minus button clicked', () => {
    const updateCartQuantity = jest.fn()
    renderCart({ cart: [{ ...item1, quantity: 2 }], updateCartQuantity })
    const quantitySpan = screen.getByText('2')
    const row = quantitySpan.parentElement
    const [minusButton] = row.querySelectorAll('button')
    fireEvent.click(minusButton)
    expect(updateCartQuantity).toHaveBeenCalledWith('p1', 1)
  })
})

// ── Coupon codes ──────────────────────────────────────────────

describe('Cart – coupon codes', () => {
  test('renders coupon input and Apply button', () => {
    renderCart()
    expect(screen.getByPlaceholderText('Enter coupon code')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
  })

  test('shows hint text listing available coupons', () => {
    renderCart()
    expect(screen.getByText(/WELCOME20, SAVE10, ASFF15/)).toBeInTheDocument()
  })

  test('applies WELCOME20 coupon (20% off)', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.type(screen.getByPlaceholderText('Enter coupon code'), 'WELCOME20')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText(/WELCOME20 — 20% off/)).toBeInTheDocument()
  })

  test('applies SAVE10 coupon (10% off)', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.type(screen.getByPlaceholderText('Enter coupon code'), 'SAVE10')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText(/SAVE10 — 10% off/)).toBeInTheDocument()
  })

  test('applies ASFF15 coupon (15% off)', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.type(screen.getByPlaceholderText('Enter coupon code'), 'ASFF15')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText(/ASFF15 — 15% off/)).toBeInTheDocument()
  })

  test('shows error for invalid coupon code', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.type(screen.getByPlaceholderText('Enter coupon code'), 'BADCODE')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText('Invalid coupon code.')).toBeInTheDocument()
  })

  test('removes applied coupon when Remove is clicked', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.type(screen.getByPlaceholderText('Enter coupon code'), 'SAVE10')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await user.click(screen.getByRole('button', { name: 'Remove' }))
    expect(screen.queryByText(/SAVE10 — 10% off/)).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter coupon code')).toBeInTheDocument()
  })

  test('applies coupon when Enter key is pressed in input', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.type(screen.getByPlaceholderText('Enter coupon code'), 'WELCOME20{Enter}')
    expect(screen.getByText(/WELCOME20 — 20% off/)).toBeInTheDocument()
  })

  test('coupon input is case-insensitive', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.type(screen.getByPlaceholderText('Enter coupon code'), 'welcome20')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText(/WELCOME20 — 20% off/)).toBeInTheDocument()
  })
})

// ── Order summary ─────────────────────────────────────────────

describe('Cart – order summary', () => {
  test('shows subtotal heading', () => {
    renderCart()
    expect(screen.getByText('Subtotal')).toBeInTheDocument()
  })

  test('shows total heading', () => {
    renderCart()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  test('shows shipping section', () => {
    renderCart()
    expect(screen.getByText('Shipping')).toBeInTheDocument()
  })

  test('shows discount row after valid coupon applied', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.type(screen.getByPlaceholderText('Enter coupon code'), 'WELCOME20')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText(/Discount/)).toBeInTheDocument()
    expect(screen.getByText(/−Rs/)).toBeInTheDocument()
  })

  test('hides discount row when no coupon applied', () => {
    renderCart()
    expect(screen.queryByText(/Discount/)).not.toBeInTheDocument()
  })
})

// ── Auth state on Place Order ─────────────────────────────────

describe('Cart – Place Order button', () => {
  test('shows "Sign In to Place Order" when user not logged in', () => {
    renderCart({ user: null })
    expect(screen.getByText(/Sign In to Place Order/)).toBeInTheDocument()
  })

  test('shows "Place Order · Rs" with total when logged in', () => {
    renderCart()
    expect(screen.getByText(/Place Order · Rs/)).toBeInTheDocument()
  })
})

// ── Checkout form validation ──────────────────────────────────

describe('Cart – checkout form validation', () => {
  test('shows "Full name is required" when name is empty', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByText(/Place Order · Rs/))
    expect(await screen.findByText('Full name is required')).toBeInTheDocument()
  })

  test('shows "Phone number is required" when phone is empty', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByText(/Place Order · Rs/))
    expect(await screen.findByText('Phone number is required')).toBeInTheDocument()
  })

  test('shows "Address is required" when address is empty', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByText(/Place Order · Rs/))
    expect(await screen.findByText('Address is required')).toBeInTheDocument()
  })

  test('shows "City is required" when city is empty', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByText(/Place Order · Rs/))
    expect(await screen.findByText('City is required')).toBeInTheDocument()
  })

  test('does NOT call addDoc when form is invalid', async () => {
    const { addDoc } = require('firebase/firestore')
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByText(/Place Order · Rs/))
    expect(addDoc).not.toHaveBeenCalled()
  })
})
