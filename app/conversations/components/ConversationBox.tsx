"use client";

import React, { useCallback, useMemo } from "react";
import { format } from "date-fns";
import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

interface Props {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox = ({ data, selected }: Props) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();


  //Handling the onClick of a conversation
  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  //Getting the last message
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  // Checking if the user has seen the last message
  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];
    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  // Getting the last message data
  const lastMessageText= useMemo(()=>{
    if(lastMessage?.image){
      return 'Sent an image'
    }

    if(lastMessage?.body){
      return lastMessage.body
    }

    return 'Started a chat'
  },[lastMessage])

  return <div onClick={handleClick} className={clsx(`
    w-full relative flex items-center space-x-3
    hover:bg-neutral-100 rounded-lg transition 
    cursor-pointer p-3
    `,
    selected ? 'bg-neutral-100' : 'bg-white'
  )} >
    {data.isGroup? (
      <AvatarGroup users={data.users}/> 
    ): (
      <Avatar user={otherUser}/>
    )}
    <div className="min-w-0 flex-1">
      <div className="focus:outline-none">
        <div className="flex justify-between items-center mb-1">
          {/* the paragraph is either a group name or a one-to-one user name */}
          <p className="text-base font-medium text-gray-900">{data.name || otherUser.name}</p>
          {lastMessage?.createdAt && (
            <p className=" text-xs text-gray-400 font-light">
              {format(new Date(lastMessage.createdAt), 'p')}
            </p>
          )}
        </div>
        {/* truncate will create a ... effect at the end for long texts */}
        <p className={clsx(`
          truncate text-sm
          `,
          hasSeen? 'text-gray-500' : 'text-black font-medium'
          )}>
        {lastMessageText}
        </p>
      </div>
    </div>
  </div>;
};

export default ConversationBox;
