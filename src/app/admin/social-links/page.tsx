import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/trpc/server"
import DeleteSocialLink from "./delete-social-link"
import SocialLinksForm from "./social-links-form"

export default async function SocialLinksPage() {
  const socialLinks = await api.socialLinks.getSocialLinks()

  return (
    <section className="container mx-auto">
      <h1 className="my-10 text-center text-xl font-bold select-none">روابط التواصل الاجتماعي</h1>
      <SocialLinksForm />

      <Table className="rtl mt-8 table min-h-full min-w-full divide-y divide-gray-200 text-center">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold select-none">نوع المنصة</TableHead>
            <TableHead className="text-center font-bold select-none">الرابط</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!socialLinks || socialLinks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-gray-500">
                لا توجد روابط تواصل اجتماعي
              </TableCell>
            </TableRow>
          ) : (
            socialLinks.map(link => (
              <TableRow key={link.id}>
                <TableCell className="p-2 text-center align-middle">
                  <div className="flex items-center justify-center gap-x-2 font-semibold capitalize">
                    {link.socialType === "facebook" ? (
                      <FacebookIcon className="h-5 w-5 md:h-6 md:w-6" />
                    ) : link.socialType === "instagram" ? (
                      <InstagramIcon className="h-5 w-5 md:h-6 md:w-6" />
                    ) : link.socialType === "youtube" ? (
                      <YoutubeIcon className="h-5 w-5 md:h-6 md:w-6" />
                    ) : (
                      <TwitterIcon className="h-5 w-5 md:h-6 md:w-6" />
                    )}
                    {link.socialType}
                  </div>
                </TableCell>
                <TableCell className="p-2 text-center align-middle">
                  {link.socialLink ? (
                    <Link
                      href={link.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:underline"
                    >
                      {link.socialLink}
                    </Link>
                  ) : (
                    <span className="text-gray-500">لا يوجد رابط</span>
                  )}
                </TableCell>
                <TableCell className="p-2 text-center align-middle">
                  <DeleteSocialLink link={link} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </section>
  )
}
