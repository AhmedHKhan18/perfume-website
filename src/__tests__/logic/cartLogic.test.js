/**
 * Pure cart calculation logic — mirrors Cart/page.js constants & formulas.
 * These tests verify pricing accuracy with no React rendering.
 */

const COUPONS = { WELCOME20: 20, SAVE10: 10, ASFF15: 15 }
const SHIPPING_THRESHOLD = 2000
const SHIPPING_FEE = 200

function calcSubtotal(cart) {
  return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
}

function calcShipping(subtotal) {
  return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}

function calcDiscount(subtotal, coupon) {
  if (!coupon || !COUPONS[coupon]) return 0
  return Math.round((subtotal * COUPONS[coupon]) / 100)
}

function calcTotal(subtotal, shipping, discount) {
  return subtotal + shipping - discount
}

function validateCoupon(code) {
  const upper = code.trim().toUpperCase()
  if (COUPONS[upper]) return { valid: true, code: upper, percent: COUPONS[upper] }
  return { valid: false, error: 'Invalid coupon code.' }
}

// ─── Subtotal ────────────────────────────────────────────────

describe('Cart – Subtotal calculation', () => {
  test('empty cart returns 0', () => {
    expect(calcSubtotal([])).toBe(0)
  })

  test('single item: price × quantity', () => {
    expect(calcSubtotal([{ price: '500', quantity: 2 }])).toBe(1000)
  })

  test('multiple items are summed correctly', () => {
    const cart = [
      { price: '1000', quantity: 1 },
      { price: '500',  quantity: 3 },
    ]
    expect(calcSubtotal(cart)).toBe(2500)
  })

  test('works with numeric price (not just strings)', () => {
    expect(calcSubtotal([{ price: 750, quantity: 4 }])).toBe(3000)
  })

  test('quantity of 1 returns item price', () => {
    expect(calcSubtotal([{ price: 1500, quantity: 1 }])).toBe(1500)
  })
})

// ─── Shipping ────────────────────────────────────────────────

describe('Cart – Shipping fee', () => {
  test('charges Rs 200 when subtotal is below threshold', () => {
    expect(calcShipping(1999)).toBe(SHIPPING_FEE)
  })

  test('free shipping at exactly Rs 2000 (threshold)', () => {
    expect(calcShipping(2000)).toBe(0)
  })

  test('free shipping above threshold', () => {
    expect(calcShipping(5000)).toBe(0)
  })

  test('charges shipping on empty cart (subtotal 0)', () => {
    expect(calcShipping(0)).toBe(SHIPPING_FEE)
  })

  test('just below threshold still has shipping fee', () => {
    expect(calcShipping(1999)).toBe(200)
  })
})

// ─── Coupon discount ─────────────────────────────────────────

describe('Cart – Discount calculation', () => {
  test('WELCOME20 gives 20% off', () => {
    expect(calcDiscount(1000, 'WELCOME20')).toBe(200)
  })

  test('SAVE10 gives 10% off', () => {
    expect(calcDiscount(1000, 'SAVE10')).toBe(100)
  })

  test('ASFF15 gives 15% off', () => {
    expect(calcDiscount(1000, 'ASFF15')).toBe(150)
  })

  test('no coupon (null) returns 0 discount', () => {
    expect(calcDiscount(1000, null)).toBe(0)
  })

  test('unknown coupon key returns 0 discount', () => {
    expect(calcDiscount(1000, 'FAKE50')).toBe(0)
  })

  test('discount rounds fractional paise to nearest integer', () => {
    // 10% of 333 = 33.3 → rounds to 33
    expect(calcDiscount(333, 'SAVE10')).toBe(33)
  })

  test('discount scales with subtotal', () => {
    expect(calcDiscount(2000, 'WELCOME20')).toBe(400)
  })
})

// ─── Total ───────────────────────────────────────────────────

describe('Cart – Total calculation', () => {
  test('total = subtotal + shipping (no coupon, below threshold)', () => {
    expect(calcTotal(1000, 200, 0)).toBe(1200)
  })

  test('total with free shipping (above threshold)', () => {
    expect(calcTotal(2000, 0, 0)).toBe(2000)
  })

  test('total with coupon discount applied', () => {
    // subtotal 1000, shipping 200, discount 100 (SAVE10)
    expect(calcTotal(1000, 200, 100)).toBe(1100)
  })

  test('total with free shipping AND coupon', () => {
    // subtotal 2000, shipping 0, discount 400 (WELCOME20)
    expect(calcTotal(2000, 0, 400)).toBe(1600)
  })

  test('full workflow: 2 items, SAVE10, below threshold', () => {
    const cart = [
      { price: 800, quantity: 1 },
      { price: 600, quantity: 1 },
    ]
    const subtotal = calcSubtotal(cart)       // 1400
    const shipping = calcShipping(subtotal)   // 200 (below 2000)
    const discount = calcDiscount(subtotal, 'SAVE10') // 140
    const total    = calcTotal(subtotal, shipping, discount)
    expect(subtotal).toBe(1400)
    expect(shipping).toBe(200)
    expect(discount).toBe(140)
    expect(total).toBe(1460)
  })

  test('full workflow: cart reaches free-shipping threshold with WELCOME20', () => {
    const cart = [{ price: 2500, quantity: 1 }]
    const subtotal = calcSubtotal(cart)         // 2500
    const shipping = calcShipping(subtotal)     // 0
    const discount = calcDiscount(subtotal, 'WELCOME20') // 500
    const total    = calcTotal(subtotal, shipping, discount)
    expect(total).toBe(2000)
  })
})

// ─── Coupon validation ────────────────────────────────────────

describe('Coupon code validation', () => {
  test('WELCOME20 is valid', () => {
    expect(validateCoupon('WELCOME20')).toEqual({ valid: true, code: 'WELCOME20', percent: 20 })
  })

  test('SAVE10 is valid', () => {
    expect(validateCoupon('SAVE10')).toEqual({ valid: true, code: 'SAVE10', percent: 10 })
  })

  test('ASFF15 is valid', () => {
    expect(validateCoupon('ASFF15')).toEqual({ valid: true, code: 'ASFF15', percent: 15 })
  })

  test('accepts lowercase input (case-insensitive)', () => {
    expect(validateCoupon('welcome20').valid).toBe(true)
    expect(validateCoupon('welcome20').code).toBe('WELCOME20')
  })

  test('accepts mixed-case input', () => {
    expect(validateCoupon('Save10').valid).toBe(true)
  })

  test('trims whitespace around code', () => {
    expect(validateCoupon('  ASFF15  ').valid).toBe(true)
  })

  test('unknown code returns invalid with error message', () => {
    expect(validateCoupon('DISCOUNT50')).toEqual({ valid: false, error: 'Invalid coupon code.' })
  })

  test('empty string returns invalid', () => {
    expect(validateCoupon('')).toEqual({ valid: false, error: 'Invalid coupon code.' })
  })

  test('whitespace-only string returns invalid', () => {
    expect(validateCoupon('   ')).toEqual({ valid: false, error: 'Invalid coupon code.' })
  })
})
