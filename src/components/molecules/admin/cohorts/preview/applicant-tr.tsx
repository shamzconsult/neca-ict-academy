import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EnrollmentType } from "@/types";
import { levelOptions, statusOptions } from "@/const";
import { ApplicantInfoModal } from "./applicant-info-modal";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = { enrollment: EnrollmentType };

export const ApplicantTr = ({ enrollment }: Props) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: enrollment.status,
    level: enrollment.level,
  });
  const params = useParams();
  const slug = params?.slug as string;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      status,
      level,
    }: {
      id: string;
      status: string;
      level: string;
    }) => {
      const res = await fetch(`/api/applicant/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, level }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cohort-applicants", slug],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["cohort-applicants-stats", slug],
        exact: false,
      });
      toast.success("Applicant updated");
      setIsOpen(false);
    },
    onError: (error: unknown) => {
      const errMsg =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Update failed: ${errMsg}`);
    },
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    e.preventDefault();
    mutation.mutate({ id, status: formData.status, level: formData.level });
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isPending = mutation.isPending;

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
  } = enrollment;

  return (
    <tr
      key={_id}
      className='border-b last-of-type:border-none border-gray-200 hover:bg-gray-50 transition-colors'
    >
      <td className='p-4'>
        <button
          onClick={() => setShowInfoModal(true)}
          className='flex flex-col text-left cursor-pointer'
        >
          <span className='text-gray-900 font-semibold'>
            {surname} {otherNames}
          </span>
          <span className='text-sm text-gray-500'>{email}</span>
        </button>
      </td>
      <td className='p-4 text-nowrap text-gray-700'>{state}</td>
      <td className='p-4 text-nowrap text-gray-700'>
        {new Date(createdAt).toDateString()}
      </td>
      <td className='p-4 text-nowrap text-gray-700 font-medium'>
        <p className='truncate w-[250px]'>{course}</p>
      </td>
      <td className='p-4 capitalize text-gray-700'>{level}</td>
      <td className='p-4'>
        <span
          className={`px-3 py-1 text-nowrap rounded-md text-sm font-semibold capitalize ${
            status.toLowerCase() === "admitted"
              ? "bg-green-100 text-[#78A55A]"
              : status.toLowerCase() === "pending"
                ? "bg-yellow-100 text-[#F29D38]"
                : status.toLowerCase() === "declined"
                  ? "bg-red-100 text-[#E02B20]"
                  : "bg-gray-100 text-[#525252]"
          }`}
        >
          {status}
        </span>
      </td>
      <td className='p-4 align-middle'>
        <Dialog open={isOpen} onOpenChange={() => setIsOpen((open) => !open)}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger className='cursor-pointer' asChild>
                <button
                  className='inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-200 focus:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300'
                  aria-label='Update applicant'
                >
                  <Pencil className='w-4 h-4' />
                  Update
                </button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side='top'>
              Update applicant status and level
            </TooltipContent>
          </Tooltip>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Applicant</DialogTitle>
            </DialogHeader>

            <form onSubmit={(e) => handleSubmit(e, _id)}>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <label htmlFor='level' className='text-sm font-medium'>
                    Level
                  </label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => handleChange("level", value)}
                    disabled={isPending}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Level' />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map((level, index) => (
                        <SelectItem key={index} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <label htmlFor='status' className='text-sm font-medium'>
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                    disabled={isPending}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Status' />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status, index) => (
                        <SelectItem key={index} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='mt-10 flex justify-end gap-4'>
                <Button disabled={isPending}>
                  {isPending ? "Updating..." : "Update"}
                </Button>
                <DialogClose asChild>
                  <Button type='button' variant='destructive'>
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </td>

      <ApplicantInfoModal
        enrollment={enrollment}
        isOpen={showInfoModal}
        onOpenChange={setShowInfoModal}
      />
    </tr>
  );
};
