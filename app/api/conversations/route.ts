import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb"
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: NextRequest){

    // Creating a new conversation or calling an already existing
    // one from the database.
    try {
        const currentUser= await getCurrentUser()
        console.log(currentUser)
        const body= await request.json()
        const{userId, isGroup, members, name}= body;

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized', {status: 401})
        }

        if( isGroup && (!members || members.length < 2 || !name)){
            return new NextResponse('Invalid Data', {status: 400})
        }

        if(isGroup){
            const newConversation= await prisma?.conversation.create({
                data: {
                    name, 
                    isGroup,
                    users : {
                        connect: [
                            ...members.map((member: {value: string})=>({
                                id: member.value
                            })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },
                include: {
                    users: true
                }
            })

            //Pusher code for a group conversation--------
            newConversation.users.forEach(user=>{
                if(user.email){
                    pusherServer.trigger(user.email, 'conversation:new', newConversation)
                }
            })

            return NextResponse.json(newConversation)
        }

        const existingConversations = await prisma.conversation.findMany({
            where:{
                OR:[
                    {
                        userIds:{
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds:{
                            equals: [userId, currentUser.id]
                        }
                    }
                ]
            }
        })

        const singleConversation = existingConversations[0];

        if(singleConversation){
            return NextResponse.json(singleConversation)
        }

        const newConversation= await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                          id: currentUser.id  
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include:{
                users: true
            }
        })

        //Pusher code for a single conversation------------
        newConversation.users.map(user=>{
            if(user.email){
                pusherServer.trigger(user.email, 'conversation:new', newConversation)
            }
        })

        return NextResponse.json(newConversation)

    } catch (error: any) {
        return new NextResponse('Internal Error', {status: 500})
    }
}