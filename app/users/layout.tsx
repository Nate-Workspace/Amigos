import { PropsWithChildren } from "react";
import Sidebar from "../components/sidebar/Sidebar";

export default async function UsersLayout({ children }: PropsWithChildren) {
  return (
    <Sidebar>
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
