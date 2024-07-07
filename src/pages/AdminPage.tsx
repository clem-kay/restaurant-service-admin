import {DashboardPage} from "./DashboardPage.tsx";
import {ModeToggle} from "@/components/Theme/mode-toggle.tsx";

const AdminPage = () => {
    return (
        <>
            <ModeToggle className='absolute top-2 right-24 z-[10000]'/>
            <DashboardPage/>
        </>
    );
};

export default AdminPage;