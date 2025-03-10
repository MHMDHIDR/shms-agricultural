import { cn } from "@/lib/utils"

export const Divider = ({ children, className }: { children?: string; className?: string }) => (
  <div
    className={cn(
      `relative m-2.5 flex w-full items-center justify-center before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:[background:linear-gradient(90deg,transparent,#777,transparent)] dark:before:[background:linear-gradient(90deg,transparent,#999,transparent)]`,
      className,
    )}
  >
    {children ? (
      <span className="z-10 bg-background px-2 dark:text-neutral-200">{children}</span>
    ) : null}
  </div>
)

export default Divider
