import client from '@/../prisma/prismadb'

export async function GET() {
  try {
    const socialLinks = await client.socialLinks.findMany()

    return new Response(JSON.stringify(socialLinks), { status: 200 })
  } catch (error) {
    console.error('Error fetching social links:', error)
    return new Response(
      JSON.stringify({ message: 'حدث خطأ أثناء جلب روابط التواصل الاجتماعي' }),
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { shms_social_type, shms_social_link } = body

    // Validate input
    if (!shms_social_type || !shms_social_link) {
      return new Response(JSON.stringify({ message: 'يجب تعبئة جميع الحقول' }), {
        status: 400
      })
    }

    // Check if a link for this type already exists
    const existingLink = await client.socialLinks.findFirst({
      where: { shms_social_type }
    })

    if (existingLink) {
      // Update existing link
      const updatedLink = await client.socialLinks.update({
        where: { id: existingLink.id },
        data: { shms_social_link }
      })

      return new Response(JSON.stringify(updatedLink))
    }

    // Create new link
    const newLink = await client.socialLinks.create({
      data: { shms_social_type, shms_social_link }
    })

    return new Response(JSON.stringify(newLink))
  } catch (error) {
    console.error('Error creating social link:', error)
    return new Response(
      JSON.stringify({ message: 'حدث خطأ أثناء جلب روابط التواصل الاجتماعي' }),
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return new Response(JSON.stringify({ message: 'معرف الرابط مطلوب' }), {
        status: 400
      })
    }

    await client.socialLinks.delete({
      where: { id }
    })

    return new Response(JSON.stringify({ message: 'تم حذف الرابط بنجاح' }))
  } catch (error) {
    console.error('Error deleting social link:', error)
    return new Response(
      JSON.stringify({ message: 'حدث خطأ أثناء حذف رابط التواصل الاجتماعي' }),
      { status: 500 }
    )
  }
}
