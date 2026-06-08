import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";

export default function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <RouterProvider router={router} />
      </OrderProvider>
    </AuthProvider>
  );
}