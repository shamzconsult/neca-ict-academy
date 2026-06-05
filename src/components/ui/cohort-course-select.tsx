"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const COHORT_COURSE_SELECT_ITEM_CLASS =
  "min-w-0 h-auto min-h-9 items-start whitespace-normal py-2 text-left leading-snug normal-case";

const SELECT_VALUE_CLASS =
  "[&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:flex-1 [&_[data-slot=select-value]]:truncate [&_[data-slot=select-value]]:whitespace-nowrap [&_[data-slot=select-value]]:text-left";

export const cohortCourseSelectTriggerClass = ({
  size = "filter",
  className,
}: {
  size?: "filter" | "form";
  className?: string;
} = {}) =>
  cn(
    "shrink-0 overflow-hidden border-[#27156F]/15 bg-white normal-case",
    SELECT_VALUE_CLASS,
    size === "filter" && "h-9 w-52",
    size === "form" &&
      "h-11 w-full text-[#27156F] shadow-xs focus-visible:border-[#27156F]/40 focus-visible:ring-[#27156F]/20 disabled:opacity-50",
    className,
  );

export const COHORT_COURSE_SELECT_CONTENT_CLASS = "w-52 min-w-52 max-w-52";

export const COHORT_COURSE_SELECT_FORM_CONTENT_CLASS = "w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]";

type SelectOption = {
  value: string;
  label: string;
};

type CohortCourseSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  title?: string;
  allOption?: SelectOption;
  size?: "filter" | "form";
  triggerClassName?: string;
  contentClassName?: string;
};

export function CohortCourseSelect({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  id,
  title,
  allOption,
  size = "filter",
  triggerClassName,
  contentClassName,
}: CohortCourseSelectProps) {
  const selectedLabel =
    allOption?.value === value
      ? allOption.label
      : options.find((option) => option.value === value)?.label;

  const triggerTitle =
    title ??
    (selectedLabel && allOption?.value !== value ? selectedLabel : undefined);

  return (
    <Select
      value={value || undefined}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        className={cohortCourseSelectTriggerClass({ size, className: triggerClassName })}
        title={triggerTitle}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn(
          size === "form"
            ? COHORT_COURSE_SELECT_FORM_CONTENT_CLASS
            : COHORT_COURSE_SELECT_CONTENT_CLASS,
          contentClassName,
        )}
      >
        {allOption && (
          <SelectItem
            value={allOption.value}
            className={COHORT_COURSE_SELECT_ITEM_CLASS}
          >
            {allOption.label}
          </SelectItem>
        )}
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={COHORT_COURSE_SELECT_ITEM_CLASS}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
