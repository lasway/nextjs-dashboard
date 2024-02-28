import { Bars3Icon, BellAlertIcon, HandThumbUpIcon, MoonIcon, UserCircleIcon } from "@heroicons/react/24/outline";
export default function TopNav() {
    return (
        <div className="flex flex-row rounded-md items-center justify-between px-4 py-2 bg-gray-50 ">
            <div className="flex flex-row items-center gap-2">
                <Bars3Icon className="w-6" />
            </div>
            <div className="flex flex-row items-end gap-2">
                <div className="flex flex-row items-center gap-2">
                    <BellAlertIcon className="w-6" />
                    <MoonIcon className="w-6" />
                    <UserCircleIcon className="w-7" />
                </div>

            </div>

        </div>
    );
}
