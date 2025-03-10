/**
 * Calculate the strength of a password based on a set of rules
 * @param password The password to calculate the strength of
 * @returns A number between 0 and 100 representing the strength of the password
 */
export function calculatePasswordStrength(password: string) {
  let strength = 0

  if (password.length >= 8) strength += 20
  if (/[A-Z]/.exec(password)) strength += 20
  if (/[a-z]/.exec(password)) strength += 20
  if (/[0-9]/.exec(password)) strength += 20
  if (/[^A-Za-z0-9]/.exec(password)) strength += 20

  return strength
}
