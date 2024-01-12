import { UserProfile } from '@clerk/nextjs'

export default function ProfilePage() {
  return (
    <section className='container mx-auto'>
      <UserProfile />
    </section>
  )
}
