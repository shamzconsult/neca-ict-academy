import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EnrollmentType } from "@/types";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { levelOptions, statusOptions } from "@/const";
import { ApplicantInfoModal } from "./applicant-info-modal";

type Props = { enrollment: EnrollmentType };

export const ApplicantTr = ({ enrollment }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { applicant, course, level, status } = enrollment;
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    status,
    level,
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string
  ) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("status", formData.status);
    formDataToSend.append("level", formData.level);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/applicant/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: formData.status,
            level: formData.level,
          }),
        });

        if (!res.ok) {
          console.error("Failed to update applicant:", await res.text());
          return;
        }

        setFormData({
          status: formData.status,
          level: formData.level,
        });
        router.refresh();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: "Applicant updated",
        });

        setIsOpen(false);
      } catch (error) {
        console.error("Error updating applicant:", error);
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <tr key={applicant._id} className="border-t border-[#C4C4C4]">
      <td className="p-4">
        <button
          onClick={() => setShowInfoModal(true)}
          className="flex flex-col text-left cursor-pointer"
        >
          <span className="text-nowrap">
            {applicant.firstName} {applicant.lastName}
          </span>
          <span className="text-sm text-nowrap">{applicant.email}</span>
        </button>
      </td>
      <td className="p-4 text-nowrap">{applicant.state}</td>
      <td className="p-4 text-nowrap">
        {new Date(applicant.createdAt).toDateString()}
      </td>
      <td className="p-4 text-nowrap">{course?.title}</td>
      <td className="p-4 capitalize">{level}</td>
      <td className="p-4">
        <span
          className={`px-3 py-1 text-nowrap rounded-md text-sm capitalize ${
            applicant.status === "Admitted"
              ? "bg-green-100 text-[#78A55A]"
              : applicant.status === "Pending"
                ? "bg-yellow-100 text-[#F29D38]"
                : applicant.status === "Declined"
                  ? "bg-red-100 text-[#E02B20]"
                  : "bg-gray-100 text-[#525252]"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="p-4">
        <Dialog open={isOpen} onOpenChange={() => setIsOpen((open) => !open)}>
          <DialogTrigger className="cursor-pointer" asChild>
            <button className="hover:underline cursor-pointer">Update</button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Applicant Profile</DialogTitle>
            </DialogHeader>

            <form onSubmit={(e) => handleSubmit(e, applicant._id)}>
              <div className="space-y-6 mt-5">
                <label htmlFor="level" className="mb-10">
                  Level
                </label>

                <select
                  name="level"
                  id="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full p-2 border mt-2 border-[#C4C4C4] rounded-md capitalize"
                  disabled={isPending}
                >
                  <option value="">Select Level</option>
                  {levelOptions.map((level, index) => (
                    <option key={index} value={level}>
                      {level}
                    </option>
                  ))}
                </select>

                <label htmlFor="status">Status</label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border mt-2 border-[#C4C4C4] rounded-md capitalize"
                  disabled={isPending}
                >
                  <option value="">Select Status</option>

                  {statusOptions.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-10 flex justify-end gap-4">
                <button
                  className=" bg-green-600 py-2 px-4 text-white rounded-lg cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Update Applicant"}
                </button>
                <DialogClose asChild>
                  <button
                    className="bg-black text-white py-2 px-4 rounded-lg cursor-pointer"
                    type="button"
                  >
                    Cancel
                  </button>
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
