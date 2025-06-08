"use client";

import { CohortForm } from "@/components/atom/CohortForm";
import CohortTable from "@/components/atom/Table/CohortTable";
import EmptyState from "@/components/atom/EmptyState";
import { cohortTableHead } from "@/const";
import { CohortsProps, CohortType } from "@/types";
import React, { useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminSectionHeader } from "@/components/atom/AdminSectionHeader";

export const Cohorts = ({ cohortsData: initialCohorts }: CohortsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [cohortsData, setCohortsData] = useState<CohortType[]>(
    initialCohorts || []
  );
  const [cohortToEdit, setCohortToEdit] = useState<CohortType | null>(null);
  const [isEditToggle, setIsEditToggle] = useState<number | null>(null);
  const [, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    applicationStartDate: "",
    applicationEndDate: "",
  });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleEditToggle = (id: number | null) => {
    if (id === isEditToggle) {
      setIsEditToggle(null);
      return;
    }
    setIsEditToggle(id);
  };

  const checkAllCohortStatus = () => {
    setShowModal(!showModal);
  };

  const handleEdit = (cohort: CohortType, event: React.MouseEvent) => {
    event.stopPropagation();
    if (setCohortToEdit && setFormData && setShowModal) {
      setCohortToEdit(cohort);
      setFormData({
        name: cohort.name,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        applicationStartDate: cohort.applicationStartDate,
        applicationEndDate: cohort.applicationEndDate,
      });
      setShowModal(true);
    }
  };
  return (
    <>
      <AdminSectionHeader
        title='Cohort Overview'
        cta={
          <>
            <Button
              onClick={checkAllCohortStatus}
              className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
            >
              <HiOutlinePlusCircle /> Create Cohort
            </Button>

            <Button
              variant='outline'
              asChild
              className='flex items-center gap-2 transition-colors'
            >
              <Link href='/enroll' target='_blank'>
                <ExternalLink />
                Go to Enroll Portal
              </Link>
            </Button>
          </>
        }
      />
      <hr className='border-gray-200 mb-4' />
      {cohortsData?.length > 0 ? (
        <div className='overflow-x-auto border border-[#C4C4C4] rounded-lg'>
          <CohortTable
            tableHead={cohortTableHead}
            handleEdit={handleEdit}
            tableData={cohortsData}
            action={true}
            handleEditToggle={handleEditToggle}
          />
        </div>
      ) : (
        <EmptyState
          title='No Cohort Created yet'
          message='Click on the create Cohort button to start'
        />
      )}
      {showModal && (
        <CohortForm
          toggleModal={toggleModal}
          setCohortsData={setCohortsData}
          cohortToEdit={cohortToEdit}
          setCohortToEdit={setCohortToEdit}
        />
      )}
    </>
  );
};
