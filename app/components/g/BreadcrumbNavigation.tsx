import { Link } from "@remix-run/react";
import { ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbNavigationProps {
  breadcrumbs: Breadcrumb[];
}

export function BreadcrumbNavigation({ breadcrumbs }: BreadcrumbNavigationProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0" />
          )}
          
          {breadcrumb.current ? (
            <span className="text-gray-500 font-medium" aria-current="page">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              to={breadcrumb.href}
              className="text-blue-600 hover:text-blue-700 hover:underline flex items-center"
            >
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}