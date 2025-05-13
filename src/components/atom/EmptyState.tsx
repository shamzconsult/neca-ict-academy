import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  message: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: {
    container: "py-8",
    title: "text-lg",
    message: "text-sm",
  },
  md: {
    container: "py-12",
    title: "text-xl",
    message: "text-base",
  },
  lg: {
    container: "py-16",
    title: "text-2xl",
    message: "text-lg",
  },
};

const EmptyState = ({
  title,
  message,
  size = "md",
  className,
}: EmptyStateProps) => {
  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center w-full border-gray-100",
        styles.container,
        className
      )}
    >
      <h1 className={cn("font-bold text-gray-800 mb-2", styles.title)}>
        {title}
      </h1>
      <p className={cn("text-gray-500", styles.message)}>{message}</p>
    </div>
  );
};

export default EmptyState;
