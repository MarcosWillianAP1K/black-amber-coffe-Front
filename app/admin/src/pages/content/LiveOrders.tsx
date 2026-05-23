import { DestakTitle } from "ui-shared/components/ui/DestakTitle";
import { OverlayOrder } from "../../components/OverlayOrder/OverlayOrder";
import { CardOrder } from "../../components/cardOrder/CardOrder";
import { useOrders } from "../../hooks/useOrders";



export function LiveOrders() {
    const { orders, handleAction, addOrder } = useOrders();

    return (
        <div className="w-full h-fit gap-6 flex flex-col">

            <DestakTitle title="Orders Queue" subtitle="Manage your live orders" />


        
            <OverlayOrder onSave={addOrder} />

            {/* Cards */}
            <div className="w-fit h-fit px-12 flex gap-5 flex-wrap justify-start">
                {orders.map((order) => (
                    <CardOrder
                        key={order.id}
                        order={order}
                        onAction={handleAction}
                    />
                ))}
            </div>

           
        </div>
    );
}
