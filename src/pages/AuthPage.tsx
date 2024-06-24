import { Auth } from "@/components/Auth";
import {ModeToggle} from "@/components/Theme/mode-toggle.tsx";

const AuthPage = () => {
    return (
        <div className="flex flex-col bg-background min-h-dvh justify-center items-center">
            <ModeToggle className='absolute top-2 right-14 z-[10000]'/>
            <Auth />
        </div>
    );
};

export default AuthPage;
