/**
 *  A function to scrollToView of an element
 * @param scrollY the y position to scroll to
 * @returns void
 */
export const scrollToView = (scrollY = 500) =>
  setTimeout(() => {
    const heroElement = document.querySelector("#hero")!
    window.scrollTo({
      top: scrollY ?? (heroElement as HTMLElement).offsetHeight,
      behavior: "smooth",
    })
  }, 100)
