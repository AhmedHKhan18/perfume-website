/**
 * Wishlist page component tests.
 * Verifies empty state, item rendering, and user interactions.
 */
import { render, screen, fireEvent } from '@testing-library/react'
import WishlistPage from '@/app/Wishlist/page'
import { AppContext } from '@/context/Appcontext'

// ── Module mocks ──────────────────────────────────────────────
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
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}))
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() },
  ToastContainer: () => null,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }) => <img src={src} alt={alt} />,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }) => <a href={href} {...rest}>{children}</a>,
}))

// ── Fixtures ──────────────────────────────────────────────────
const items = [
  { id: 'w1', name: 'Oud Royale',   price: 3500, volume: '50ml',  imageUrl: '/oud.jpg' },
  { id: 'w2', name: 'Rose Garden',  price: 1800, volume: '30ml',  imageUrl: '/rose.jpg' },
]

const baseCtx = {
  wishlist: items,
  toggleWishlist: jest.fn(),
  addToCart: jest.fn(),
  user: { uid: 'u1' },
  loading: false,
}

const renderWishlist = (ctxOverrides = {}) =>
  render(
    <AppContext.Provider value={{ ...baseCtx, ...ctxOverrides }}>
      <WishlistPage />
    </AppContext.Provider>
  )

beforeEach(() => jest.clearAllMocks())

// ── Empty state ───────────────────────────────────────────────

describe('Wishlist – empty state', () => {
  test('shows "Your wishlist is empty" heading', () => {
    renderWishlist({ wishlist: [] })
    expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument()
  })

  test('shows "Explore Perfumes" CTA link', () => {
    renderWishlist({ wishlist: [] })
    expect(screen.getByRole('link', { name: /explore perfumes/i })).toBeInTheDocument()
  })

  test('does NOT render item names when empty', () => {
    renderWishlist({ wishlist: [] })
    expect(screen.queryByText('Oud Royale')).not.toBeInTheDocument()
  })
})

// ── Item list ─────────────────────────────────────────────────

describe('Wishlist – item list', () => {
  test('renders all item names', () => {
    renderWishlist()
    expect(screen.getByText('Oud Royale')).toBeInTheDocument()
    expect(screen.getByText('Rose Garden')).toBeInTheDocument()
  })

  test('shows item count in header', () => {
    renderWishlist()
    expect(screen.getByText(/2 items/)).toBeInTheDocument()
  })

  test('shows singular "item" for single entry', () => {
    renderWishlist({ wishlist: [items[0]] })
    expect(screen.getByText(/1 item\b/)).toBeInTheDocument()
  })

  test('renders item prices', () => {
    renderWishlist()
    expect(screen.getByText(/Rs 3500/)).toBeInTheDocument()
    expect(screen.getByText(/Rs 1800/)).toBeInTheDocument()
  })

  test('renders item volumes', () => {
    renderWishlist()
    expect(screen.getByText('50ml')).toBeInTheDocument()
    expect(screen.getByText('30ml')).toBeInTheDocument()
  })

  test('renders an "Add to Cart" button per item', () => {
    renderWishlist()
    expect(screen.getAllByText('Add to Cart')).toHaveLength(2)
  })

  test('renders a remove (×) button per item', () => {
    renderWishlist()
    expect(screen.getAllByLabelText('Remove from wishlist')).toHaveLength(2)
  })
})

// ── Interactions ──────────────────────────────────────────────

describe('Wishlist – interactions', () => {
  test('clicking × calls toggleWishlist with the correct product', () => {
    const toggleWishlist = jest.fn()
    renderWishlist({ toggleWishlist })
    const [firstRemove] = screen.getAllByLabelText('Remove from wishlist')
    fireEvent.click(firstRemove)
    expect(toggleWishlist).toHaveBeenCalledWith(items[0])
  })

  test('clicking × on second item passes correct product', () => {
    const toggleWishlist = jest.fn()
    renderWishlist({ toggleWishlist })
    const removeButtons = screen.getAllByLabelText('Remove from wishlist')
    fireEvent.click(removeButtons[1])
    expect(toggleWishlist).toHaveBeenCalledWith(items[1])
  })

  test('clicking "Add to Cart" calls addToCart', () => {
    const addToCart = jest.fn()
    renderWishlist({ addToCart })
    fireEvent.click(screen.getAllByText('Add to Cart')[0])
    expect(addToCart).toHaveBeenCalled()
  })

  test('"Add to Cart" calls addToCart with normalised product fields', () => {
    const addToCart = jest.fn()
    renderWishlist({ addToCart })
    fireEvent.click(screen.getAllByText('Add to Cart')[0])
    expect(addToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'w1', name: 'Oud Royale', price: 3500 })
    )
  })

  test('"Add to Cart" also removes item from wishlist (move-to-cart)', () => {
    const addToCart = jest.fn()
    const toggleWishlist = jest.fn()
    renderWishlist({ addToCart, toggleWishlist })
    fireEvent.click(screen.getAllByText('Add to Cart')[0])
    expect(addToCart).toHaveBeenCalled()
    expect(toggleWishlist).toHaveBeenCalled()
  })
})
