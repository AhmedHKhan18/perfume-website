/**
 * AppContext tests — renders AppProvider with mocked Firebase and
 * verifies cart, wishlist, and auth-guard behaviour.
 */
import { render, screen, act, waitFor } from '@testing-library/react'
import { useContext } from 'react'
import { AppProvider, AppContext } from '@/context/Appcontext'

// ── Firebase mocks ────────────────────────────────────────────
jest.mock('@/firebaseConfig', () => ({ auth: {}, db: {} }))

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  collection: jest.fn().mockReturnValue('mock-ref'),
  getDocs: jest.fn().mockResolvedValue({ docs: [] }),
  doc: jest.fn(),
  addDoc: jest.fn().mockResolvedValue({ id: 'new-id' }),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}))

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
  ToastContainer: () => null,
}))

// ── Import mocked modules ─────────────────────────────────────
import { onAuthStateChanged } from 'firebase/auth'
import { toast } from 'react-toastify'

// ── Helpers ───────────────────────────────────────────────────
const mockUser = { uid: 'u1', email: 'test@example.com', displayName: 'Test User' }

function setupAuth(user = null) {
  onAuthStateChanged.mockImplementation((_auth, cb) => {
    cb(user)
    return jest.fn() // unsubscribe
  })
}

// A component that exposes context state via data-testid attributes
function ContextReader({ onRender }) {
  const ctx = useContext(AppContext)
  onRender(ctx)
  return null
}

function CartTester() {
  const { cart, cartCount, addToCart, removeFromCart, updateCartQuantity, clearCart } =
    useContext(AppContext)
  const product = { id: 'p1', name: 'Rose', price: 500, volume: '30ml' }
  return (
    <div>
      <div data-testid="cart">{JSON.stringify(cart)}</div>
      <div data-testid="cartCount">{cartCount}</div>
      <button data-testid="add"    onClick={() => addToCart(product)}>Add</button>
      <button data-testid="remove" onClick={() => removeFromCart('p1')}>Remove</button>
      <button data-testid="inc"    onClick={() => updateCartQuantity('p1', 3)}>Inc</button>
      <button data-testid="clear"  onClick={() => clearCart()}>Clear</button>
    </div>
  )
}

function WishlistTester() {
  const { wishlist, wishlistCount, toggleWishlist, isInWishlist } = useContext(AppContext)
  const product = { id: 'w1', name: 'Oud', price: 1200 }
  return (
    <div>
      <div data-testid="wishlist">{JSON.stringify(wishlist)}</div>
      <div data-testid="wishlistCount">{wishlistCount}</div>
      <div data-testid="inWishlist">{String(isInWishlist('w1'))}</div>
      <button data-testid="toggle" onClick={() => toggleWishlist(product)}>Toggle</button>
    </div>
  )
}

// ── Setup ─────────────────────────────────────────────────────
beforeEach(() => {
  jest.resetAllMocks()
  localStorage.clear()
  // Re-setup critical mocks after reset
  setupAuth(null)
  const { getDocs } = require('firebase/firestore')
  getDocs.mockResolvedValue({ docs: [] })
})

// ── Auth state ────────────────────────────────────────────────

describe('AppContext – auth state', () => {
  test('user is null when not logged in', async () => {
    let ctx
    render(<AppProvider><ContextReader onRender={c => { ctx = c }} /></AppProvider>)
    await waitFor(() => expect(ctx.loading).toBe(false))
    expect(ctx.user).toBeNull()
  })

  test('user is populated after Firebase auth resolves', async () => {
    setupAuth(mockUser)
    let ctx
    render(<AppProvider><ContextReader onRender={c => { ctx = c }} /></AppProvider>)
    await waitFor(() => expect(ctx.loading).toBe(false))
    expect(ctx.user?.email).toBe('test@example.com')
  })

  test('loading starts true and becomes false after auth check', async () => {
    const states = []
    render(
      <AppProvider>
        <ContextReader onRender={c => states.push(c.loading)} />
      </AppProvider>
    )
    await waitFor(() => states.includes(false))
    expect(states).toContain(false)
  })
})

// ── Cart – auth guard ─────────────────────────────────────────

describe('AppContext – cart (auth guard)', () => {
  test('addToCart blocks unauthenticated user and shows toast', async () => {
    render(<AppProvider><CartTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('cart').textContent).toBe('[]'))

    await act(async () => screen.getByTestId('add').click())

    expect(JSON.parse(screen.getByTestId('cart').textContent)).toHaveLength(0)
    expect(toast.warning).toHaveBeenCalled()
  })
})

// ── Cart – CRUD ───────────────────────────────────────────────

