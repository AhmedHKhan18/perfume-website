/**
 * Pure form validation logic — mirrors Sign-in/page.js and Cart/page.js.
 * No React rendering needed; tests the validation rules in isolation.
 */

// ── Sign-in / Sign-up validation (from Sign-in/page.js) ──────
function validateAuthForm(form, type) {
  const e = {}
  if (type === 'signup' && !form.name?.trim())  e.name     = 'Name is required'
  if (!form.email?.trim())                       e.email    = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
  if (!form.password)                            e.password = 'Password is required'
  else if (form.password.length < 6)             e.password = 'Minimum 6 characters'
  return e
}

// ── Checkout form validation (from Cart/page.js) ─────────────
function validateCheckoutForm(form) {
  const errors = {}
  if (!form.name?.trim())    errors.name    = 'Full name is required'
  if (!form.phone?.trim())   errors.phone   = 'Phone number is required'
  if (!form.address?.trim()) errors.address = 'Address is required'
  if (!form.city?.trim())    errors.city    = 'City is required'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email'
  }
  return errors
}

// ─── Sign-in validation ───────────────────────────────────────

describe('Sign-in form validation', () => {
  test('passes with valid email and password', () => {
    const errs = validateAuthForm({ email: 'user@test.com', password: 'secret123' }, 'signin')
    expect(errs).toEqual({})
  })

  test('fails when email is empty', () => {
    const errs = validateAuthForm({ email: '', password: 'pass123' }, 'signin')
    expect(errs.email).toBe('Email is required')
  })

  test('fails when email is whitespace only', () => {
    const errs = validateAuthForm({ email: '   ', password: 'pass123' }, 'signin')
    expect(errs.email).toBe('Email is required')
  })

  test('fails with invalid email — missing @', () => {
    const errs = validateAuthForm({ email: 'notanemail', password: 'pass123' }, 'signin')
    expect(errs.email).toBe('Invalid email')
  })

  test('fails with invalid email — missing domain', () => {
    const errs = validateAuthForm({ email: 'user@', password: 'pass123' }, 'signin')
    expect(errs.email).toBe('Invalid email')
  })

  test('fails with invalid email — missing TLD', () => {
    const errs = validateAuthForm({ email: 'user@domain', password: 'pass123' }, 'signin')
    expect(errs.email).toBe('Invalid email')
  })

  test('passes with valid email formats', () => {
    const emails = ['ali@gmail.com', 'user.name+tag@domain.co.uk', 'test123@subdomain.org']
    emails.forEach(email => {
      const errs = validateAuthForm({ email, password: 'pass123' }, 'signin')
      expect(errs.email).toBeUndefined()
    })
  })

  test('fails when password is empty', () => {
    const errs = validateAuthForm({ email: 'user@test.com', password: '' }, 'signin')
    expect(errs.password).toBe('Password is required')
  })

  test('fails when password is shorter than 6 chars', () => {
    const errs = validateAuthForm({ email: 'user@test.com', password: 'abc' }, 'signin')
    expect(errs.password).toBe('Minimum 6 characters')
  })

  test('exactly 6 char password passes', () => {
    const errs = validateAuthForm({ email: 'user@test.com', password: 'abc123' }, 'signin')
    expect(errs.password).toBeUndefined()
  })

  test('returns multiple errors when both fields are invalid', () => {
    const errs = validateAuthForm({ email: '', password: '' }, 'signin')
    expect(Object.keys(errs)).toHaveLength(2)
  })

  test('does NOT require name in sign-in mode', () => {
    const errs = validateAuthForm({ email: 'user@test.com', password: 'pass123' }, 'signin')
    expect(errs.name).toBeUndefined()
  })
})

// ─── Sign-up validation ───────────────────────────────────────

describe('Sign-up form validation', () => {
  const valid = { name: 'Ali Khan', email: 'ali@test.com', password: 'pass123' }

  test('passes with all valid fields', () => {
    expect(validateAuthForm(valid, 'signup')).toEqual({})
  })

  test('fails when name is empty', () => {
    expect(validateAuthForm({ ...valid, name: '' }, 'signup').name).toBe('Name is required')
  })

  test('fails when name is whitespace only', () => {
    expect(validateAuthForm({ ...valid, name: '   ' }, 'signup').name).toBe('Name is required')
  })

  test('fails when email is invalid in sign-up mode', () => {
    expect(validateAuthForm({ ...valid, email: 'bad' }, 'signup').email).toBe('Invalid email')
  })

  test('fails when password too short in sign-up', () => {
    expect(validateAuthForm({ ...valid, password: '12' }, 'signup').password).toBe('Minimum 6 characters')
  })

  test('can return all three errors simultaneously', () => {
    const errs = validateAuthForm({ name: '', email: '', password: '' }, 'signup')
    expect(Object.keys(errs)).toHaveLength(3)
    expect(errs.name).toBeDefined()
    expect(errs.email).toBeDefined()
    expect(errs.password).toBeDefined()
  })
})

// ─── Checkout form validation ─────────────────────────────────

describe('Checkout form validation', () => {
  const valid = {
    name: 'Ali Khan',
    phone: '03001234567',
    address: '123 Main Street, Block 5',
    city: 'Karachi',
    email: '',
    notes: '',
  }

  test('passes with all required fields filled', () => {
    expect(validateCheckoutForm(valid)).toEqual({})
  })

  test('fails when name is missing', () => {
    expect(validateCheckoutForm({ ...valid, name: '' }).name).toBe('Full name is required')
  })

  test('fails when name is whitespace only', () => {
    expect(validateCheckoutForm({ ...valid, name: '   ' }).name).toBe('Full name is required')
  })

  test('fails when phone is missing', () => {
    expect(validateCheckoutForm({ ...valid, phone: '' }).phone).toBe('Phone number is required')
  })

  test('fails when address is missing', () => {
    expect(validateCheckoutForm({ ...valid, address: '' }).address).toBe('Address is required')
  })

  test('fails when city is missing', () => {
    expect(validateCheckoutForm({ ...valid, city: '' }).city).toBe('City is required')
  })

  test('email is optional — empty string passes', () => {
    expect(validateCheckoutForm({ ...valid, email: '' }).email).toBeUndefined()
  })

  test('validates email format if email is provided', () => {
    expect(validateCheckoutForm({ ...valid, email: 'not-an-email' }).email).toBe('Enter a valid email')
  })

  test('valid optional email passes', () => {
    expect(validateCheckoutForm({ ...valid, email: 'buyer@example.com' }).email).toBeUndefined()
  })

  test('notes field is always optional', () => {
    expect(validateCheckoutForm({ ...valid, notes: '' }).notes).toBeUndefined()
  })

  test('returns all 4 required-field errors when form is completely empty', () => {
    const errs = validateCheckoutForm({ name: '', phone: '', address: '', city: '', email: '' })
    expect(Object.keys(errs)).toHaveLength(4)
    expect(errs.name).toBeDefined()
    expect(errs.phone).toBeDefined()
    expect(errs.address).toBeDefined()
    expect(errs.city).toBeDefined()
  })
})
