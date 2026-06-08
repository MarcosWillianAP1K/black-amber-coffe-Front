import { DestakTitle } from "ui-shared/components/ui/DestakTitle";
import { CardAnalytics } from "ui-shared/components/CardAnalytics";
import { ChartAnalytics } from "ui-shared/components/ChartAnalytics";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useOrders } from "../../hooks/useOrders";
import { useEmployee } from "../../hooks/useEmployee";
import { useMenuItems } from "../../hooks/useMenuItems";
import { useInventoryItems } from "../../hooks/useInventoryItems";
import {
    Coffee,
    TrendingUp,
    Truck,
    Users,
    Clock,
    Box,
} from "lucide-react";

const ICON_MAP = {
    orders: Coffee,
    sales: TrendingUp,
    deliveries: Truck,
    users: Users,
    hours: Clock,
    stock: Box,
} as const;

export function Analytics() {
    const { orders } = useOrders();
    const { employees } = useEmployee();
    const { items: products } = useMenuItems();
    const { items: inventoryItems } = useInventoryItems();

    const { data } = useAnalytics({
        orders,
        employees,
        products,
        inventory: inventoryItems,
    });

    return (
        <div className="w-full h-fit gap-6 flex flex-col">
            <DestakTitle title="Analytics" subtitle="Your business performance at a glance" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {data?.cards.map((card) => {
                    const Icon = card.iconKey ? ICON_MAP[card.iconKey] : null;
                    return (
                        <CardAnalytics
                            key={card.id}
                            title={card.title}
                            value={card.value}
                            delta={card.delta}
                            deltaLabel={card.deltaLabel}
                            trend={card.trend}
                            icon={
                                Icon ? <Icon className="w-5 h-5 text-(--White)" /> : undefined
                            }
                            iconBgClassName={card.iconBgClassName}
                        />
                    );
                })}
            </div>

            {data?.chart && (
                <ChartAnalytics
                    title={data.chart.title}
                    data={data.chart.data}
                    labels={data.chart.labels}
                    seriesLabel={data.chart.seriesLabel}
                />
            )}
        </div>
    );
}

