export const VALIDATION_CONSTANTS = {
  NAME_MIN_LENGTH: 4,
  NAME_MAX_LENGTH: 25,
  PASSWORD_MIN_LENGTH: 6,
  POST_TITLE_MIN_LENGTH: 4,
  POST_TITLE_MAX_LENGTH: 50,
} as const

export const validationRules = {
  required: true,
  length: (value: string) => {
    const normalized = value.trim().replace(/\s+/g, ' ')
    return (
      (normalized.length >= VALIDATION_CONSTANTS.NAME_MIN_LENGTH &&
        normalized.length <= VALIDATION_CONSTANTS.NAME_MAX_LENGTH) ||
      `Must be between ${VALIDATION_CONSTANTS.NAME_MIN_LENGTH} and ${VALIDATION_CONSTANTS.NAME_MAX_LENGTH} characters`
    )
  },
  onlyLettersAndSpaces: (value: string) => {
    return /^[A-Za-z\s]+$/.test(value) || 'Only letters and spaces are allowed'
  },
  firstLetterUppercase: (value: string) => {
    if (!value?.trim()) return true
    return (
      value.trim().charAt(0) === value.trim().charAt(0).toUpperCase() ||
      'First letter must be uppercase'
    )
  },
  email: (value: string) => {
    if (!value) return true
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(value) || 'Please enter a valid email address.'
  },
  password: {
    required: true,
    length: (value: string) => {
      if (!value) return true
      return (
        value.length >= VALIDATION_CONSTANTS.PASSWORD_MIN_LENGTH ||
        'Password must be at least 6 characters long.'
      )
    },
    lowercase: (value: string) => {
      if (!value) return true
      return /[a-z]/.test(value) || 'Password must contain at least one lowercase letter.'
    },
  },
  post: {
    title: {
      required: true,
      length: (value: string) => {
        const normalized = value.trim().replace(/\s+/g, ' ')
        return (
          (normalized.length >= VALIDATION_CONSTANTS.POST_TITLE_MIN_LENGTH &&
            normalized.length <= VALIDATION_CONSTANTS.POST_TITLE_MAX_LENGTH) ||
          `Title must be between ${VALIDATION_CONSTANTS.POST_TITLE_MIN_LENGTH} and ${VALIDATION_CONSTANTS.POST_TITLE_MAX_LENGTH} characters`
        )
      },
    },
    content: {
      required: true,
      length: (value: string) => {
        const normalized = value.trim().replace(/\s+/g, ' ')
        return (
          (normalized.length >= 20 && normalized.length <= 5000) ||
          'Content must be between 20 and 5000 characters'
        )
      },
    },
  },
}
