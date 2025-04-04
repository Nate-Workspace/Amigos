import { usePathname, redirect } from "next/navigation"                            
import useConversation from "./useConversation"
import { useMemo } from "react"
import { HiChat, HiUsers } from "react-icons/hi"
import { signOut,useSession } from "next-auth/react"
import { HiArrowLeftOnRectangle } from "react-icons/hi2"
import axios from "axios"

const useRoutes = () => {
  const pathname= usePathname()
  const {conversationId} = useConversation()

  const routes = useMemo(()=>[
    {
        label: "Chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname=== '/conversations' || !!conversationId
    },
    {
        label: "Users",
        href: '/users',
        icon: HiUsers,
        active: pathname === '/users'
    },
    {
        label: "logout",
        href: '#',
        onClick: () => {
          signOut({ callbackUrl: "/" });
        },
        icon: HiArrowLeftOnRectangle
    }
  ], [pathname, conversationId])

  return routes;
}

export default useRoutes

// onClick: () => {
//   signOut({redirect: false, callbackUrl: "/" });
//   redirect("/") 
// }