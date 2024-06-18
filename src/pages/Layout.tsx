import Footer from "@/components/Footer";
import {Outlet} from "react-router-dom";
import NavbarFloat from "@/components/Navbar/NavbarFloat";

const Layout = () => {
    return (
        <div>
            <NavbarFloat/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default Layout;