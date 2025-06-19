import type { MetaFunction } from "@remix-run/node";
import { EnhancedAdminDashboard } from "~/components/g/EnhancedAdminDashboard";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin Dashboard - NewsHub" },
    { name: "description", content: "NewsHub content management and analytics dashboard with performance monitoring and SEO analysis." },
    { name: "robots", content: "noindex, nofollow" }, // Don't index admin pages
  ];
};

export default function AdminDashboardPage() {
  return <EnhancedAdminDashboard />;
}
