import bcrypt from 'bcrypt'
import prisma from '@/app/libs/prismadb'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest){
    try {
        const body= await request.json()
    
        const {email, name, password} = body;
    
        if( !name || !email || !password){
            return new NextResponse('Missing info', {status: 400})
        }
    
        const hashedPassword= await bcrypt.hash(password, 12);
    
        const user = await prisma.user.create({
            data:{
                email,
                name,
                hashedPassword
            }
        })
    
        return NextResponse.json(user)   // .json() doesn't require the new indicator before it
    } catch (error) {
        console.log(error, 'REGISTRATION_ERROR')
        return new NextResponse('Internal Error', {status: 500})
    }
}