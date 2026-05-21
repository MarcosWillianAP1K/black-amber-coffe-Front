import { OptionConfig, type OptionConfigProps } from "ui-shared/components/OptionConfig";
import { NotificationBell } from "ui-shared/components/NotificationBell";



const options: OptionConfigProps[] = [
    {
        label: "Profile", action: () => {
            console.log("Profile clicked");
        }
    },
    {
        label: "Settings", action: () => {
            console.log("Settings clicked");
        }
    },
    {
        label: "Logout", action: () => {
            console.log("Logout clicked");
        }
    }];


const notifications = [
    { id: 1, message: "New order received", time: "2 mins ago", action: () => console.log("Notification 1 clicked") },
    { id: 2, message: "Inventory low for Espresso Beans", time: "10 mins ago", action: () => console.log("Notification 2 clicked") },
    { id: 3, message: "New staff member added", time: "1 hour ago", action: () => console.log("Notification 3 clicked") },
];


export function NavBarTop() {
    return (

        <div className="w-full h-fit py-4 bg-(--Nav-bar-background) shadow-lg text-white flex items-center justify-between px-6">

            <div>
                <h1 className="text-(--Primary) font-medium font-primary text-lg">Black Amber</h1>
            </div>


            <div className="flex items-center gap-6">


                <NotificationBell notifications={notifications} />

                <OptionConfig options={options} />

                <div className="w-8 h-8 bg-(--White) rounded-full cursor-pointer">
                    <img
                        src="https://github.com/MarcosWillian.png" // Puxando sua foto do Github de exemplo
                        alt="User"
                        className="rounded-full overflow-hidden w-full h-full object-cover"
                    />
                </div>
            </div>

        </div>
    );
}

export default NavBarTop;