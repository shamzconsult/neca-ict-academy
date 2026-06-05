"use client";

import React from "react";
import { Eye } from "lucide-react";

import { EnrollmentType } from "@/types";
import {
  formatRelativeDate,
  formatRelativeDateTitle,
} from "@/utils/format-relative-date";
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableRow,
  TableStatusBadge,
} from "@/components/atom/Table/Table";

type Props = {
  enrollment: EnrollmentType;
  onInfoClick?: () => void;
  showCourse?: boolean;
};

function cleanUrl(url?: string) {
  return url?.replace(/[`'"]/g, "").trim() ?? "";
}

export const ApplicantTr = ({
  enrollment,
  onInfoClick,
  showCourse = true,
}: Props) => {
  const {
    _id,
    surname,
    otherNames,
    email,
    course,
    level,
    state,
    status,
    createdAt,
    profilePicture,
  } = enrollment;

  const profileUrl = cleanUrl(profilePicture?.url);
  const fullName = `${surname} ${otherNames}`.trim();

  return (
    <TableRow key={_id}>
      <TableCell>
        <button
          onClick={() => onInfoClick?.()}
          className="flex w-full cursor-pointer items-center gap-3 text-left"
        >
          {profileUrl ? (
            <img
              src={profileUrl}
              alt={fullName}
              className="size-9 shrink-0 rounded-full border border-[#27156F]/10 object-cover"
            />
          ) : (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#DBEAF6] text-xs font-bold text-[#27156F]">
              {surname?.[0]}
              {otherNames?.[0]}
            </div>
          )}
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-[#27156F]">{fullName}</span>
            <span className="block truncate text-sm text-gray-500">{email}</span>
          </span>
        </button>
      </TableCell>
      <TableCell className="whitespace-nowrap text-gray-600">{state}</TableCell>
      <TableCell className="whitespace-nowrap text-gray-600">
        <span title={formatRelativeDateTitle(createdAt)}>
          {formatRelativeDate(createdAt)}
        </span>
      </TableCell>
      {showCourse && (
        <TableCell className="max-w-[220px]">
          <p className="truncate font-medium text-gray-700">{course}</p>
        </TableCell>
      )}
      <TableCell className="capitalize text-gray-600">{level}</TableCell>
      <TableCell align="center">
        <TableStatusBadge
          variant={
            status.toLowerCase() === "admitted"
              ? "admitted"
              : status.toLowerCase() === "pending"
                ? "pending"
                : status.toLowerCase() === "declined"
                  ? "declined"
                  : status.toLowerCase() === "graduated"
                    ? "graduated"
                    : "default"
          }
        >
          {status}
        </TableStatusBadge>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-[#27156F]/20 bg-white text-[#27156F] hover:bg-[#DBEAF6]/50"
          onClick={() => onInfoClick?.()}
          aria-label="Review applicant"
        >
          <Eye className="size-3.5" />
          Review
        </Button>
      </TableCell>
    </TableRow>
  );
};
