'use client'

import useConversation from "@/app/hooks/useConversation"
import axios from "axios"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { HiPhoto } from "react-icons/hi2"
import MessageInput from "./MessageInput"
import { HiPaperAirplane } from "react-icons/hi2"
import {CldUploadButton} from 'next-cloudinary'

const Form = () => {
    const {conversationId}= useConversation()

    const {register, handleSubmit, setValue, formState: {errors}}= useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    })

    // submiting a text
    const onSubmit: SubmitHandler<FieldValues>= (data)=>{
        setValue('message', '', {shouldValidate: true})
        axios.post('/api/messages', {
          ...data,
          conversationId  // conversationId: conversationId
        })
    }

    // submiting the image
    const handleUpload= (result: any)=>{
        axios.post('/api/messages', {
            image: result?.info?.secure_url,
            conversationId
        })
        .then(response => console.log("Message Sent:", response.data))
  .catch(error => console.error("Error in sending message:", error));
    }

  return (
    <div className="
    py-4 px-4 bg-white border-t flex 
    items-center gap-2 lg:gap-4 w-full z-40
    ">
        {/* In here use onSuccess instead of onUpload */}
        <CldUploadButton
        options={{maxFiles: 1}}
        onSuccess={handleUpload}
        uploadPreset="zqxddpqm"
        >
        <HiPhoto size={30} className="text-sky-500 cursor-pointer"/>
        </CldUploadButton>
        <form onSubmit={handleSubmit(onSubmit)} 
        className="
        flex items-center gap-2 lg:gap-4 w-full
        ">
            <MessageInput 
            id= 'message'
            register={register}
            errors= {errors}
            required
            placeholder= 'write a message'
            />

            <button type="submit" className="
            rounded-full p-2 bg-sky-500 cursor-pointer
             hover:bg-sky-600 transition
            ">
                <HiPaperAirplane size={18} className="text-white"/>
            </button>
        </form>
    </div>
  )
}

export default Form