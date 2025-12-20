import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    } from "@/components/ui/sidebar";
    import { Home, Heart, User, Image, LogOut } from "lucide-react";

    export default function AppSidebar({ currentPage, setCurrentPage, onLogout }) {
    return (
        <Sidebar>
        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                    isActive={currentPage === "home"}
                    onClick={() => setCurrentPage("home")}
                    >
                    <Home />
                    Home
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                    isActive={currentPage === "wishlist"}
                    onClick={() => setCurrentPage("wishlist")}
                    >
                    <Heart />
                    Wishlist
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                    isActive={currentPage === "memories"}
                    onClick={() => setCurrentPage("memories")}
                    >
                    <Image />
                    Memories
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                    isActive={currentPage === "profile"}
                    onClick={() => setCurrentPage("profile")}
                    >
                    <User />
                    Profile
                    </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
            <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout} className="text-red-500">
                <LogOut />
                Logout
                </SidebarMenuButton>
            </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
        </Sidebar>
    );
}
