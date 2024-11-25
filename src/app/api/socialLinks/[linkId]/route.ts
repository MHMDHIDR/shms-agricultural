import client from '@/../prisma/prismadb'

export async function DELETE(
  _request: Request,
  { params: { linkId } }: { params: { linkId: string } }
) {
  if (!linkId) {
    return new Response(JSON.stringify({ message: 'معرف الرابط مطلوب' }), {
      status: 400
    })
  }

  try {
    await client.socialLinks.delete({ where: { id: linkId } })

    return new Response(JSON.stringify({ message: 'تم حذف الرابط بنجاح' }))
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ message: 'حدث خطأ أثناء حذف رابط التواصل الاجتماعي' }),
      { status: 500 }
    )
  }
}
