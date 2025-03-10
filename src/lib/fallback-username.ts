import type { User } from "@prisma/client"

/**
 * This function takes a username and returns a fallback username
 * Which is the first letter of each word in the username
 * @param username
 * @returns
 */
export function fallbackUsername(username: User["name"]) {
  return username
    .split(" ")
    .map(name => name[0])
    .join("")
}

/**
 * This function takes a username and checks if it has more than 2 words containing max length of 15 characters,
 * then it returns the first 2 words with a max length of 15 characters, and removes the rest of the words
 */
export function truncateUsername(username: User["name"], words = 2, maxLength = 15) {
  return (username ?? "User").split(" ").slice(0, words).join(" ").slice(0, maxLength)
}
