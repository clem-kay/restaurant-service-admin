import {Outlet} from "react-router-dom";
import {ModeToggle} from "@/components/mode-toggle.tsx";

const Layout = () => {
    return (
        <div>
            <ModeToggle className='absolute top-2 right-14 z-[10000]'/>
            <Outlet/>
        </div>
    );
};

export default Layout;