import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {Button} from "@/components/ui/button.tsx";
import {CircleUser} from "lucide-react";
import CustomDialog from "@/components/Dashboard/category/CustomDialog.tsx";
import {useState} from "react";
import useAuthStore from "@/store/useAuthStore.ts";
import {useNavigate} from "react-router-dom";

const AccountAvatar = () => {
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const setIsRegisterUser = useAuthStore((state) => state.setIsRegisterUser);
    const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
    const handleLogout = () => {
        clearAuth();
        setIsLoggedIn(false)
        setIsDialogOpen(false);
    }


    return (
        <div>
            <CustomDialog
                title='Are you sure you want to logout?'
                message='You will be completely logged out of the dashboard.'
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleLogout}
                triggerBtnLabel={'Confirm'}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5"/>
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem className='focus:bg-accent'>Settings</DropdownMenuItem>
                    <DropdownMenuItem className='focus:bg-accent'>Support</DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => {
                        setIsRegisterUser(true)
                        navigate('/auth/register')
                    }} className='focus:bg-accent'>Add
                        User</DropdownMenuItem>
                    <DropdownMenuItem className='focus:bg-destructive' onClick={() => setIsDialogOpen(true)}
                    >
                        Logout
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default AccountAvatar;