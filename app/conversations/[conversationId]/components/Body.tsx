'use client'

import useConversation from "@/app/hooks/useConversation"
import { FullMessageType } from "@/app/types"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import axios from "axios"
import { pusherClient } from "@/app/libs/pusher"
import { find } from "lodash"

interface BodyProps{
  initialMessages: FullMessageType[]
}

const Body = ({initialMessages}: BodyProps) => {
  const [messages, setMessages]= useState(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)
  const {conversationId}= useConversation()

  useEffect(()=>{
    axios.post(`/api/conversations/${conversationId}/seen`)
  },[conversationId])


  //Pusher code on the client
  useEffect(()=>{
    pusherClient.subscribe(conversationId)  //Joins a chat room
    bottomRef?.current?.scrollIntoView();   //Scrolls to the bottom of the chat

    const messageHandler= (message:FullMessageType)=>{
      axios.post(`/api/conversations/${conversationId}/seen`)

      setMessages(current=>{
        //Checks if there is any previous message with the same id to avoid duplicate messages
        if(find(current,{id: message.id})){
          return current
        }

        return [...current, message]
      })

      bottomRef?.current?.scrollIntoView()
    }

    const updateMessageHandler= (newMessage:FullMessageType)=>{
      setMessages(current=> current.map(currentMessage=>{
        if(currentMessage.id=== newMessage.id){
          return newMessage;
        }

        return currentMessage
      }))
    }

    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updateMessageHandler)

    return()=>{
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update',updateMessageHandler)
    }
  },[conversationId, bottomRef])
  //-----------------------------------


  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message,i)=>(
        <MessageBox
        isLast= {i===messages.length-1}
        key= {message.id}
        data= {message}
        />
      ))}
      <div ref={bottomRef} className="pt-24"/>
    </div>
  )
}

export default Body