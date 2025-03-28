"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModel";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface Props {
  users: User[]
  initialItems: FullConversationType[];
}

const ConversationList = ({ users, initialItems }: Props) => {
  const session= useSession()
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const { conversationId, isOpen } = useConversation();

  //Pusher code for the client------------------
  const pusherKey = useMemo(()=>{
    return session.data?.user?.email
  },[session.data?.user?.email])

  useEffect(()=>{
    if(!pusherKey){
      return;
    }
    
    pusherClient.subscribe(pusherKey)

    const newHandler= (conversation: FullConversationType)=>{
      setItems(current=> {
        //serarching inside the current array for an item with an id conversation.id
        if(find(current, {id: conversation.id})){
          return current
        }
        return [conversation, ...current]
      })
    }

    const updateHandler = (conversation: FullConversationType)=>{
      setItems(current=> current.map(currentConversation=>{
        if(currentConversation.id === conversation.id){
          return {
            ...currentConversation,
            messages: conversation.messages
          }
        }

        return currentConversation
      }))
    }

    const removeHandler= (conversation: FullConversationType)=>{
      setItems(current=>{
        return [...current.filter(convo=> convo.id !== conversation.id) ]
      })

      if(conversationId==conversation.id){
        router.push('/conversations')
      }
    }

    pusherClient.bind('conversation:new', newHandler)
    pusherClient.bind('conversation:update', updateHandler)
    pusherClient.bind('conversation:remove', removeHandler)
    
    return ()=>{
      pusherClient.unsubscribe(pusherKey)
      pusherClient.unbind('conversation:new', newHandler)
      pusherClient.unbind('conversation:update', updateHandler)
      pusherClient.unbind('conversation:remove', removeHandler)
    }
  },[pusherKey, conversationId, router])
  return (
    <>
      <GroupChatModal
      users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `
        fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 
        lg:block overflow-y-auto border-gray-200 border-r
        `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div
              className="text-2xl font-bold
                text-neutral-800"
            >
              Messages
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="rounded-full p-2 bg-gray-100 
          text-gray-600 cursor-pointer hover:opacity-75 transition"
            >
              <MdOutlineGroupAdd />
            </div>
          </div>
          {items.map((each) => (
            <ConversationBox
              key={each.id}
              data={each}
              selected={conversationId === each.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
