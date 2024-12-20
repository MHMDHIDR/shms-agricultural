import client from '@/../prisma/prismadb'

export async function DELETE(
  _request: Request,
  { params: { projectId } }: { params: { projectId: string } }
) {
  if (!projectId) throw new Error('Project ID is required')

  try {
    // Check if project exists
    const project = await client.projects.findUnique({ where: { id: projectId } })

    // If project does not exist
    if (!project) {
      return new Response(
        JSON.stringify({
          projectDeleted: 0,
          message: 'عفواً لم يتم العثور على المشروع!'
        }),
        { status: 404 }
      )
    }

    // find the users where the project is in their stocks by checking each object inside shms_user_stocks array and filter the object out (delete it)
    const users = await client.users.findMany({
      where: {
        shms_user_stocks: { some: { id: projectId } }
      }
    })

    // Delete the project stock from each user shms_user_stocks array by filtering it out
    for (const user of users) {
      const userStocks = user.shms_user_stocks.filter(stock => stock.id !== projectId)
      await client.users.update({
        where: { id: user.id },
        data: { shms_user_stocks: { set: userStocks } }
      })
    }

    // Delete the project
    const deleteProject = await client.projects.delete({ where: { id: projectId } })
    const projectDeleted = deleteProject.id === projectId ? 1 : 0

    if (projectDeleted) {
      return new Response(
        JSON.stringify({ projectDeleted, message: `تم حذف المشروع بنجاح!` }),
        { status: 200 }
      )
    }

    return new Response(
      JSON.stringify({
        projectDeleted,
        message: `عفواً، لم يتم حذف المشروع بنجاح!`
      }),
      { status: 400 }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        projectDeleted: 0,
        message: `عفواً، حدثت مشكلة غير متوقعة، حاول مرة أخرى لاحقاً!`
      }),
      { status: 500 }
    )
  }
}
