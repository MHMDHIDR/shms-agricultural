"use client"

import { FacebookIcon, InstagramIcon, Loader2, TwitterIcon, YoutubeIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/trpc/react"

const socialTypes = ["facebook", "x", "instagram", "youtube"] as const

export default function SocialLinksForm() {
  const toast = useToast()
  const router = useRouter()
  const utils = api.useUtils()

  const [selectedType, setSelectedType] = useState<(typeof socialTypes)[number] | "">("")
  const [socialLink, setSocialLink] = useState("")

  const { mutate: updateSocialLink, isPending: isUpdating } =
    api.socialLinks.insertSocialLinks.useMutation({
      onSuccess: async () => {
        toast.success("تم تحديث الرابط بنجاح")
        setSelectedType("")
        setSocialLink("")
        await utils.socialLinks.getSocialLinks.invalidate()
        router.refresh()
      },
      onError: error => {
        toast.error(error.message || "حدث خطأ ما")
      },
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedType || !socialLink) {
      toast.error("الرجاء اختيار النوع وإدخال الرابط")
      return
    }

    updateSocialLink({
      socialType: selectedType,
      socialLink: socialLink,
    })
  }

  return (
    <form dir="rtl" onSubmit={handleSubmit} className="mb-10">
      <div className="flex items-center justify-center">
        <div className="mx-3.5 md:mx-20 w-full">
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block font-bold text-gray-500 md:mb-0 md:text-right">
                نوع المنصة
              </label>
            </div>
            <div className="md:w-2/3">
              <Select
                dir="rtl"
                value={selectedType}
                onValueChange={(type: (typeof socialTypes)[number]) => setSelectedType(type)}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="اختر المنصة" />
                </SelectTrigger>
                <SelectContent>
                  {socialTypes.map(type => (
                    <SelectItem key={type} value={type} className="cursor-pointer">
                      <span className="flex items-center gap-x-2">
                        {type === "facebook" ? (
                          <FacebookIcon className="h-4 w-4 rounded-md" />
                        ) : type === "instagram" ? (
                          <InstagramIcon className="h-4 w-4 rounded-md" />
                        ) : type === "youtube" ? (
                          <YoutubeIcon className="h-4 w-4 rounded-md" />
                        ) : (
                          <TwitterIcon className="h-4 w-4 rounded-md" />
                        )}
                        {type}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block font-bold text-gray-500 md:mb-0 md:text-right">
                رابط المنصة
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full rounded border border-gray-200 bg-gray-200 px-4 py-2 text-lg leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                type="text"
                placeholder="ادخل رابط المنصة"
                value={socialLink}
                onChange={e => setSocialLink(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6 md:flex md:items-center">
            <Button
              type="submit"
              disabled={isUpdating || !selectedType || !socialLink}
              className="cursor-pointer"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="ml-2 animate-spin" />
                  جاري الحفظ ...
                </>
              ) : (
                "حفظ"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
