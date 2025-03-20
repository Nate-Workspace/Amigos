import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb'

export async function DELETE(request: NextRequest, {params}:{params:{conversationId:string}}){
    try {
        const {conversationId}= params;
        const currentUser= await getCurrentUser()

        if(!currentUser?.id){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const conversation= await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include:{
                users:true
            }
        })

        if(!conversation){
            return new NextResponse('Invalid Id', {status: 400})
        }

        const deletedConversation= await prisma.conversation.deleteMany({
            where:{
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        })

        return NextResponse.json(deletedConversation)
    } catch (error:any) {
        console.log(error, 'ERROR_CONVERSATION_DELETE')
        return new NextResponse('Internal Error', {status: 500})
    }
}