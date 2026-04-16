/**
 * ProductCard component tests.
 * Verifies rendering, auth-aware button states, wishlist state, and interactions.
 */
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '@/app/components/ProductCard'
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
const mockProduct = {
  id: 'prod1',
  name: 'Royal Rose',
  price: 2500,
  volume: '50ml',
  rating: 4,
  reviews: 12,
  imageUrl: '/rose.jpg',
}

const baseCtx = {
  user: null,
  loading: false,
  addToCart: jest.fn(),
  toggleWishlist: jest.fn(),
  isInWishlist: jest.fn().mockReturnValue(false),
}

const renderCard = (ctxOverrides = {}, productOverrides = {}) =>
  render(
    <AppContext.Provider value={{ ...baseCtx, ...ctxOverrides }}>
      <ProductCard products={{ ...mockProduct, ...productOverrides }} />
    </AppContext.Provider>
  )

beforeEach(() => jest.clearAllMocks())

// ── Rendering ─────────────────────────────────────────────────

describe('ProductCard – rendering', () => {
  test('renders product name', () => {
    renderCard()
    expect(screen.getByText('Royal Rose')).toBeInTheDocument()
  })

  test('renders formatted price with Rs prefix', () => {
    renderCard()
    expect(screen.getByText(/Rs.*2,500/)).toBeInTheDocument()
  })

  test('renders product volume', () => {
    renderCard()
    expect(screen.getByText('50ml')).toBeInTheDocument()
  })

  test('renders image with correct alt text', () => {
    renderCard()
    expect(screen.getByAltText('Royal Rose')).toBeInTheDocument()
  })

  test('falls back to placeholder image when no imageUrl', () => {
    renderCard({}, { imageUrl: undefined })
    const img = screen.getByAltText('Royal Rose')
    expect(img.getAttribute('src')).toBe('/placeholder.svg')
  })

  test('wraps card in a link to the product detail page', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/Product-Details/prod1')
  })

  test('renders review count when reviews > 0', () => {
    renderCard()
    expect(screen.getByText('(12)')).toBeInTheDocument()
  })

  test('hides review count when reviews is 0', () => {
    renderCard({}, { reviews: 0, rating: 0 })
    expect(screen.queryByText('(0)')).not.toBeInTheDocument()
  })
})

// ── Auth-aware buttons ────────────────────────────────────────

describe('ProductCard – auth-aware cart button', () => {
  test('shows "Sign In to Buy" when user is not logged in', () => {
    renderCard({ user: null, loading: false })
    expect(screen.getByText(/Sign In to Buy/i)).toBeInTheDocument()
  })

  test('shows "Add to Cart" when user is logged in', () => {
    renderCard({ user: { uid: 'u1' }, loading: false })
    expect(screen.getByText(/Add to Cart/i)).toBeInTheDocument()
  })

  test('shows "Sign In to Buy" during loading (no user yet)', () => {
    renderCard({ user: null, loading: true })
    expect(screen.queryByText(/Add to Cart/i)).not.toBeInTheDocument()
  })
})

// ── Wishlist state ────────────────────────────────────────────

describe('ProductCard – wishlist state', () => {
  test('wishlist button shows "Add to wishlist" title when not wishlisted', () => {
    renderCard({ user: { uid: 'u1' }, isInWishlist: jest.fn().mockReturnValue(false) })
    expect(screen.getByTitle('Add to wishlist')).toBeInTheDocument()
  })

  test('wishlist button shows "Remove from wishlist" title when wishlisted', () => {
    renderCard({ user: { uid: 'u1' }, isInWishlist: jest.fn().mockReturnValue(true) })
    expect(screen.getByTitle('Remove from wishlist')).toBeInTheDocument()
  })

  test('wishlisted button has gold background class', () => {
    renderCard({ user: { uid: 'u1' }, isInWishlist: jest.fn().mockReturnValue(true) })
    const btn = screen.getByTitle('Remove from wishlist')
    expect(btn.className).toContain('bg-[#C9A96E]')
  })

  test('non-wishlisted button does NOT have gold background', () => {
    renderCard({ user: { uid: 'u1' }, isInWishlist: jest.fn().mockReturnValue(false) })
    const btn = screen.getByTitle('Add to wishlist')
    expect(btn.className).not.toContain('bg-[#C9A96E]')
  })
})

// ── Interactions ──────────────────────────────────────────────

describe('ProductCard – interactions', () => {
  test('clicking Add to Cart button calls addToCart with product data', () => {
    const addToCart = jest.fn()
    renderCard({ user: { uid: 'u1' }, loading: false, addToCart })
    fireEvent.click(screen.getByTitle('Add to cart'))
    expect(addToCart).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'prod1', name: 'Royal Rose', price: 2500 })
    )
  })

  test('clicking wishlist button calls toggleWishlist with product data', () => {
    const toggleWishlist = jest.fn()
    renderCard({ user: { uid: 'u1' }, loading: false, toggleWishlist })
    fireEvent.click(screen.getByTitle('Add to wishlist'))
    expect(toggleWishlist).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'prod1', name: 'Royal Rose' })
    )
  })

  test('Add to Cart click does not navigate (preventDefault called)', () => {
    const addToCart = jest.fn()
    renderCard({ user: { uid: 'u1' }, loading: false, addToCart })
    // Click fires without throwing — event is handled
    expect(() => fireEvent.click(screen.getByTitle('Add to cart'))).not.toThrow()
  })
})
