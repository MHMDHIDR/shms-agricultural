import { compare } from 'bcryptjs'
/**
 * Compare passwords using bcryptjs
 * @param userStoredPassword  The password stored in the database
 * @param userNewPassword The password entered by the user
 * @returns A boolean indicating whether the passwords match or not
 */
export const ComparePasswords = async (
  userStoredPassword: string,
  userNewPassword: string
) => {
  try {
    const isMatchingPasswords = await compare(userNewPassword, userStoredPassword)
    return isMatchingPasswords
  } catch (error) {
    throw new Error(`Error during Checking Passwords: ${error})`)
  }
}
