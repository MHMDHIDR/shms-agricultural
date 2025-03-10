import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Divider from "@/components/custom/divider"
import { APP_LOGO_SVG, APP_TITLE, APP_TITLE_SHORT } from "@/lib/constants"
import { api } from "@/trpc/server"
import FooterWrapper from "./footer-wrapper"

const footerSections = [
  {
    title: "الخدمات",
    links: [
      { name: "تحضير", href: "/preparation" },
      { name: "زراعة", href: "/farming" },
      { name: "حصاد", href: "/harvest" },
    ],
  },
  {
    title: "الشركة",
    links: [
      { name: "من نحن", href: "/about" },
      { name: "الفريق", href: "/about" },
    ],
  },
  {
    title: "الموارد",
    links: [
      { name: "المساعدة", href: "/contact" },
      { name: "الخصوصية", href: "/privacy" },
    ],
  },
]

export default async function Footer() {
  const socialLinks = await api.socialLinks.getSocialLinks()
  const IconMap = {
    facebook: <Facebook className="size-6" />,
    instagram: <Instagram className="size-6" />,
    twitter: <Twitter className="size-6" />,
    youtube: <Youtube className="size-6" />,
  }

  return (
    <FooterWrapper>
      <footer className="mt-20 bg-slate-50 select-none dark:bg-slate-900 shadow-inner shadow-slate-300 dark:shadow-slate-800">
        <div className="container mx-auto overflow-clip px-4 py-5 md:max-w-[70rem] md:px-0">
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-right">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <Image
                    src={APP_LOGO_SVG}
                    alt="logo"
                    className="h-10 w-10 md:h-20 md:w-20"
                    width={56}
                    height={56}
                  />
                  <h1 className="text-base font-semibold select-none md:text-xl">{APP_TITLE}</h1>
                </span>
                <p className="text-muted-foreground mt-3 text-sm leading-loose">
                  منصة استثمارية زراعية توفر مشاريع متنوعة لتعزيز الإنتاج الزراعي باستخدام أحدث
                  التقنيات.
                </p>
              </div>
              <ul className="text-muted-foreground flex items-center gap-3">
                {socialLinks &&
                  socialLinks.length > 0 &&
                  socialLinks.map((link, linkIdx) => (
                    <li key={linkIdx} className="hover:text-primary font-medium">
                      <Link href={link.socialLink} aria-label={link.socialType} target="_blank">
                        {IconMap[link.socialType.toLowerCase() as keyof typeof IconMap]}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-15 lg:gap-14">
              {footerSections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h2 className="mb-6 font-bold">{section.title}</h2>
                  <ul className="text-muted-foreground space-y-4 text-sm">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx} className="hover:text-primary font-medium">
                        <Link href={link.href}>{link.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Divider className="my-5" />
          <div className="text-muted-foreground flex flex-col justify-between gap-4 pt-4 text-center text-xs font-medium select-none lg:flex-row lg:items-center lg:text-right">
            <ul className="divide-primary flex justify-center divide-x divide-dotted">
              <li className="hover:text-primary px-3">
                <Link href="/about">عن {APP_TITLE_SHORT}</Link>
              </li>
              <li className="hover:text-primary px-3">
                <Link href="/terms">الشروط والأحكام</Link>
              </li>
              <li className="hover:text-primary px-3">
                <Link href="/privacy">الخصوصية</Link>
              </li>
            </ul>
            <p>
              <span>&copy; 2023 - {new Date().getFullYear()} </span> {APP_TITLE}
            </p>
          </div>
        </div>
      </footer>
    </FooterWrapper>
  )
}
