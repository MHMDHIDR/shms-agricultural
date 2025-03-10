"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import clsx from "clsx"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FileUpload } from "@/components/custom/file-upload"
import SelectCountry from "@/components/custom/select-country"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { fallbackUsername } from "@/lib/fallback-username"
import { optimizeImage } from "@/lib/optimize-image"
import { accountFormSchema } from "@/schemas/account"
import { api } from "@/trpc/react"
import type { AccountFormValues } from "@/schemas/account"
import type { User } from "@prisma/client"

export function AccountForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [files, setFiles] = useState<{
    image?: File[]
    doc?: File[]
  }>({})
  const [isEditingEnabled, setIsEditingEnabled] = useState(false)
  const { setTheme } = useTheme()
  const toast = useToast()
  const { data: session, update: updateSession } = useSession()
  const uploadFilesMutation = api.S3.uploadFiles.useMutation()
  const updateUserMutation = api.user.update.useMutation({
    onSuccess: async data => {
      if (data) {
        const updatedUser = {
          name: data.name ?? user.name,
          email: user.email,
          phone: data.phone,
          nationality: data.nationality,
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          theme: data.theme,
          image: data.image ?? form.getValues("image"),
          doc: data.doc ?? form.getValues("doc"),
        }
        form.reset(updatedUser)
        setTheme(data.theme ?? "light")
        await updateSession({
          ...session,
          user: { ...session?.user, name: data.name, image: data.image },
        })
        toast.success("تم تحديث البيانات بنجاح")
        setIsEditingEnabled(false)
      }
    },
    onError: error => {
      toast.error(`تعذر تحديث البيانات في الوقت الحالي! ${error.message}`)
    },
    onMutate: () => {
      toast.loading("جاري تحديث البيانات ...")
    },
  })

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      nationality: user.nationality,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      theme: user.theme,
      image: user.image ?? "",
      doc: user.doc ?? "",
    },
  })

  const handleFilesSelected = (selectedFiles: File[], type: "image" | "doc") => {
    if (type === "image" && selectedFiles.length > 0) {
      const previewUrl = URL.createObjectURL(selectedFiles[0] ?? new Blob())
      setImagePreview(previewUrl)
    }

    setFiles(prev => ({
      ...prev,
      [type]: selectedFiles,
    }))
  }

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const processAndUploadFile = async (file: File | undefined, type: "image" | "doc") => {
    if (!file) return null
    // 5MB for PDF, 10MB for image
    const MAX_SIZE = type === "doc" ? 5 * 1024 * 1024 : 10 * 1024 * 1024

    // Check file size for PDF (5MB limit)
    if (file.size > MAX_SIZE) {
      toast.error("حجم الملف يجب أن لا يتجاوز 5 ميجابايت")
      return null
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    let fileData
    if (type === "image") {
      const optimizedBase64 = await optimizeImage({
        base64,
        quality: 70,
      })
      fileData = [
        {
          name: file.name.replace(/\.[^.]+$/, ".webp"),
          type: "image/webp",
          size: optimizedBase64.length,
          lastModified: file.lastModified,
          base64: optimizedBase64,
        },
      ]
    } else {
      fileData = [
        {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          base64,
        },
      ]
    }

    const uploadedUrls = await uploadFilesMutation.mutateAsync({
      entityId: `user-${type}/${user.id}`,
      fileData,
    })
    return uploadedUrls[0]
  }

  async function onSubmit(values: AccountFormValues) {
    try {
      setIsLoading(true)
      let imageUrl = values.image
      let docUrl = values.doc

      if (files.image && files.image.length > 0) {
        const uploadedImageUrl = await processAndUploadFile(files.image[0], "image")
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl
        }
      }

      if (files.doc && files.doc.length > 0) {
        const uploadedDocUrl = await processAndUploadFile(files.doc[0], "doc")
        if (uploadedDocUrl) {
          docUrl = uploadedDocUrl
        }
      }

      await updateUserMutation.mutateAsync({
        id: user.id,
        ...values,
        image: imageUrl,
        doc: docUrl,
      })
    } catch (error) {
      console.error("Update error:", error)
      toast.error("حدث خطأ أثناء تحديث البيانات")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mb-8 flex items-center gap-x-6">
          <FormLabel
            htmlFor="fileUploadInput"
            className={clsx("group cursor-pointer", {
              "pointer-events-none opacity-50": !isEditingEnabled,
            })}
          >
            {(imagePreview ?? form.watch("image")) ? (
              <Image
                src={imagePreview ?? form.watch("image") ?? ""}
                alt={`Profile Image of ${user?.name}`}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover object-top shadow transition-all hover:opacity-80"
                onError={() => setImagePreview(null)}
              />
            ) : (
              <Avatar className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">
                <AvatarImage src={user.image!} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {fallbackUsername(user.name)}
                </AvatarFallback>
              </Avatar>
            )}
          </FormLabel>
          <FileUpload
            onFilesSelected={files => handleFilesSelected(files, "image")}
            accept={{ "image/*": [".jpeg", ".jpg", ".png", ".webp"] }}
            maxFiles={1}
            disabled={!isEditingEnabled}
            className="flex items-center gap-x-2 space-y-0"
            isPreviewHidden={true}
          />
        </div>

        <FormField
          control={form.control}
          name="doc"
          render={() => (
            <FormItem>
              <div className="flex gap-x-3 mb-4 items-center">
                <FormLabel>المستند الشخصي</FormLabel>
                {user.doc && (
                  <Link
                    href={user.doc}
                    target="_blank"
                    className="pressable text-xs"
                    rel="noopener noreferrer"
                  >
                    عرض المستند الحالي
                  </Link>
                )}
              </div>
              <FormControl>
                <div className="space-y-2">
                  <FileUpload
                    onFilesSelected={files => handleFilesSelected(files, "doc")}
                    accept={{
                      "application/pdf": [".pdf"],
                      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
                    }}
                    maxFiles={1}
                    disabled={!isEditingEnabled}
                  />
                </div>
              </FormControl>
              <FormDescription>يجب أن لا يتجاوز حجم الملف 5 ميجابايت</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الكامل</FormLabel>
              <FormControl>
                <Input
                  placeholder="ادخل اسمك الكامل"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  disabled={!isEditingEnabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الالكتروني</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300"
                  disabled={true}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl className="ltr">
                <PhoneInput
                  placeholder="ادخل رقم الهاتف"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300 rounded-md"
                  disabled={!isEditingEnabled}
                  defaultCountry="QA"
                  {...field}
                  value={
                    field.value && !field.value.startsWith("+") ? "+" + field.value : field.value
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الجنسية</FormLabel>
              <FormControl>
                <SelectCountry
                  nationality={field.value}
                  setNationality={field.onChange}
                  placeholder="إختر الجنسية ..."
                  className="max-h-48 w-full rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-300"
                  disabled={!isEditingEnabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تاريخ الميلاد</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="flex justify-end border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  disabled={!isEditingEnabled}
                  {...field}
                  onChange={e => {
                    const date = e.target.value ? new Date(e.target.value) : null
                    field.onChange(date)
                  }}
                  value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العنوان</FormLabel>
              <FormControl>
                <Input
                  placeholder="عنوان السكن"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  disabled={!isEditingEnabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">الوضع الداكن</FormLabel>
                <FormDescription>تفعيل الوضع الداكن للموقع</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value === "dark"}
                  onCheckedChange={checked => {
                    const theme = checked ? "dark" : "light"
                    field.onChange(theme)
                  }}
                  disabled={!isEditingEnabled}
                  className="ltr"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-start gap-x-4">
          {!isEditingEnabled ? (
            <Button
              type="button"
              onClick={e => {
                e.preventDefault()
                setIsEditingEnabled(true)
              }}
              variant="outline"
              className="cursor-pointer"
            >
              تعديل البيانات
            </Button>
          ) : (
            <>
              <Button type="submit" disabled={isLoading} className="min-w-[100px] cursor-pointer">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  setIsEditingEnabled(false)
                  form.reset()
                  setTheme(form.watch("theme") ?? "light")
                }}
              >
                إلغاء
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
