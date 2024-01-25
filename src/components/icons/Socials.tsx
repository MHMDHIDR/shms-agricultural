import { cn } from '@/lib/utils'

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={cn(`h-7 w-7 text-[#1877f2] m-[0.625]`, className)}
      fill='currentColor'
      viewBox='0 0 24 24'
    >
      <path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' />
    </svg>
  )
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={cn(`h-7 w-7 text-[#c13584] m-[0.625]`, className)}
      fill='currentColor'
      viewBox='0 0 24 24'
    >
      <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
    </svg>
  )
}

export function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      className={cn(`h-7 w-7 text-[#ff0000] m-[0.625]`, className)}
      viewBox='0 0 24 24'
    >
      <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
    </svg>
  )
}

export function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={cn(`h-7 w-7 text-[#1da1f2] m-[0.625]`, className)}
      fill='currentColor'
      viewBox='0 0 24 24'
    >
      <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
    </svg>
  )
}

export function ShmsIcon({ className }: { className?: string }) {
  return (
    <svg
      width='600'
      height='300'
      viewBox='0 0 600 300'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      className={cn(`h-[18.75rem] w-[37.5rem]`, className)}
      aria-label='شمس الزراعية'
    >
      <g clipPath='url(#clip0_3_118)'>
        <rect width='300' height='300' fill='url(#pattern0)' />
        <rect width='300' height='300' fill='url(#pattern1)' />
      </g>
      <path
        className='dark:fill-white fill-black'
        d='M383.467 135.715C383.265 133.502 382.37 131.781 380.78 130.554C379.211 129.306 376.967 128.682 374.049 128.682C372.117 128.682 370.507 128.934 369.219 129.437C367.932 129.94 366.966 130.634 366.322 131.52C365.678 132.385 365.346 133.381 365.326 134.508C365.285 135.433 365.466 136.248 365.869 136.953C366.292 137.657 366.895 138.281 367.68 138.824C368.485 139.347 369.451 139.81 370.578 140.213C371.705 140.615 372.972 140.967 374.381 141.269L379.693 142.477C382.752 143.141 385.449 144.026 387.783 145.133C390.137 146.24 392.109 147.558 393.699 149.087C395.309 150.616 396.526 152.377 397.352 154.369C398.177 156.362 398.599 158.595 398.619 161.07C398.599 164.974 397.613 168.325 395.661 171.122C393.709 173.919 390.902 176.062 387.24 177.551C383.597 179.04 379.2 179.785 374.049 179.785C368.877 179.785 364.37 179.01 360.526 177.461C356.683 175.911 353.694 173.557 351.561 170.397C349.428 167.238 348.332 163.244 348.271 158.414H362.579C362.7 160.406 363.233 162.066 364.179 163.395C365.124 164.723 366.422 165.729 368.072 166.413C369.743 167.097 371.674 167.439 373.868 167.439C375.88 167.439 377.591 167.168 378.999 166.624C380.428 166.081 381.525 165.326 382.289 164.36C383.054 163.395 383.446 162.288 383.467 161.04C383.446 159.873 383.084 158.877 382.38 158.052C381.676 157.207 380.589 156.482 379.12 155.879C377.671 155.255 375.82 154.681 373.566 154.158L367.106 152.649C361.754 151.421 357.538 149.439 354.459 146.702C351.38 143.946 349.851 140.223 349.871 135.534C349.851 131.711 350.877 128.36 352.95 125.483C355.023 122.605 357.89 120.361 361.553 118.751C365.215 117.142 369.39 116.337 374.079 116.337C378.868 116.337 383.024 117.152 386.545 118.782C390.087 120.391 392.834 122.655 394.786 125.573C396.738 128.491 397.734 131.872 397.774 135.715H383.467ZM406.165 179V117.182H421.107V141.994H445.466V117.182H460.377V179H445.466V154.158H421.107V179H406.165ZM469.749 117.182H488.253L503.949 155.456H504.673L520.369 117.182H538.872V179H524.323V141.028H523.81L508.959 178.608H499.662L484.812 140.816H484.298V179H469.749V117.182ZM581.606 135.715C581.405 133.502 580.51 131.781 578.92 130.554C577.35 129.306 575.106 128.682 572.189 128.682C570.257 128.682 568.647 128.934 567.359 129.437C566.071 129.94 565.105 130.634 564.461 131.52C563.817 132.385 563.485 133.381 563.465 134.508C563.425 135.433 563.606 136.248 564.009 136.953C564.431 137.657 565.035 138.281 565.82 138.824C566.625 139.347 567.59 139.81 568.717 140.213C569.844 140.615 571.112 140.967 572.521 141.269L577.833 142.477C580.892 143.141 583.588 144.026 585.923 145.133C588.277 146.24 590.249 147.558 591.839 149.087C593.449 150.616 594.666 152.377 595.491 154.369C596.316 156.362 596.739 158.595 596.759 161.07C596.739 164.974 595.753 168.325 593.801 171.122C591.849 173.919 589.042 176.062 585.379 177.551C581.737 179.04 577.34 179.785 572.189 179.785C567.017 179.785 562.509 179.01 558.666 177.461C554.822 175.911 551.834 173.557 549.701 170.397C547.568 167.238 546.471 163.244 546.411 158.414H560.718C560.839 160.406 561.372 162.066 562.318 163.395C563.264 164.723 564.562 165.729 566.212 166.413C567.882 167.097 569.814 167.439 572.008 167.439C574.02 167.439 575.73 167.168 577.139 166.624C578.568 166.081 579.664 165.326 580.429 164.36C581.194 163.395 581.586 162.288 581.606 161.04C581.586 159.873 581.224 158.877 580.52 158.052C579.815 157.207 578.729 156.482 577.26 155.879C575.811 155.255 573.959 154.681 571.706 154.158L565.246 152.649C559.893 151.421 555.678 149.439 552.599 146.702C549.52 143.946 547.991 140.223 548.011 135.534C547.991 131.711 549.017 128.36 551.09 125.483C553.162 122.605 556.03 120.361 559.692 118.751C563.355 117.142 567.53 116.337 572.219 116.337C577.008 116.337 581.164 117.152 584.685 118.782C588.227 120.391 590.974 122.655 592.925 125.573C594.877 128.491 595.874 131.872 595.914 135.715H581.606ZM355.728 199V189.784C355.728 189.357 355.829 188.973 356.032 188.632C356.245 188.28 356.523 188.003 356.864 187.8C357.216 187.587 357.605 187.48 358.032 187.48H364.928C365.355 187.48 365.739 187.587 366.08 187.8C366.432 188.003 366.715 188.28 366.928 188.632C367.141 188.973 367.248 189.357 367.248 189.784V199H364.912V195.208H358.032V199H355.728ZM358.032 192.904H364.912V189.896C364.912 189.864 364.901 189.843 364.88 189.832C364.869 189.811 364.848 189.8 364.816 189.8H358.128C358.096 189.8 358.069 189.811 358.048 189.832C358.037 189.843 358.032 189.864 358.032 189.896V192.904ZM381.615 199C381.188 199 380.799 198.899 380.447 198.696C380.106 198.483 379.828 198.205 379.615 197.864C379.412 197.512 379.311 197.123 379.311 196.696V189.784C379.311 189.357 379.412 188.973 379.615 188.632C379.828 188.28 380.106 188.003 380.447 187.8C380.799 187.587 381.188 187.48 381.615 187.48H388.511C388.938 187.48 389.322 187.587 389.663 187.8C390.015 188.003 390.298 188.28 390.511 188.632C390.724 188.973 390.831 189.357 390.831 189.784V190.776H388.495V189.896C388.495 189.864 388.484 189.843 388.463 189.832C388.452 189.811 388.431 189.8 388.399 189.8H381.711C381.679 189.8 381.652 189.811 381.631 189.832C381.62 189.843 381.615 189.864 381.615 189.896V196.584C381.615 196.616 381.62 196.643 381.631 196.664C381.652 196.675 381.679 196.68 381.711 196.68H388.399C388.431 196.68 388.452 196.675 388.463 196.664C388.484 196.643 388.495 196.616 388.495 196.584V194.696H385.951V192.376H390.831V196.696C390.831 197.123 390.724 197.512 390.511 197.864C390.298 198.205 390.015 198.483 389.663 198.696C389.322 198.899 388.938 199 388.511 199H381.615ZM411.888 199L408.48 194.936H411.504L414.32 198.28V199H411.888ZM402.832 199V187.496H412.032C412.459 187.496 412.843 187.603 413.184 187.816C413.536 188.019 413.819 188.296 414.032 188.648C414.246 189 414.352 189.384 414.352 189.8V192.84C414.352 193.256 414.246 193.64 414.032 193.992C413.819 194.333 413.536 194.611 413.184 194.824C412.843 195.027 412.459 195.128 412.032 195.128L405.136 195.144V199H402.832ZM405.232 192.808H411.92C411.952 192.808 411.974 192.803 411.984 192.792C412.006 192.771 412.016 192.749 412.016 192.728V189.896C412.016 189.864 412.006 189.843 411.984 189.832C411.974 189.811 411.952 189.8 411.92 189.8H405.232C405.2 189.8 405.174 189.811 405.152 189.832C405.142 189.843 405.136 189.864 405.136 189.896V192.728C405.136 192.749 405.142 192.771 405.152 192.792C405.174 192.803 405.2 192.808 405.232 192.808ZM425.955 199V187.48H428.243V199H425.955ZM442.241 199C441.815 199 441.425 198.899 441.073 198.696C440.732 198.483 440.455 198.205 440.241 197.864C440.039 197.512 439.937 197.123 439.937 196.696V189.784C439.937 189.357 440.039 188.973 440.241 188.632C440.455 188.28 440.732 188.003 441.073 187.8C441.425 187.587 441.815 187.48 442.241 187.48H451.425V189.8H442.785C442.615 189.8 442.481 189.848 442.385 189.944C442.289 190.029 442.241 190.163 442.241 190.344V196.136C442.241 196.307 442.289 196.44 442.385 196.536C442.481 196.632 442.615 196.68 442.785 196.68H451.425V199H442.241ZM465.606 199C465.179 199 464.79 198.899 464.438 198.696C464.096 198.483 463.819 198.205 463.606 197.864C463.403 197.512 463.302 197.123 463.302 196.696V187.48H465.606V196.584C465.606 196.616 465.611 196.643 465.622 196.664C465.643 196.675 465.67 196.68 465.702 196.68H472.39C472.422 196.68 472.443 196.675 472.454 196.664C472.475 196.643 472.486 196.616 472.486 196.584V187.48H474.822V196.696C474.822 197.123 474.715 197.512 474.502 197.864C474.288 198.205 474.006 198.483 473.654 198.696C473.312 198.899 472.934 199 472.518 199H465.606ZM486.84 199V187.464H489.144V196.68H498.36V199H486.84ZM513.564 199V189.8H508.956V187.48H520.476V189.8H515.884V199H513.564ZM534.185 199C533.758 199 533.369 198.899 533.017 198.696C532.676 198.483 532.398 198.205 532.185 197.864C531.982 197.512 531.881 197.123 531.881 196.696V187.48H534.185V196.584C534.185 196.616 534.19 196.643 534.201 196.664C534.222 196.675 534.249 196.68 534.281 196.68H540.969C541.001 196.68 541.022 196.675 541.033 196.664C541.054 196.643 541.065 196.616 541.065 196.584V187.48H543.401V196.696C543.401 197.123 543.294 197.512 543.081 197.864C542.868 198.205 542.585 198.483 542.233 198.696C541.892 198.899 541.513 199 541.097 199H534.185ZM564.459 199L561.051 194.936H564.075L566.891 198.28V199H564.459ZM555.403 199V187.496H564.603C565.03 187.496 565.414 187.603 565.755 187.816C566.107 188.019 566.39 188.296 566.603 188.648C566.816 189 566.923 189.384 566.923 189.8V192.84C566.923 193.256 566.816 193.64 566.603 193.992C566.39 194.333 566.107 194.611 565.755 194.824C565.414 195.027 565.03 195.128 564.603 195.128L557.707 195.144V199H555.403ZM557.803 192.808H564.491C564.523 192.808 564.544 192.803 564.555 192.792C564.576 192.771 564.587 192.749 564.587 192.728V189.896C564.587 189.864 564.576 189.843 564.555 189.832C564.544 189.811 564.523 189.8 564.491 189.8H557.803C557.771 189.8 557.744 189.811 557.723 189.832C557.712 189.843 557.707 189.864 557.707 189.896V192.728C557.707 192.749 557.712 192.771 557.723 192.792C557.744 192.803 557.771 192.808 557.803 192.808ZM578.878 199V187.48H589.502V189.8H581.214V192.072H587.886V194.408H581.214V196.68H589.502V199H578.878Z'
      />
      <defs>
        <pattern
          id='pattern0'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          <use xlinkHref='#image0_3_118' transform='scale(0.00333333)' />
        </pattern>
        <pattern
          id='pattern1'
          patternContentUnits='objectBoundingBox'
          width='1'
          height='1'
        >
          <use xlinkHref='#image1_3_118' transform='scale(0.00333333)' />
        </pattern>
        <clipPath id='clip0_3_118'>
          <rect width='300' height='300' fill='white' />
        </clipPath>
        <image
          id='image0_3_118'
          width='300'
          height='300'
          xlinkHref='data:image/png;base64,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'
        />
        <image
          id='image1_3_118'
          width='300'
          height='300'
          xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsBAMAAACLU5NGAAAAAXNSR0IB2cksfwAAACFQTFRFAAAAp8NMp8NMp8NMp8NMp8NMp8NMp8NMp8NMp8NMp8NMeeAXPgAAAAt0Uk5TAH//zx+PL5/vv68j27mkAAAE+UlEQVR4nO2cXW7UMBRGI6O28MoKroIKlCc0K2AJqEtgBYgVVF0BYsWQmU5nkti5v44t9J1H5Pv5+CbNZJwww+Dn/XjFh4DAAMYMjZVSzukEdWn1j2/NvDa1mlkNbzasvrbT2uhXS6myV2Or/HlPraWGbL9aKx1Z9otaC71w6NJq3q+mF4YFhw57NXHuV2uPJYcOezWROuzVxKHDXoHuocCs8XtQUIq7IN1OUT9Dou7iLt/Pp6gQr9fPld/OoNdPzs8BVlcfw7640JuM+c1UjNXoP+0Xt3ifYmK8f0FpmWcLXKVQsJUlMRPi88oFqhOzIWGnqVEs13Bfu0qJmr+kcobV6q6YKA8NiFhSXqj4GGwlGA/jptUo+WTjEkxav5hQNvUtF0AGK26pbKw7IAsfun0cBVbjR7WVJHVruaJyfbtkscVc2arUZ700tuD17CsvIo3NB4sXpWyXIjfjpSjWtUsTvPp71KxJ1S5d8GLFruK4Zo3zFSutFN9btMnXS9bXVtR6zWY/B9fQhkmQl7mwmtixTF2l/96vNHvQW6mVLGLE36HN8GxpqCZSQA4nfcekOKWqdCxiH2kihVpRkFWoWKBUoFesVZBYuFSIl3fztYDucrlHq/xe9awGxzWsppTdq7KV7cyn6laWE2wPq2Gv2yo1qUurQdWvHa22d3ubWQ3Sfn3Z2UrotbuVxIsaWAm8mlhxXtZHj27SHr2y3KZFWt09UuZfT0tX7gmU+6WVOhZlvC6JOWmtl8bo7UbZLF8h9idrpQh43FzNctni5x45L7HV8iZpNcCeva6UXhqWrcjMmT0WNi/heiQz3mYHyWZYLlokte5UrrYwSnYtmxc7pFbFz6Vxomm0DS5PRtKBoolUg4ut0mkJGpbkQzVTbS1g4knqxUpxX+dUWvyxOQ27lw2TTsSOZjc8b9ZrXcOuXq3FvleTlpkmq/nKJOP5VrADlLPICpxfGWRzGLRcXsIpRkOJ/Qb9RjzD1dLlWlSaN6hXRi1bv5JpAlWVwUu+keLQUntZ45XbjtrXm3Tpl5NLWafrV9KG27WobOHt1XhZtL5S3C/d2T7LToZSab8M0R6tiPdOGa0fpmKJV/Ikm2olXjYrpxZ72hutvFqMl/ymIa+V3wuS1xcwPxO9ik3hXrbE3G6PPiTW6qkcF+Sltdrqu0GsFKeTkm1xJ7eXJkGxua2IdZbnl1XE9cTQtSYG6eVsvd5krhQhjDeWGaXMXrbFxIuRt6SSl7og4JUppZdgNPmlZBNdLolpLyvRVOehgjfAg6REXiQeGWc1iJ/is1a0OUu8173GfkcvGvhmUbgV78UPeahgxU5K/IA6cP1iqGTl86JqVi6vilZ2r8rvAVm/wcf8kMcGfVrhLV0laq1drP6Tl4dpL62ATYo6dHgIdV67Wu3ydNtCn1bdvmotOYy0v5akXQ2sun0D/LnDQzjRZbO4s55aaXlfdKxF4SXaI/Xvk8uUDyM1tOr256NL7Yr6hUcrXTar1K7WVq4X7WuSa1drp4lOtdZPHlsbnehUa3l2tfY506lW6tJq0a7WMhdSl1azdrVWuebSrpZ3f2u6bNZFi1qLzEldNuvcLmqtsSR12ayXdrWWWJN6PIbD8K7LZk1HkVor5GD/s1YjOtUCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGBn/gJJIQPGVk/FugAAAABJRU5ErkJggg=='
        />
      </defs>
    </svg>
  )
}
