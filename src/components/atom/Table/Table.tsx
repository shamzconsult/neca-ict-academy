import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type TableProps = {
  children: ReactNode;
  className?: string;
};

export const TableContainer = ({
  children,
  className,
}: TableProps) => (
  <div
    className={cn(
      "overflow-hidden rounded-2xl border border-[#27156F]/10 bg-white shadow-sm",
      className
    )}
  >
    <div className="relative">
      <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
        {children}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent sm:hidden"
        aria-hidden
      />
    </div>
  </div>
);

export const Table = ({ children, className = "" }: TableProps) => (
  <table
    className={cn(
      "w-full min-w-[960px] caption-bottom text-sm text-gray-700",
      className
    )}
  >
    {children}
  </table>
);

export const TableHead = ({ children, className = "" }: TableProps) => (
  <thead
    className={cn(
      "border-b border-[#27156F]/10 bg-[#DBEAF6]/40",
      className
    )}
  >
    {children}
  </thead>
);

export const TableBody = ({ children, className = "" }: TableProps) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)}>
    {children}
  </tbody>
);

export const TableRow = ({
  children,
  className = "",
  onClick,
}: TableProps & { onClick?: () => void }) => (
  <tr
    onClick={onClick}
    className={cn(
      "border-b border-[#27156F]/5 transition-colors",
      onClick && "cursor-pointer hover:bg-[#DBEAF6]/30",
      !onClick && "hover:bg-gray-50/80",
      className
    )}
  >
    {children}
  </tr>
);

type TableCellProps = TableProps & {
  onClick?: (e: React.MouseEvent) => void;
  align?: "left" | "center" | "right";
};

export const TableCell = ({
  children,
  className = "",
  onClick,
  align = "left",
}: TableCellProps) => (
  <td
    onClick={onClick}
    className={cn(
      "px-4 py-3.5 align-middle",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className
    )}
  >
    {children}
  </td>
);

type TableHeaderProps = TableProps & {
  align?: "left" | "center" | "right";
};

export const TableHeader = ({
  children,
  className = "",
  align = "left",
}: TableHeaderProps) => (
  <th
    className={cn(
      "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-[#27156F]/80 whitespace-nowrap",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className
    )}
  >
    {children}
  </th>
);

export const TableEmptyRow = ({
  colSpan,
  message = "No results found",
}: {
  colSpan: number;
  message?: string;
}) => (
  <TableRow className="hover:bg-transparent">
    <td colSpan={colSpan} className="px-4 py-16 text-center">
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </td>
  </TableRow>
);

type StatusVariant =
  | "active"
  | "inactive"
  | "pending"
  | "admitted"
  | "declined"
  | "graduated"
  | "default";

const statusStyles: Record<StatusVariant, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  inactive: "bg-red-50 text-[#E02B20] ring-red-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  admitted: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  declined: "bg-red-50 text-[#E02B20] ring-red-600/20",
  graduated: "bg-blue-50 text-blue-700 ring-blue-600/20",
  default: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

export const TableStatusBadge = ({
  variant,
  children,
  className,
}: {
  variant: StatusVariant;
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset",
      statusStyles[variant],
      className
    )}
  >
    {children}
  </span>
);

export const TableStat = ({ value }: { value: number | string }) => (
  <span className="tabular-nums font-medium text-[#27156F]">{value ?? "0"}</span>
);
