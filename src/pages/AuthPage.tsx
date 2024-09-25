import {Auth} from "@/components/Auth";
import {ModeToggle} from "@/components/Theme/mode-toggle.tsx";
import {useLocation} from "react-router-dom";
import {ResetPassword} from "@/components/Auth/resetPassword.tsx";

const AuthPage = () => {
    const path = useLocation().pathname.split("/")[2];
    return (
        <div className="flex flex-col bg-background min-h-dvh justify-center items-center">
            <ModeToggle className='absolute top-2 right-14 z-[10000]'/>
            {path === "reset-password" ? <ResetPassword/> : <Auth/>}
        </div>
    );
};

export default AuthPage;
