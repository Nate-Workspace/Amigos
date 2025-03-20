import { PropsWithChildren } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";

export default async function ConversationsLayout({children}: PropsWithChildren){
    const conversations= await getConversations()
    const users= await getUsers();
    return (
        <Sidebar>
            <ConversationList users={users} initialItems={conversations}/>
            <div className="h-full">
                {children}
            </div>
        </Sidebar>
    )
}