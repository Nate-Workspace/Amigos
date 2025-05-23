import { PropsWithChildren } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

import getCurrentUser from "@/app/actions/getCurrentUser";

async function Sidebar({ children }: PropsWithChildren) {
  const currentUser= await getCurrentUser()
  return (
    <div className="h-full">
      <MobileFooter/>
      <DesktopSidebar currentUser={currentUser!}/>
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

export default Sidebar;
