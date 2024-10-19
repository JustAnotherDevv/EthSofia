import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  AlertCircle,
  Building,
  FileText,
  Home,
  EarthIcon,
  User2Icon,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Websites",
    href: "/",
    icon: EarthIcon,
  },
  {
    title: "Editor",
    href: "/editor",
    icon: FileText,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User2Icon,
  },
];

export default function Sidebar() {
  return (
    <div className="flex h-screen flex-col border-r">
      <div className="flex h-18 items-center border-b px-4 py-4">
        <a className="flex items-center space-x-2" href="/">
          <div className=" overflow-hidden rounded-full">
            <img
              alt="Project logo"
              className="cursor-pointer w-12 h-12 overflow-hidden"
              src="/logo.jpeg"
              width="128"
              height="128"
            />
          </div>
          <span className="text-2xl font-extrabold">Cyperpunk CMS</span>
        </a>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-4">
          {sidebarNavItems.map((item) => (
            <Button
              key={item.href}
              variant={
                //     location.split("/")[1] === item.href.split("/")[1]
                //       ? "secondary"
                //       :
                "ghost"
              }
              className={cn(
                "w-full justify-start gap-2"
                // location.split("/")[1] === item.href.split("/")[1] &&
                //   "bg-muted font-medium"
              )}
              asChild
            >
              <a href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.title}
              </a>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto mx-auto px-2">
        {/* <FaucetButton /> */}
        {/* <ConnectButton chainStatus="icon" showBalance={false} /> */}
        <ConnectButton chainStatus="icon" showBalance={false} />
        {/* <ConnectButton chainStatus="none" showBalance={false} /> */}
        <p className="text-sm text-gray-400 mt-4 text-center mb-2">
          Built during EthSofia 2024 hackathon
        </p>
      </div>
    </div>
  );
}
