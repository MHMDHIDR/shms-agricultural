'use server'

import axios from 'axios'
import { getAuth } from './auth'

/**
 * Custom method to send user feedback
 * @returns response data
 * @throws {Error} Error getting user session
 */
export const submitFeedback = async (formData: FormData) => {
  const { isAuth } = await getAuth()

  if (!isAuth) {
    throw new Error('Error getting user session. Please try again later.')
  }

  const feedbackData = {
    name: formData.get('name'),
    email: formData.get('email'),
    feedback: formData.get('feedback')
  }

  try {
    const response = await axios.post('https://projectplannerai.com/api/feedback', {
      projectId: 'j570e6arxv5pjg7gxgk4akkq356w9vsq',
      feedback: feedbackData.feedback,
      name: feedbackData.name,
      email: feedbackData.email,
      label: 'featureRequest'
    })

    return response.data
  } catch (error) {
    console.error(error)
    throw new Error(`Error sending user feedback: ${error} Please try again later.`)
  }
}
