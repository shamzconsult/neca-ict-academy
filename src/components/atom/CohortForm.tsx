import { CohortType } from "@/types";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CohortForm = ({
  toggleModal,
  setCohortsData,
  cohortToEdit,
  setCohortToEdit,
  cohortsData,
}: {
  toggleModal: () => void;
  cohortToEdit?: CohortType | null;
  cohortsData: CohortType[];
  setCohortsData: Dispatch<SetStateAction<CohortType[]>>;
  setCohortToEdit?: (cohort: CohortType | null) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    active: true,
    applicationStartDate: "",
    applicationEndDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("active", formData.active.toString());
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append(
      "applicationStartDate",
      formData.applicationStartDate
    );
    formDataToSend.append("applicationEndDate", formData.applicationEndDate);

    try {
      const res = await fetch("/api/cohorts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        console.error("Failed to upload cohort:", await res.text());
        return;
      }

      const responseData = await res.json();
      setCohortsData((prevCohort) => [...prevCohort, responseData.newCohort]);

      toast.success("Cohort Created Successfully 🎉🎉");

      toggleModal();
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        active: true,
        applicationStartDate: "",
        applicationEndDate: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cohortToEdit) return;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("startDate", formData.startDate);
    formDataToSend.append("active", formData.active.toString());
    formDataToSend.append("endDate", formData.endDate);
    formDataToSend.append(
      "applicationStartDate",
      formData.applicationStartDate
    );
    formDataToSend.append("applicationEndDate", formData.applicationEndDate);

    if (
      cohortsData.some(
        (cohort) => cohort.active && cohortToEdit.active !== cohort.active
      )
    ) {
      toast.error("There is an active cohort");
    } else {
      try {
        setLoading(true);
        const res = await fetch(`/api/cohorts/${cohortToEdit.slug}`, {
          method: "PUT",
          body: formDataToSend,
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error updating course:", errorText);
          return;
        }

        const responseData = await res.json();

        setCohortsData((prev) =>
          prev.map((cohort) =>
            cohort.slug === cohortToEdit.slug
              ? responseData.updatedCohort
              : cohort
          )
        );

        toast.success("Cohort Updated Successfully 🎉");

        setCohortToEdit?.(null);
        setFormData({
          name: "",
          startDate: "",
          endDate: "",
          active: formData.active,
          applicationStartDate: "",
          applicationEndDate: "",
        });
        toggleModal();
      } catch (error) {
        console.error("Error updating course:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (cohortToEdit) {
      setFormData({
        name: cohortToEdit.name,
        startDate: cohortToEdit.startDate,
        endDate: cohortToEdit.endDate,
        active: cohortToEdit.active,
        applicationStartDate: cohortToEdit.applicationStartDate,
        applicationEndDate: cohortToEdit.applicationEndDate,
      });
    }
  }, [cohortToEdit]);
  return (
    <Dialog
      open
      onOpenChange={(openState) => {
        if (!openState) {
          toggleModal();
        }
      }}
    >
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {cohortToEdit ? "Updating Cohort" : "Create Cohort"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={cohortToEdit ? handleUpdate : handleSubmit}
          className='space-y-6'
        >
          <div className='space-y-2'>
            <Label htmlFor='name'>Cohort Name</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              placeholder='Enter cohort name'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='active'>Status</Label>
            <Select
              value={formData.active ? "true" : "false"}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, active: val === "true" }))
              }
              name='active'
              required
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='true'>Active</SelectItem>
                <SelectItem value='false'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 space-y-2'>
              <Label>Application Start Date</Label>
              <DatePicker
                value={
                  formData.applicationStartDate
                    ? new Date(formData.applicationStartDate)
                    : undefined
                }
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    applicationStartDate: date
                      ? date.toISOString().slice(0, 10)
                      : "",
                  }))
                }
                placeholder='Pick a date'
                className='w-full'
              />
            </div>
            <div className='flex-1 space-y-2'>
              <Label>Application End Date</Label>
              <DatePicker
                value={
                  formData.applicationEndDate
                    ? new Date(formData.applicationEndDate)
                    : undefined
                }
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    applicationEndDate: date
                      ? date.toISOString().slice(0, 10)
                      : "",
                  }))
                }
                placeholder='Pick a date'
                className='w-full'
              />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1 space-y-2'>
              <Label>Cohort Start Date</Label>
              <DatePicker
                value={
                  formData.startDate ? new Date(formData.startDate) : undefined
                }
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: date ? date.toISOString().slice(0, 10) : "",
                  }))
                }
                placeholder='Pick a date'
                className='w-full'
              />
            </div>
            <div className='flex-1 space-y-2'>
              <Label>Cohort End Date</Label>
              <DatePicker
                value={
                  formData.endDate ? new Date(formData.endDate) : undefined
                }
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: date ? date.toISOString().slice(0, 10) : "",
                  }))
                }
                placeholder='Pick a date'
                className='w-full'
              />
            </div>
          </div>

          <DialogFooter className='w-full flex flex-col md:flex-row gap-2 mt-6'>
            <Button
              type='submit'
              disabled={loading}
              className='w-full md:w-auto'
            >
              {loading
                ? "Loading..."
                : cohortToEdit
                  ? "Update Cohort"
                  : "Create Cohort"}
            </Button>
            <Button
              variant='destructive'
              type='button'
              onClick={() => {
                toggleModal();
                setCohortToEdit?.(null);
                setFormData({
                  name: "",
                  startDate: "",
                  active: formData.active,
                  endDate: "",
                  applicationStartDate: "",
                  applicationEndDate: "",
                });
              }}
              className='w-full md:w-auto'
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
