import React from "react";
import {
  Package,
  Layers,
  Image as ImageIcon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/**
 * A single stat card: label, big number, optional trend pill, colored icon tile.
 */
function StatCard({
  label,
  value,
  trend,
  up = true,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </p>
          <p className="mt-2 text-4xl font-bold text-gray-900">{value}</p>

          {trend && (
            <span
              className={[
                "mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600",
              ].join(" ")}
            >
              {up ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {trend}
            </span>
          )}
        </div>

        <div
          className={[
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
            iconBg,
          ].join(" ")}
        >
          <Icon className={["h-6 w-6", iconColor].join(" ")} />
        </div>
      </div>
    </div>
  );
}

/**
 * Three-column grid of stat cards.
 *   <HomeCards products={42} subCategories={75} gallery={18} />
 */
export default function HomeCards({
  products = 0,
  subCategories = 0,
  gallery = 0,
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Products"
        value={products}
        trend="+12.4%"
        up
        icon={Package}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      />
      <StatCard
        label="Sub-Categories"
        value={subCategories}
        trend="+7.1%"
        up
        icon={Layers}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-500"
      />
      <StatCard
        label="Gallery"
        value={gallery}
        trend="+2.0%"
        up
        icon={ImageIcon}
        iconBg="bg-purple-50"
        iconColor="text-purple-500"
      />
    </div>
  );
}
