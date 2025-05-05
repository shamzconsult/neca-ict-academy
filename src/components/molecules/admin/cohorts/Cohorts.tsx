'use client';

import { CohortForm } from '@/components/atom/CohortForm';
import CohortTable from '@/components/atom/Table/CohortTable';
import EmptyState from '@/components/atom/EmptyState';
import { cohortTableHead } from '@/const';
import { CohortsProps, CohortType } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { HiOutlinePlusCircle } from 'react-icons/hi';
import Swal from 'sweetalert2';

export const Cohorts = ({ cohortsData: initialCohorts }: CohortsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [cohortsData, setCohortsData] = useState<CohortType[]>(initialCohorts || []);
  const [cohortToEdit, setCohortToEdit] = useState<CohortType | null>(null);
  const [isEditToggle, setIsEditToggle] = useState<number | null>(null);
  const [, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    applicationStartDate: '',
    applicationEndDate: '',
  });

  const router = useRouter();

  const handleRowClick = (slug: string) => {
    router.push(`/admin/cohorts/${slug}`);
  };

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
    if (cohortsData.some(cohort => cohort.active)) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: toast => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'error',
        title: 'There is an active cohort',
        theme: 'dark',
      });
    } else {
      setShowModal(!showModal);
    }
  };

  const handleDelete = async (slug: string, event: React.MouseEvent) => {
    event.stopPropagation();

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E02B20',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/cohort/${slug}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        console.error('Failed to delete cohort');
        Swal.fire('Error', 'Failed to delete the cohort.', 'error');
        return;
      }

      setCohortsData(prevCohort => prevCohort.filter(cohort => cohort.slug !== slug));

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: toast => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'success',
        title: 'Cohort deleted Successfully',
        theme: 'dark',
      });
    } catch (error) {
      console.error('Error deleting cohort: ', error);
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
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
    <div className='px-4 space-y-8 w-full pb-10'>
      <div className='flex flex-col md:flex-row gap-3 justify-between md:items-center p-4 bg-white mb-4'>
        <h1 className='md:text-[20px] font-medium'>Dashboard Overview</h1>
        <button
          onClick={checkAllCohortStatus}
          className='bg-[#E02B20] text-nowrap flex items-center gap-1 text-white px-6 py-2.5 rounded-md cursor-pointer'>
          <HiOutlinePlusCircle /> Create Cohort
        </button>
      </div>
      {cohortsData?.length > 0 ? (
        <div className='overflow-x-auto border border-[#C4C4C4]'>
          <CohortTable
            tableHead={cohortTableHead}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleRowClick={handleRowClick}
            tableData={cohortsData}
            action={true}
            isEditToggle={isEditToggle}
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
          cohortsData={cohortsData}
          cohortToEdit={cohortToEdit}
          setCohortToEdit={setCohortToEdit}
        />
      )}
    </div>
  );
};
