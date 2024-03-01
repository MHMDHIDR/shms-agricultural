import { useLayoutEffect } from 'react'
import { APP_TITLE } from '@/data/constants'

const useDocumentTitle = (title: string) => {
  useLayoutEffect(() => {
    document.title = title + ` | ${APP_TITLE}`
  })
}

export default useDocumentTitle
