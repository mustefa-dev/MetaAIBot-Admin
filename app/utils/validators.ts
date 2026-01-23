// Validation Functions

/**
 * Check if value is required (not empty)
 */
export function required(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validate email format
 */
export function email(value: string): boolean {
  if (!value) return true // Use required() for required check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

/**
 * Validate minimum length
 */
export function minLength(value: string, min: number): boolean {
  if (!value) return true
  return value.length >= min
}

/**
 * Validate maximum length
 */
export function maxLength(value: string, max: number): boolean {
  if (!value) return true
  return value.length <= max
}

/**
 * Validate numeric value
 */
export function numeric(value: string): boolean {
  if (!value) return true
  return /^\d+$/.test(value)
}

/**
 * Validate decimal/float value
 */
export function decimal(value: string): boolean {
  if (!value) return true
  return /^\d*\.?\d+$/.test(value)
}

/**
 * Validate alphanumeric
 */
export function alphanumeric(value: string): boolean {
  if (!value) return true
  return /^[a-zA-Z0-9]+$/.test(value)
}

/**
 * Validate URL
 */
export function url(value: string): boolean {
  if (!value) return true
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/**
 * Validate Iraqi phone number
 */
export function phone(value: string): boolean {
  if (!value) return true
  const cleaned = value.replace(/\D/g, '')
  return /^07[3-9]\d{8}$/.test(cleaned)
}

/**
 * Validate password strength
 */
export function password(value: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!value) {
    return { valid: false, errors: ['Password is required'] }
  }

  if (value.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  if (!/[A-Z]/.test(value)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(value)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(value)) {
    errors.push('Password must contain at least one number')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate date
 */
export function date(value: string): boolean {
  if (!value) return true
  const d = new Date(value)
  return !isNaN(d.getTime())
}

/**
 * Validate date is in the past
 */
export function pastDate(value: string): boolean {
  if (!value) return true
  const d = new Date(value)
  return d < new Date()
}

/**
 * Validate date is in the future
 */
export function futureDate(value: string): boolean {
  if (!value) return true
  const d = new Date(value)
  return d > new Date()
}

/**
 * Validate minimum value
 */
export function min(value: number, minValue: number): boolean {
  if (value === null || value === undefined) return true
  return value >= minValue
}

/**
 * Validate maximum value
 */
export function max(value: number, maxValue: number): boolean {
  if (value === null || value === undefined) return true
  return value <= maxValue
}

/**
 * Validate value is between range
 */
export function between(value: number, minValue: number, maxValue: number): boolean {
  if (value === null || value === undefined) return true
  return value >= minValue && value <= maxValue
}

/**
 * Validate file size
 */
export function fileSize(file: File, maxBytes: number): boolean {
  return file.size <= maxBytes
}

/**
 * Validate file type
 */
export function fileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      // Match category (e.g., image/*)
      const category = type.replace('/*', '')
      return file.type.startsWith(category)
    }
    return file.type === type
  })
}

/**
 * Validate product code format
 */
export function productCode(value: string): boolean {
  if (!value) return true
  // Alphanumeric, 2-10 characters
  return /^[a-zA-Z0-9]{2,10}$/.test(value)
}

/**
 * Validate order number format
 */
export function orderNumber(value: string): boolean {
  if (!value) return true
  // Format: ORD-YYYY-XXXX
  return /^ORD-\d{4}-\d{4,}$/.test(value)
}

// Type for validation rule
export type ValidationRule = {
  validator: (value: unknown, ...args: unknown[]) => boolean
  message: string
  args?: unknown[]
}

// Type for validation result
export type ValidationResult = {
  valid: boolean
  errors: Record<string, string[]>
}

/**
 * Validate multiple fields with rules
 */
export function validate(
  data: Record<string, unknown>,
  rules: Record<string, ValidationRule[]>
): ValidationResult {
  const errors: Record<string, string[]> = {}
  let valid = true

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]
    const fieldErrors: string[] = []

    for (const rule of fieldRules) {
      const args = rule.args || []
      if (!rule.validator(value, ...args)) {
        fieldErrors.push(rule.message)
        valid = false
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }

  return { valid, errors }
}

/**
 * Create a validation rule
 */
export function createRule(
  validator: (value: unknown, ...args: unknown[]) => boolean,
  message: string,
  args?: unknown[]
): ValidationRule {
  return { validator, message, args }
}

// Pre-built rules for convenience
export const rules = {
  required: (message = 'This field is required') =>
    createRule(required, message),

  email: (message = 'Invalid email address') =>
    createRule(email as (v: unknown) => boolean, message),

  minLength: (min: number, message = `Must be at least ${min} characters`) =>
    createRule(minLength as (v: unknown, ...args: unknown[]) => boolean, message, [min]),

  maxLength: (max: number, message = `Must not exceed ${max} characters`) =>
    createRule(maxLength as (v: unknown, ...args: unknown[]) => boolean, message, [max]),

  numeric: (message = 'Must be a number') =>
    createRule(numeric as (v: unknown) => boolean, message),

  phone: (message = 'Invalid phone number') =>
    createRule(phone as (v: unknown) => boolean, message),

  url: (message = 'Invalid URL') =>
    createRule(url as (v: unknown) => boolean, message),

  min: (minValue: number, message = `Must be at least ${minValue}`) =>
    createRule(min as (v: unknown, ...args: unknown[]) => boolean, message, [minValue]),

  max: (maxValue: number, message = `Must not exceed ${maxValue}`) =>
    createRule(max as (v: unknown, ...args: unknown[]) => boolean, message, [maxValue])
}
