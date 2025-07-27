import { SyncLoader } from "react-spinners";

export default function AppLoader() {
    return <div className="flex items-center justify-center h-screen">
        <SyncLoader loading={true} color={'white'} />
    </div>
}
