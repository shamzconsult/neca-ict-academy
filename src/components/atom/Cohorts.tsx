import { CohortType } from "@/types";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { CohortForm } from "./CohortForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Cohorts = () => {
  const [showModal, setShowModal] = useState(false);
  const [cohortToEdit, setCohortToEdit] = useState<CohortType | null>(null);
  const queryClient = useQueryClient();

  const { data: cohortsData = [], isLoading } = useQuery<CohortType[]>({
    queryKey: ["cohorts"],
    queryFn: async () => {
      const res = await fetch("/api/cohorts");
      if (!res.ok) throw new Error("Failed to fetch cohorts");
      return res.json();
    },
  });

  const deleteCohort = useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/cohorts/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete cohort");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cohorts"] });
      toast.success("Cohort deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete cohort");
      console.error("Error deleting cohort:", error);
    },
  });

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setCohortToEdit(null);
    }
  };

  const handleEdit = (cohort: CohortType) => {
    setCohortToEdit(cohort);
    setShowModal(true);
  };

  const handleDelete = (slug: string) => {
    if (window.confirm("Are you sure you want to delete this cohort?")) {
      deleteCohort.mutate(slug);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Cohorts</h1>
        <Button onClick={toggleModal}>Create Cohort</Button>
      </div>

      <div className='grid gap-4'>
        {cohortsData.map((cohort) => (
          <div
            key={cohort._id}
            className='border rounded-lg p-4 flex justify-between items-center'
          >
            <div>
              <h2 className='text-xl font-semibold'>{cohort.name}</h2>
              <p className='text-gray-600'>
                {new Date(cohort.startDate).toLocaleDateString()} -{" "}
                {new Date(cohort.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => handleEdit(cohort)}>
                Edit
              </Button>
              <Button
                variant='destructive'
                onClick={() => handleDelete(cohort.slug)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CohortForm
          toggleModal={toggleModal}
          setCohortsData={(data) => queryClient.setQueryData(["cohorts"], data)}
          cohortToEdit={cohortToEdit}
          setCohortToEdit={setCohortToEdit}
        />
      )}
    </div>
  );
};
