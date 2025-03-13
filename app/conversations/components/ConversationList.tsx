"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";

interface Props {
  initialItems: FullConversationType[];
}

const ConversationList = ({ initialItems }: Props) => {
  const [items, setItems] = useState(initialItems);

  const router = useRouter();

  const { conversationId, isOpen } = useConversation();
  return (
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
            className="rounded-full p-2 bg-gray-100 
          text-gray-600 cursor-pointer hover:opacity-75 transition"
          >
            <MdOutlineGroupAdd />
          </div>
        </div>
        {items.map(each=>(
            <ConversationBox
            key={each.id}
            data= {each}
            selected= {conversationId=== each.id}
            />
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;
