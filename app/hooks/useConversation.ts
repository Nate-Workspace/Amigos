import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation=()=>{
     const params= useParams();
     
     const conversationId= useMemo(()=>{
        if(!params?.conversationId){
            return ''
        }

        return params.conversationId as string
     },[params?.conversationId])

     const isOpen= useMemo(()=> !!conversationId, [conversationId]) // The double exclamation turns the string into boolean

     return useMemo(()=>(
        { isOpen, conversationId}
     ), [conversationId, isOpen])
}

export default useConversation;