"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
  const route = useRoutes();
  const { isOpen } = useConversation();
  return (
    <div
      className="
      fixed justify-between w-full bottom-0
      z-40 flex items-center bg-white border-t-[1px] lg:hidden
    ">
      {route.map(each=>(
        <MobileItem
        key={each.label}
        href={each.href}
        icon= {each.icon}
        active= {each.active}
        onClick={ each.onClick}
        />
      ))}
    </div>
  );
};

export default MobileFooter;
