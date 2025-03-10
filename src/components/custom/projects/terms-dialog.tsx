import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function TermsDialog({
  open,
  onOpenChange,
  terms,
  onAccept,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  terms: string
  onAccept: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>شروط المشروع</DialogTitle>
          <DialogDescription>الرجاء قراءة الشروط بعناية قبل الموافقة</DialogDescription>
        </DialogHeader>

        <div className="h-[60vh] w-full overflow-auto rounded-md border p-4">
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: terms }}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              onAccept()
              onOpenChange(false)
            }}
            className="w-32"
          >
            موافق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
