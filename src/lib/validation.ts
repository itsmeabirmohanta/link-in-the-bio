export interface PasswordStrength {
  isValid: boolean;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  score: number;
}

export function validatePassword(password: string): PasswordStrength {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= minLength;

  // Calculate score (0-100)
  let score = 0;
  if (hasMinLength) score += 20;
  if (hasUpperCase) score += 20;
  if (hasLowerCase) score += 20;
  if (hasNumber) score += 20;
  if (hasSpecialChar) score += 20;

  return {
    isValid: score >= 60, // Requires at least 3 criteria
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    score
  };
} 