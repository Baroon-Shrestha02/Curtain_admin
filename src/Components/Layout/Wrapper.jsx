import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

/**
 * App shell: fixed sidebar on the left, scrollable page content on the right.
 *
 * Used as a parent route element. Child routes render into <Outlet />.
 *
 * Example:
 *   <Route element={<Layout />}>
 *     <Route path="/" element={<Home />} />
 *     <Route path="/products" element={<Products />} />
 *   </Route>
 */
export default function Wrapper({ onLogout }) {
  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
