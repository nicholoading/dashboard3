"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, LogOut, Menu, Package, Bug, ChevronDown, History, FileUp, Lightbulb } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = () => {
    // For now, just redirect to sign-in page
    router.push("/signin")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 lg:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar onSignOut={handleSignOut} />
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 overflow-y-auto border-r bg-gray-100/40 lg:block">
        <Sidebar onSignOut={handleSignOut} />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6 px-4 lg:px-8 pt-16 lg:pt-6">{children}</div>
      </main>
    </div>
  )
}

function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  const [bugsOpen, setBugsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-lg">BugCrusher</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          <NavItem href="/dashboard" icon={Home}>
            Dashboard
          </NavItem>
          <NavItem href="/dashboard/history" icon={History}>
            History
          </NavItem>
          <NavItem href="/dashboard/submission" icon={FileUp}>
            Submission
          </NavItem>
          <NavItem href="/dashboard/enhancement" icon={Lightbulb}>
            Enhancement
          </NavItem>
          <NavItem href="/dashboard/mission-pack" icon={Package}>
            Mission Pack
          </NavItem>
          <div className="relative">
            <button
              onClick={() => setBugsOpen(!bugsOpen)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                bugsOpen ? "bg-gray-200 text-gray-900" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900",
              )}
            >
              <Bug className="h-4 w-4" />
              Bugs
              <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", bugsOpen && "rotate-180")} />
            </button>
            {bugsOpen && (
              <div className="mt-1 space-y-1 px-3">
                {[...Array(10)].map((_, i) => (
                  <NavItem key={i} href={`/dashboard/bugs/${i + 1}`} className="pl-8">
                    Bug #{i + 1}
                  </NavItem>
                ))}
              </div>
            )}
          </div>
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <UserProfile onSignOut={onSignOut} />
      </div>
    </div>
  )
}

function NavItem({
  href,
  icon: Icon,
  children,
  className,
}: { href: string; icon?: React.ElementType; children: React.ReactNode; className?: string }) {
  const pathname = usePathname()
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        pathname === href ? "bg-gray-200 text-gray-900" : "text-gray-700 hover:bg-gray-200 hover:text-gray-900",
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Link>
  )
}

function UserProfile({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="/avatars/01.png" alt="@johndoe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">John Doe</span>
        <span className="text-xs text-gray-500">john@example.com</span>
      </div>
      <Button variant="ghost" size="icon" className="ml-auto" onClick={onSignOut}>
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Sign out</span>
      </Button>
    </div>
  )
}

