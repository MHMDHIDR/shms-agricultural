'use client'

import { createContext, useEffect, useState } from 'react'
import type { FileUploadProps } from '@/types'

export const FileUploadContext = createContext({} as FileUploadProps)

export const FileUploadProvider = ({ children }: { children: React.ReactNode }) => {
  const [file, setFile] = useState<File[]>([])
  const [fileURLs, setFileURLs] = useState<any>([])

  const onFileAdd = (e: { target: { files: any } }) => {
    setFile(file => [...file, ...e.target.files])
  }

  const onFileRemove = (fileUrl: string, fileName: string) => {
    setFileURLs(fileURLs.filter((url: string) => url !== fileUrl))
    setFile(file.filter(file => file.name !== fileName))
  }

  useEffect(() => {
    if (file.length < 1) return

    const newFileUrls: string[] = []
    file.forEach(file => {
      if (Math.ceil(file.size / 1000000) < 2) {
        newFileUrls.push(URL.createObjectURL(file))
      }
      setFileURLs(newFileUrls)
    })
  }, [file])

  return (
    <FileUploadContext.Provider
      value={{
        file,
        fileURLs,
        setFile,
        setFileURLs,
        onFileAdd,
        onFileRemove
      }}
    >
      {children}
    </FileUploadContext.Provider>
  )
}
