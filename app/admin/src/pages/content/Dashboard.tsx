// Shared UI components
import { DestakTitle } from "ui-shared/components/ui/DestakTitle";
import { CardAnalytics } from "ui-shared/components/CardAnalytics";
import { ChartAnalytics } from "ui-shared/components/ChartAnalytics";
import { StatusBadge } from "ui-shared/components/ui/StatusBadge";

// Admin components
import { CardOrder } from "../../components/cardOrder/CardOrder";
import { WidgetInventoryAlerts } from "../../components/WidgetInventoryAlerts";
import { WidgetActiveStaff } from "../../components/WidgetActiveStaff";

// Hooks
import { useAnalytics } from "../../hooks/useAnalytics";
import { useOrders } from "../../hooks/useOrders";
import { useInventoryItems } from "../../hooks/useInventoryItems";
import { useEmployee } from "../../hooks/useEmployee";
import { useMenuItems } from "../../hooks/useMenuItems";

// Icons
import { Coffee, TrendingUp, Truck, Users, Clock, Box } from "lucide-react";

const ICON_MAP = {
    orders: Coffee,
    sales: TrendingUp,
    deliveries: Truck,
    users: Users,
    hours: Clock,
    stock: Box,
} as const;

export function Dashboard() {
    const { orders, handleAction } = useOrders();
    const { items: inventoryItems } = useInventoryItems();
    const { employees, deleteEmployee, toggleEmployeeStatus } = useEmployee();
    const { items: products } = useMenuItems();

    const { data } = useAnalytics({
        orders,
        employees,
        products,
        inventory: inventoryItems,
    });

    const priorityOrders = orders
        .filter((order) => order.status === "LATE" || order.status === "IN PROGRESS")
        .sort((a, b) => {
            if (a.status === b.status) return 0;
            if (a.status === "LATE") return -1;
            if (b.status === "LATE") return 1;
            return 0;
        });

    return (
        <div className="w-full h-fit gap-6 flex flex-col">
            <DestakTitle title="Dashboard" subtitle="Welcome to your dashboard" />

            {/* Analytics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

            {/* Chart */}
            {data?.chart && data.chart.data.length > 0 && (
                <ChartAnalytics
                    title={data.chart.title}
                    data={data.chart.data}
                    labels={data.chart.labels}
                    seriesLabel={data.chart.seriesLabel}
                />
            )}

            {/* Main content */}
            <div className="flex flex-row gap-6">
                {/* Priority orders */}
                <div className="w-full 2xl:flex-2 h-200 bg-(--Widget-background) rounded-md border border-(--Border) p-5 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--Border) pb-3">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-(--Primary-off) text-[22px] font-primary font-bold">
                                Priority Orders
                            </h2>
                            <p className="text-(--Text-gray) text-sm">
                                Late and in-progress orders that need attention
                            </p>
                        </div>
                        <StatusBadge
                            status="Priority"
                            colorMap={{ Priority: { bg: "bg-(--Primary-20)/20", text: "text-(--Primary)" } }}
                        >
                            {priorityOrders.length} urgent
                        </StatusBadge>
                    </div>

                    <div className="flex flex-wrap gap-6 flex-1 overflow-y-auto pr-1">
                        {priorityOrders.map((order) => (
                            <div key={order.id} className="w-full sm:w-auto">
                                <CardOrder order={order} onAction={handleAction} />
                            </div>
                        ))}

                        {priorityOrders.length === 0 && (
                            <div className="w-full h-full flex items-center justify-center py-10 text-(--Text-gray)">
                                No priority orders right now
                            </div>
                        )}
                    </div>
                </div>

                {/* Side widgets */}
                <div className="w-160 h-100 2xl:flex-1 flex flex-col gap-6">
                    {/* Inventory alerts */}
                    <WidgetInventoryAlerts items={inventoryItems} />

                    {/* Active staff */}
                    <WidgetActiveStaff
                        employees={employees}
                        onDeleteEmployee={deleteEmployee}
                        onBlockEmployee={toggleEmployeeStatus}
                    />
                </div>
            </div>
        </div>
    );
}