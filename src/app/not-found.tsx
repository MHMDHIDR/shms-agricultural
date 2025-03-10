import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-background to-muted p-4">
      <div className="mx-auto w-full max-w-3xl space-y-8 text-center duration-1000 animate-in fade-in slide-in-from-bottom-4">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
            عفواً، الصفحة التي تبحث عنها غير موجودة.
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            المعذرة، نحن نعتقد أن هناك مشكلة. الصفحة التي تبحث عنها غير موجودة.
          </p>
        </div>

        <div className="group relative mx-auto aspect-2/1 w-full max-w-2xl">
          <Image
            src="/not-found.svg"
            alt="404 Illustration"
            fill
            className="animate-float object-contain"
            priority
          />
        </div>

        <div className="space-y-4">
          <Link href="/" className="pressable inline-flex text-lg">
            رجوع إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
