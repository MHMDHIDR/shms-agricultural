"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/trpc/react"

type DeleteSocialLinkProps = {
  link: {
    id: string
    socialType: string
  }
}

export default function DeleteSocialLink({ link }: DeleteSocialLinkProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const utils = api.useUtils()
  const router = useRouter()
  const toast = useToast()

  const { mutate: deleteSocialLink, isPending } = api.socialLinks.deleteSocialLinks.useMutation({
    onMutate: () => {
      setIsDeleting(true)
    },
    onSuccess: async () => {
      toast.success("تم حذف الرابط بنجاح")
      await utils.socialLinks.getSocialLinks.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ ما")
    },
    onSettled: () => {
      setIsDeleting(false)
      setIsOpen(false)
    },
  })

  const handleDelete = async () => {
    deleteSocialLink({ id: link.id })
  }

  return (
    <>
      <Button variant="destructive" className="cursor-pointer" onClick={() => setIsOpen(true)}>
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> حـــذف
          </>
        ) : (
          "حـــذف"
        )}
      </Button>

      <ConfirmationDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={`هل أنت متأكد من حذف رابط ${link.socialType}؟`}
        description="لا يمكن التراجع عن هذا الإجراء."
        buttonText={isDeleting ? "جاري الحذف..." : "حذف"}
        buttonClass="bg-destructive hover:bg-destructive/90"
        onConfirm={handleDelete}
      />
    </>
  )
}
