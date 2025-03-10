import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Projects } from "@prisma/client"

type DepositDialogProps = {
  projects: Projects[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (projectId: string) => void
  title: string
  description: string
  confirmText: string
}

export function DepositDialog({
  projects,
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText,
}: DepositDialogProps) {
  const [selectedProject, setSelectedProject] = useState<string>("")

  const handleConfirm = () => {
    if (selectedProject) {
      onConfirm(selectedProject)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] select-none">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedProject} value={selectedProject}>
            <SelectTrigger className="rtl cursor-pointer">
              <SelectValue placeholder="اختر المشروع" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project: Projects) => (
                <SelectItem key={project.id} value={project.id} className="rtl cursor-pointer">
                  {project.projectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            variant="pressable"
            onClick={handleConfirm}
            disabled={!selectedProject}
            className="w-full"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
