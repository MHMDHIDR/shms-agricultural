"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FileUpload } from "@/components/custom/file-upload"
import SelectCountry from "@/components/custom/select-country"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { useToast } from "@/hooks/use-toast"
import { convertToBase64 } from "@/lib/convert-file-to-base64"
import { optimizeImage } from "@/lib/optimize-image"
import { signupSchema } from "@/schemas/signup"
import { api } from "@/trpc/react"
import type { SignupInput } from "@/schemas/signup"

export function SignUpForm({ sn }: { sn: number }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<{
    image?: File[]
    doc?: File[]
  }>({})

  const toast = useToast()
  const router = useRouter()

  const form = useForm<SignupInput>({
    resolver: zodResolver(
      signupSchema.refine(data => data.password === data.confirmPassword, {
        message: "كلمات المرور غير متطابقة",
        path: ["confirmPassword"],
      }),
    ),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      nationality: "",
      dateOfBirth: undefined,
      password: "",
      confirmPassword: "",
      image: "",
      doc: "",
    },
  })

  const { mutateAsync: uploadFiles } = api.S3.uploadFiles.useMutation()
  const { mutateAsync: createUser, isPending: isCreatingUser } = api.auth.create.useMutation()
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = api.user.updatePublic.useMutation()

  const processFile = async (
    file: File,
  ): Promise<{
    name: string
    type: string
    size: number
    lastModified: number
    base64: string
  }> => {
    const base64 = await convertToBase64(file)

    // Only optimize images, leave PDFs as is
    if (file.type.startsWith("image/")) {
      try {
        const optimizedBase64 = await optimizeImage({
          base64,
          quality: 70,
        })

        return {
          name: file.name.replace(/\.[^.]+$/, ".webp"), // Convert to .webp for optimized images
          type: "image/webp",
          size: optimizedBase64.length,
          lastModified: file.lastModified,
          base64: optimizedBase64,
        }
      } catch (error) {
        console.error("Image optimization failed:", error)
        // Fallback to original file if optimization fails
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          base64,
        }
      }
    }

    // Return PDF files unchanged
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      base64,
    }
  }

  const handleFileSelection = (files: File[], type: "image" | "doc") => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: files,
    }))
  }

  const uploadSelectedFiles = async (userId: string) => {
    const filesToUpload: { type: "image" | "doc"; files: File[] }[] = []

    if (selectedFiles.image?.length) {
      filesToUpload.push({ type: "image", files: selectedFiles.image })
    }
    if (selectedFiles.doc?.length) {
      filesToUpload.push({ type: "doc", files: selectedFiles.doc })
    }

    if (filesToUpload.length === 0) return {}

    setIsUploading(true)
    try {
      const uploadResults: Record<string, string> = {}

      for (const { type, files } of filesToUpload) {
        const fileData = await Promise.all(files.map(processFile))

        const urls = await uploadFiles({
          entityId: `user-${type}/${userId}`,
          fileData,
        })

        if (urls && urls.length > 0 && urls[0]) {
          uploadResults[type] = urls[0]
        }
      }

      return uploadResults
    } catch (error) {
      console.error("File upload error:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: SignupInput) => {
    try {
      const newUserId = await createUser(data)
      if (!newUserId) {
        throw new Error("حدث خطأ أثناء تسجيل الحساب، يرجى المحاولة مرة أخرى")
      }

      const uploadedUrls = await uploadSelectedFiles(newUserId)

      await updateUser({
        sn,
        id: newUserId,
        image: uploadedUrls.image ?? "",
        doc: uploadedUrls.doc ?? "",
      })

      toast.success("تم تسجيل الحساب بنجاح 🎉 ، يمكنك تسجيل الدخول الآن")
      router.replace("/signin")

      setSelectedFiles({})
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تسجيل الحساب، يرجى المحاولة مرة أخرى"

      toast.error(errorMsg)
    }
  }

  const isLoading = isCreatingUser || isUpdatingUser || isUploading

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
                <PhoneInput defaultCountry="QA" {...field} />
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
              <FormLabel htmlFor="dob">تاريخ الميلاد</FormLabel>
              <FormControl>
                <Input
                  id="dob"
                  type="date"
                  {...field}
                  onChange={e => field.onChange(new Date(e.target.value))}
                  value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                  className="flex justify-end"
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
                <Input placeholder="عنوان السكن" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl className="relative">
                <div>
                  <div className="relative">
                    <Input
                      className="pl-10"
                      type={showPassword ? "text" : "password"}
                      placeholder="كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()"
                      {...field}
                    />
                    <Button
                      type="button"
                      className="absolute top-0 left-0 flex h-full cursor-pointer items-center px-2"
                      aria-label="Toggle password visibility"
                      variant="ghost"
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <span className="text-xs text-slate-500 select-none">
                    كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف
                    خاص مثل !@#$%^&*()
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تأكيد كلمة المرور</FormLabel>
              <FormControl className="relative">
                <div>
                  <div className="relative">
                    <Input
                      className="pl-10"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()"
                      {...field}
                    />
                    <Button
                      type="button"
                      className="absolute top-0 left-0 flex h-full cursor-pointer items-center px-2"
                      aria-label="Toggle password visibility"
                      variant="ghost"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <span className="text-xs text-slate-500 select-none">
                    كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف
                    خاص مثل !@#$%^&*()
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>الصورة الشخصية</FormLabel>
              <FormControl>
                <FileUpload
                  onFilesSelected={files => handleFileSelection(files, "image")}
                  accept={{ "image/*": [".jpeg", ".jpg", ".png", ".webp"] }}
                  disabled={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doc"
          render={() => (
            <FormItem>
              <FormLabel>المستند الشخصي</FormLabel>
              <FormControl>
                <FileUpload
                  onFilesSelected={files => handleFileSelection(files, "doc")}
                  accept={{
                    "application/pdf": [".pdf"],
                    "image/*": [".jpeg", ".jpg", ".png", ".webp"],
                  }}
                  disabled={isUploading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="pressable"
          className="w-full"
          disabled={isLoading || isUploading}
        >
          {(isLoading || isUploading) && <Loader2 className="mr-2 animate-spin" />}
          تسجيل
        </Button>
      </form>
    </Form>
  )
}
