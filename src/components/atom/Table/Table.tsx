import { ReactNode } from 'react';

type TableProps = {
  children: ReactNode;
  className?: string;
};

export const Table = ({ children, className = '' }: TableProps) => <table className={`w-full table-auto bg-white ${className}`}>{children}</table>;

export const TableHead = ({ children, className = '' }: TableProps) => <thead className={className}>{children}</thead>;

export const TableBody = ({ children, className = '' }: TableProps) => <tbody className={className}>{children}</tbody>;

export const TableRow = ({ children, className = '', onClick }: TableProps & { onClick?: () => void }) => (
  <tr
    onClick={onClick}
    className={`border-[#C4C4C4]  ${className}`}>
    {children}
  </tr>
);

export const TableCell = ({ children, className = '', onClick }: TableProps & { onClick?: (e: React.MouseEvent) => void }) => (
  <td
    onClick={onClick}
    className={`p-4 ${className}`}>
    {children}
  </td>
);

export const TableHeader = ({ children, className = '' }: TableProps) => <th className={`p-4 text-left font-medium ${className}`}>{children}</th>;
