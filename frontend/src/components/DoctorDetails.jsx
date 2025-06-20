import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctor } from '../app/searchSlice';
import Loading from './Loading';
import { useState } from 'react';
import { man_img, woman_img } from '../assets/Doc/init';
const defaultDescription = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur corporis eos eius similique dicta necessitatibus officiis unde magni saepe officia, consequatur suscipit delectus quis veniam excepturi velit voluptatum aspernatur! Libero.';

const DoctorDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedDoctor: doctor, loading } = useSelector((state) => state.search);

  useEffect(() => {
    if (id) dispatch(fetchDoctor(id));
  }, [id, dispatch]);

  if (loading) return <Loading isLoading={1} text={"Loading..."} />;
  if (!doctor) return <Loading isLoading={0} text={"No Doctor Found"} />;

  const otherImg = (doctor.gender === 'female') ? woman_img : man_img;
  return (
    <div className="w-[90%] max-w-[1200px] mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg flex flex-col md:flex-row gap-6">
        <div className='w-full flex flex-row justify-start gap-6'>
            <div className='p-4 rounded-2xl bg-bg_sky w-fit max-w-[300px]'>
                <img
                    src={(doctor.avatar && doctor.avatar !== '') ? doctor.avatar : otherImg}
                    className='rounded-2xl'
                    alt=''
                /> 
            </div>
            <div className='flex flex-col w-full border border-[rgba(0,0,0,0.2)] p-4 px-8 rounded-2xl'>
                <h2 className='text-2xl font-semibold'>{`Dr. ${doctor.fullName}`}</h2>
                <div className='flex flex-row gap-4'>
                    <p>{`${doctor.certificationsName}`}</p>
                    <p>{doctor.specialization}</p>
                    <p>{`${doctor.experienceYears} Years`}</p>
                </div>
                <div className='mt-4'>
                    <strong>About</strong>
                    <p>{(doctor.description && doctor.description.trim() !== '') ? doctor.description : defaultDescription}</p>
                </div>
                <p className='mt-4'>
                    <strong>Appointment Fees:</strong> {` ${(doctor.AppointmentFee) ? doctor.AppointmentFee : `$20`}`}
                </p>
            </div>
        </div>
        {/* Booking Slots */}
    </div>
  );
};

export default DoctorDetails;
