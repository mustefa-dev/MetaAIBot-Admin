// Form validation composable
type ValidationRule = (value: any) => string | true
type ValidationRules = Record<string, ValidationRule[]>

export function useFormValidation<T extends Record<string, any>>(
  form: T,
  rules: ValidationRules
) {
  const { t } = useI18n()
  const errors = reactive<Record<string, string>>({})
  const touched = reactive<Record<string, boolean>>({})

  // Built-in validators
  const validators = {
    required: (message?: string): ValidationRule => (value) => {
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        return message || t('validation.required')
      }
      return true
    },

    email: (message?: string): ValidationRule => (value) => {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? true : (message || t('validation.email'))
    },

    minLength: (min: number, message?: string): ValidationRule => (value) => {
      if (!value) return true
      return value.length >= min ? true : (message || t('validation.minLength', { min }))
    },

    maxLength: (max: number, message?: string): ValidationRule => (value) => {
      if (!value) return true
      return value.length <= max ? true : (message || t('validation.maxLength', { max }))
    },

    numeric: (message?: string): ValidationRule => (value) => {
      if (!value) return true
      return !isNaN(Number(value)) ? true : (message || t('validation.numeric'))
    },

    phone: (message?: string): ValidationRule => (value) => {
      if (!value) return true
      const phoneRegex = /^[\d\s\-+()]+$/
      return phoneRegex.test(value) ? true : (message || t('validation.phone'))
    },

    match: (fieldName: string, fieldValue: () => any, message?: string): ValidationRule => (value) => {
      if (!value) return true
      return value === fieldValue() ? true : (message || t('validation.passwordMismatch'))
    },

    min: (minValue: number, message?: string): ValidationRule => (value) => {
      if (value === null || value === undefined || value === '') return true
      return Number(value) >= minValue ? true : (message || `Must be at least ${minValue}`)
    },

    max: (maxValue: number, message?: string): ValidationRule => (value) => {
      if (value === null || value === undefined || value === '') return true
      return Number(value) <= maxValue ? true : (message || `Must be at most ${maxValue}`)
    }
  }

  // Validate a single field
  const validateField = (field: string): boolean => {
    const fieldRules = rules[field]
    if (!fieldRules) return true

    const value = (form as any)[field]

    for (const rule of fieldRules) {
      const result = rule(value)
      if (result !== true) {
        errors[field] = result
        return false
      }
    }

    delete errors[field]
    return true
  }

  // Validate all fields
  const validate = (): boolean => {
    let isValid = true

    for (const field of Object.keys(rules)) {
      touched[field] = true
      if (!validateField(field)) {
        isValid = false
      }
    }

    return isValid
  }

  // Mark field as touched and validate
  const touch = (field: string) => {
    touched[field] = true
    validateField(field)
  }

  // Reset validation state
  const reset = () => {
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])
  }

  // Check if form has any errors
  const hasErrors = computed(() => Object.keys(errors).length > 0)

  // Check if form is valid (all fields validated without errors)
  const isValid = computed(() => {
    for (const field of Object.keys(rules)) {
      const fieldRules = rules[field]
      const value = (form as any)[field]

      for (const rule of fieldRules) {
        if (rule(value) !== true) return false
      }
    }
    return true
  })

  return {
    errors: readonly(errors),
    touched: readonly(touched),
    hasErrors,
    isValid,
    validators,
    validate,
    validateField,
    touch,
    reset
  }
}
