import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة! - شمس | للخدمات الزراعية',
  description:
    'Shms Agricultural is an Agriculture Platform for Sudanese Farming Investors and Farmers.'
}

export default function Home() {
  return (
    <main className='fixed inset-0 z-[1000] select-none pointer-events-auto'>
      <div className='w-full h-3/4 bg-yellow-300'></div>
      <div className='flex justify-evenly relative w-full h-1/3 bg-yellow-400'>
        <div className='maceta-central left-[5.65rem]'>
          <div className='maceta-central-top'></div>
          <div className='cactus-izq'>
            <div className='cactus-part1'>
              <div className='pincho-base base7'></div>
              <div className='pincho-base base8'></div>
            </div>
            <div className='cactus-part2'>
              <div className='pincho-base base9'></div>
              <div className='pincho-base base10'></div>
              <div className='pincho-base base11'></div>
            </div>
            <div className='pincho-base'></div>
            <div className='pincho-base base1'></div>
            <div className='pincho-base base2'></div>
            <div className='pincho-base base3'></div>
            <div className='pincho-base base4'></div>
            <div className='pincho-base base5'></div>
            <div className='pincho-base base6'></div>
          </div>
        </div>
        <div className='maceta-central'>
          <div className='maceta-central-top'>
            <div className='cactus-cero'>
              <div className='interno-cactus'></div>
              <div className='cactus-pincho inter1'></div>
              <div className='cactus-pincho inter2'></div>
              <div className='cactus-pincho inter3'></div>
              <div className='cactus-pincho inter4'></div>
              <div className='cactus-pincho inter5'></div>
              <div className='cactus-pincho inter6'></div>
              <div className='cactus-pincho inter7'></div>
              <div className='cactus-pincho inter8'></div>
              <div className='cactus-pincho inter9'></div>
              <div className='cactus-pincho inter0'></div>
              <div className='cactus-pincho ext1'></div>
              <div className='cactus-pincho ext2'></div>
              <div className='cactus-pincho ext3'></div>
              <div className='cactus-pincho ext4'></div>
              <div className='cactus-pincho ext5'></div>
              <div className='cactus-pincho ext6'></div>
              <div className='cactus-pincho ext7'></div>
              <div className='cactus-pincho ext8'></div>
            </div>
          </div>
        </div>
        <div className='maceta-central maceta-der'>
          <div className='maceta-central-top'></div>
          <div className='cactus-izq'>
            <div className='cactus-part1'>
              <div className='pincho-base base7'></div>
              <div className='pincho-base base8'></div>
            </div>
            <div className='cactus-part2'>
              <div className='pincho-base base9'></div>
              <div className='pincho-base base10'></div>
              <div className='pincho-base base11'></div>
            </div>
            <div className='pincho-base'></div>
            <div className='pincho-base base1'></div>
            <div className='pincho-base base2'></div>
            <div className='pincho-base base3'></div>
            <div className='pincho-base base4'></div>
            <div className='pincho-base base5'></div>
            <div className='pincho-base base6'></div>
          </div>
        </div>
      </div>
      <div className='absolute top-8 left-1/2 w-0 h-0 border-b-[5rem] border-b-slate-500 border-l-[6.3rem] border-l-transparent border-r-[6.3rem] border-r-transparent -translate-x-36 -rotate-[15deg] animate-[valanceocuerda_5s] repeat-infinite'></div>
      <div className='absolute top-10 left-1/2 w-0 h-0 border-b-[5rem] border-b-yellow-200 border-l-[6.3rem] border-l-transparent border-r-[6.3rem] border-r-transparent -translate-x-36 -rotate-[15deg] animate-[valanceocuerda_5s] repeat-infinite'></div>
      <div className='absolute top-8 w-4 h-5 left-1/2 bg-slate-400 rounded-bl-[50%_100%] rounded-br-[50%_100%]  border-4 border-black -translate-x-16 -rotate-45'></div>
      <div className='absolute top-5 w-4 h-5 left-1/2 bg-slate-400 rounded-full border-2 border-black -translate-x-1/2 -rotate-12'></div>
      <div className='absolute top-5 w-4 h-5 left-1/2 bg-slate-400 rounded-full border-yellow-600 -translate-x-1/2 -rotate-12'></div>
      <div className='absolute top-32 left-1/2 w-80 h-52 bg-gray-100 border-[1rem]  border-yellow-600 rounded-3xl outline-4 outline-yellow-900 text-red-700 text-3xl text-center flex items-center justify-center animate-[valanceo_5s] repeat-infinite'>
        الصفحة غير موجودة
      </div>
    </main>
  )
}
