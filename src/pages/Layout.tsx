import Footer from "@/components/Footer";
import {Outlet} from "react-router-dom";
import {ModeToggle} from "@/components/mode-toggle.tsx";

const Layout = () => {
    return (
        <div>
            <ModeToggle className='absolute top-2 right-14 z-[10000000000]'/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default Layout;