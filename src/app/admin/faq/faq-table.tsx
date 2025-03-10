"use client"

import { Loader2, Pencil, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import NoRecords from "@/components/custom/no-records"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { scrollToView } from "@/lib/scroll-to-view"
import { api } from "@/trpc/react"
import type { Faq } from "@prisma/client"

export default function FaqTable({ initialFaqs }: { initialFaqs: Faq[] }) {
  const toast = useToast()
  const router = useRouter()
  const utils = api.useUtils()

  // const [faqs, setFaqs] = useState(initialFaqs);
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedQuestion, setEditedQuestion] = useState("")
  const [editedAnswer, setEditedAnswer] = useState("")
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>(null)
  const questionInputRef = useRef<HTMLInputElement>(null)

  const { mutate: updateFaq, isPending: isUpdating } = api.faq.update.useMutation({
    onSuccess: async () => {
      toast.success("تم تحديث السؤال بنجاح")
      setEditingId(null)
      await utils.faq.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ ما")
    },
  })

  const { mutate: deleteFaq, isPending: isDeleting } = api.faq.delete.useMutation({
    onSuccess: async () => {
      toast.success("تم حذف السؤال بنجاح")
      setSelectedFaqId(null)
      await utils.faq.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ ما")
      setSelectedFaqId(null)
    },
  })

  const handleEdit = (faq: Faq) => {
    setEditingId(faq.id)
    setEditedQuestion(faq.question)
    setEditedAnswer(faq.answer)
  }

  const handleSave = (id: string) => {
    if (!editedQuestion.trim() || !editedAnswer.trim()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة")
      return
    }

    updateFaq({
      id,
      question: editedQuestion.trim(),
      answer: editedAnswer.trim(),
    })
  }

  const handleDelete = (id: string) => {
    setSelectedFaqId(id)
    deleteFaq({ id })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditedQuestion("")
    setEditedAnswer("")
  }

  return (
    <Table className="rtl mt-8 table min-h-full min-w-full divide-y divide-gray-200">
      <TableHeader>
        <TableRow>
          <TableHead className="text-right font-bold">السؤال</TableHead>
          <TableHead className="text-right font-bold">الإجابة</TableHead>
          <TableHead className="text-center font-bold">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!initialFaqs ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-gray-500">
              <NoRecords
                msg="لا توجد أسئلة شائعة"
                button={
                  <Button
                    variant={"pressable"}
                    onClick={() => {
                      questionInputRef.current?.focus()
                      scrollToView(100)
                    }}
                  >
                    إضافة سؤال جديد
                  </Button>
                }
              />
            </TableCell>
          </TableRow>
        ) : (
          initialFaqs.map(faq => (
            <TableRow key={faq.id}>
              <TableCell className="min-w-[200px] align-top">
                {editingId === faq.id ? (
                  <Input
                    id="question"
                    type="text"
                    className="w-full rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                    value={editedQuestion}
                    onChange={e => setEditedQuestion(e.target.value)}
                  />
                ) : (
                  faq.question
                )}
              </TableCell>
              <TableCell className="min-w-[300px] align-top">
                {editingId === faq.id ? (
                  <Textarea
                    className="max-h-72 w-full rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-loose text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                    rows={7}
                    value={editedAnswer}
                    onChange={e => setEditedAnswer(e.target.value)}
                  />
                ) : (
                  faq.answer
                )}
              </TableCell>
              <TableCell className="align-top">
                <div className="flex items-center justify-center gap-2">
                  {editingId === faq.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSave(faq.id)}
                        disabled={isUpdating}
                        className="cursor-pointer"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        className="cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(faq)}
                        className="cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting && selectedFaqId === faq.id}
                            onClick={() => setSelectedFaqId(faq.id)}
                            className="cursor-pointer"
                          >
                            {isDeleting && selectedFaqId === faq.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "حذف"
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader className="rtl:text-right">
                            <AlertDialogTitle>هل أنت متأكد من حذف هذا السؤال؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-2 rtl:justify-start!">
                            <AlertDialogCancel onClick={() => setSelectedFaqId(null)}>
                              الغاء
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(selectedFaqId!)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  جاري الحذف...
                                </>
                              ) : (
                                "حذف"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
