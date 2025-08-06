import { DashboardAreaChart } from "./DashboardAreaChart";
import DashboardPageBreadcrumb from "./DashboardPageBreadcrumb";

const DashboardPage = () => {
    return (
        <>
            <DashboardPageBreadcrumb />
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-2">
                Dashboard
            </h2>
            <p className="leading-7 mt-2 mb-2">
                Welcome to your dashboard. Here you can get an overview of your CRM activities, including leads, contacts, and settings.
            </p>
            <DashboardAreaChart />
        </>
    );
}

export default DashboardPage;