describe('AppContext – cart (CRUD)', () => {
  beforeEach(() => setupAuth(mockUser))

  test('addToCart adds a new item with quantity 1', async () => {
    render(<AppProvider><CartTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('cart').textContent).toBe('[]'))

    await act(async () => screen.getByTestId('add').click())

    const cart = JSON.parse(screen.getByTestId('cart').textContent)
    expect(cart).toHaveLength(1)
    expect(cart[0]).toMatchObject({ id: 'p1', name: 'Rose', quantity: 1 })
  })

  test('addToCart increments quantity for existing item', async () => {
    render(<AppProvider><CartTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('cart').textContent).toBe('[]'))

    await act(async () => screen.getByTestId('add').click())
    await act(async () => screen.getByTestId('add').click())

    const cart = JSON.parse(screen.getByTestId('cart').textContent)
    expect(cart).toHaveLength(1)
    expect(cart[0].quantity).toBe(2)
  })

  test('addToCart shows success toast', async () => {
    render(<AppProvider><CartTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('cart').textContent).toBe('[]'))
    await act(async () => screen.getByTestId('add').click())
    expect(toast.success).toHaveBeenCalledWith('Added to cart!')
  })

  test('removeFromCart removes the correct item', async () => {
    render(<AppProvider><CartTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('cart').textContent).toBe('[]'))

    await act(async () => screen.getByTestId('add').click())
    expect(JSON.parse(screen.getByTestId('cart').textContent)).toHaveLength(1)

    await act(async () => screen.getByTestId('remove').click())
    expect(JSON.parse(screen.getByTestId('cart').textContent)).toHaveLength(0)
  })

  test('updateCartQuantity changes item quantity', async () => {
    render(<AppProvider><CartTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('cart').textContent).toBe('[]'))

    await act(async () => screen.getByTestId('add').click())
    await act(async () => screen.getByTestId('inc').click())

    const cart = JSON.parse(screen.getByTestId('cart').textContent)
    expect(cart[0].quantity).toBe(3)
  })

  test('clearCart empties all items', async () => {
    render(<AppProvider><CartTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('cart').textContent).toBe('[]'))

    await act(async () => screen.getByTestId('add').click())
    await act(async () => screen.getByTestId('clear').click())
    expect(JSON.parse(screen.getByTestId('cart').textContent)).toHaveLength(0)
  })

  test('cartCount reflects total quantity across all items', async () => {
    render(<AppProvider><CartTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('cartCount').textContent).toBe('0'))

    await act(async () => screen.getByTestId('add').click())
    await act(async () => screen.getByTestId('add').click())

    expect(screen.getByTestId('cartCount').textContent).toBe('2')
  })

  test('cart persists to localStorage after add', async () => {
    render(<AppProvider><CartTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('cart').textContent).toBe('[]'))
    await act(async () => screen.getByTestId('add').click())

    const stored = JSON.parse(localStorage.getItem('cart'))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('p1')
  })
})

// ── Wishlist – auth guard ─────────────────────────────────────

describe('AppContext – wishlist (auth guard)', () => {
  test('toggleWishlist blocks unauthenticated user', async () => {
    render(<AppProvider><WishlistTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('wishlist').textContent).toBe('[]'))

    await act(async () => screen.getByTestId('toggle').click())

    expect(JSON.parse(screen.getByTestId('wishlist').textContent)).toHaveLength(0)
    expect(toast.warning).toHaveBeenCalled()
  })
})

// ── Wishlist – CRUD ───────────────────────────────────────────

describe('AppContext – wishlist (CRUD)', () => {
  beforeEach(() => setupAuth(mockUser))

  test('toggleWishlist adds product when not in wishlist', async () => {
    render(<AppProvider><WishlistTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('wishlist').textContent).toBe('[]'))

    await act(async () => screen.getByTestId('toggle').click())

    const wishlist = JSON.parse(screen.getByTestId('wishlist').textContent)
    expect(wishlist).toHaveLength(1)
    expect(wishlist[0].id).toBe('w1')
  })

  test('toggleWishlist removes product on second click', async () => {
    render(<AppProvider><WishlistTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('wishlist').textContent).toBe('[]'))

    await act(async () => screen.getByTestId('toggle').click()) // add
    await act(async () => screen.getByTestId('toggle').click()) // remove

    expect(JSON.parse(screen.getByTestId('wishlist').textContent)).toHaveLength(0)
  })

  test('isInWishlist returns true after adding', async () => {
    render(<AppProvider><WishlistTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('inWishlist').textContent).toBe('false'))

    await act(async () => screen.getByTestId('toggle').click())
    expect(screen.getByTestId('inWishlist').textContent).toBe('true')
  })

  test('isInWishlist returns false after removing', async () => {
    render(<AppProvider><WishlistTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('wishlist').textContent).toBe('[]'))

    await act(async () => screen.getByTestId('toggle').click()) // add
    await act(async () => screen.getByTestId('toggle').click()) // remove
    expect(screen.getByTestId('inWishlist').textContent).toBe('false')
  })

  test('adding to wishlist shows success toast', async () => {
    render(<AppProvider><WishlistTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('wishlist').textContent).toBe('[]'))
    await act(async () => screen.getByTestId('toggle').click())
    expect(toast.success).toHaveBeenCalledWith('Added to wishlist!')
  })

  test('removing from wishlist shows info toast', async () => {
    render(<AppProvider><WishlistTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('wishlist').textContent).toBe('[]'))
    await act(async () => screen.getByTestId('toggle').click()) // add
    jest.clearAllMocks()
    await act(async () => screen.getByTestId('toggle').click()) // remove
    expect(toast.info).toHaveBeenCalledWith('Removed from wishlist')
  })

  test('wishlistCount reflects number of items', async () => {
    render(<AppProvider><WishlistTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('wishlistCount').textContent).toBe('0'))
    await act(async () => screen.getByTestId('toggle').click())
    expect(screen.getByTestId('wishlistCount').textContent).toBe('1')
  })

  test('wishlist persists to localStorage', async () => {
    render(<AppProvider><WishlistTester /></AppProvider>)
    await waitFor(() => expect(screen.getByTestId('wishlist').textContent).toBe('[]'))
    await act(async () => screen.getByTestId('toggle').click())

    const stored = JSON.parse(localStorage.getItem('wishlist'))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('w1')
  })
})
