"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/trpc/react"

export default function FaqForm() {
  const toast = useToast()
  const router = useRouter()
  const utils = api.useUtils()

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const MIN_LENGTH = 10

  const { mutate: createFaq, isPending: isCreating } = api.faq.create.useMutation({
    onSuccess: async () => {
      toast.success("تم إضافة السؤال بنجاح")
      setQuestion("")
      setAnswer("")
      await utils.faq.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ ما")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim() || !answer.trim()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة")
      return
    }

    createFaq({ question: question.trim(), answer: answer.trim() })
  }

  return (
    <form dir="rtl" onSubmit={handleSubmit} className="mb-10">
      <div className="flex items-center justify-center">
        <div className="mx-3 w-full md:w-2/3">
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block font-bold text-gray-500 md:mb-0 md:text-right">
                السؤال
              </label>
            </div>
            <div className="md:w-2/3">
              <Input
                type="text"
                className="w-full rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="أدخل السؤال"
                required
              />
            </div>
          </div>

          <div className="mb-6 md:flex md:items-start">
            <div className="md:w-1/3">
              <label className="mb-1 block font-bold text-gray-500 md:mb-0 md:text-right">
                الإجابة
              </label>
            </div>
            <div className="md:w-2/3">
              <Textarea
                className="max-h-96 min-h-48 w-full rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-loose text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                rows={4}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="أدخل الإجابة"
                required
              />
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3" />
            <div className="md:w-2/3">
              <Button
                type="submit"
                disabled={
                  isCreating ||
                  question.trim().length < MIN_LENGTH ||
                  answer.trim().length < MIN_LENGTH
                }
                className="cursor-pointer"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  "إضافة"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
