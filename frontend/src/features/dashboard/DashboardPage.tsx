import DashboardLeadStatusBarChart from "./DashboardLeadStatusBarChart";
import DashboardPageBreadCrumb from "./DashboardPageBreadCrumb";

const DashboardPage = () => {
    return (
        <>
            <DashboardPageBreadCrumb />
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-2">
                Dashboard
            </h2>
            <p className="leading-7 mt-2 mb-2">
                Welcome to your dashboard. Here you can get an overview of your CRM activities, including leads, contacts, and settings.
            </p>
            <DashboardLeadStatusBarChart />
        </>
    );
}

export default DashboardPage;
