import { cn } from '@/lib/utils'

export default function FormMessage({
  error,
  success,
  info,
  className = '',
  children
}: {
  /**
   * رسالة الخطأ باللون الأحمر
   */
  error?: boolean
  /**
   * رسالة الخطأ باللون الأخضر
   */
  success?: boolean
  /**
   * رسالة الخطأ باللون الأخضر
   */
  info?: boolean
  /**
   * الكلاسات الإضافية
   */
  className?: string
  /**
   * محتوى الرسالة
   */
  children: string
}) {
  return (
    <p
      className={cn(
        `text-center my-2 max-w-80 md:max-w-max animate-pulse text-sm ${
          error
            ? `text-red-600`
            : success
            ? `text-green-600`
            : info
            ? `text-blue-600`
            : ''
        }`,
        className
      )}
    >
      {children}
    </p>
  )
}
