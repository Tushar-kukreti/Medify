import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctor } from '../app/searchSlice';
import Loading from './Loading';
import { man_img, woman_img } from '../assets/Doc/init';
import { fetchTimeSlots } from '../app/timeslotSlice';
import { createAppointment } from '../app/appointmentSlice';
import { toast } from 'react-toastify';

const defaultDescription = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur corporis eos eius similique dicta necessitatibus officiis unde magni saepe officia, consequatur suscipit delectus quis veniam excepturi velit voluptatum aspernatur! Libero.';

const DoctorDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedDoctor: doctor, loading } = useSelector((state) => state.search);
  const { slots, loading: loadingSlots } = useSelector((state) => state.timeslot);
  const { userInfo } = useSelector((state) => state.user);

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    if (id) dispatch(fetchDoctor(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (id && selectedDate) {
      dispatch(fetchTimeSlots({ date: selectedDate, doctorId: id }));
    }
  }, [id, selectedDate, dispatch]);

  const handleBooking = async (slotId) => {
    if (!userInfo) {
      toast.error("Please login to book a slot.");
      return;
    }
    await dispatch(createAppointment({ slotId }));
    dispatch(fetchTimeSlots({ date: selectedDate, doctorId: id }));
  };

  if (loading) return <Loading isLoading={1} text={"Loading..."} />;
  if (!doctor) return <Loading isLoading={0} text={"No Doctor Found"} />;

  const otherImg = (doctor.gender === 'female') ? woman_img : man_img;

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: d.toISOString().split('T')[0],
      label: d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    };
  });

  return (
    <div className="w-[90%] max-w-[1200px] mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-6">
      <div className='flex flex-col md:flex-row gap-6'>
        <div className='p-4 rounded-2xl bg-bg_sky w-fit max-w-[300px]'>
          <img
            src={(doctor.avatar && doctor.avatar !== '') ? doctor.avatar : otherImg}
            className='rounded-2xl'
            alt='Doctor Avatar'
          />
        </div>
        <div className='flex flex-col w-full border border-[rgba(0,0,0,0.2)] p-4 px-8 rounded-2xl'>
          <h2 className='text-2xl font-semibold'>{`Dr. ${doctor.fullName}`}</h2>
          <div className='flex flex-row gap-4'>
            <p>{doctor.certificationsName}</p>
            <p>{doctor.specialization}</p>
            <p>{`${doctor.experienceYears} Years`}</p>
          </div>
          <div className='mt-4'>
            <strong>About</strong>
            <p>{doctor.description?.trim() !== '' ? doctor.description : defaultDescription}</p>
          </div>
          <p className='mt-4'>
            <strong>Appointment Fees:</strong> {`\$${doctor.AppointmentFee}` || '$20'}
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className='mt-4'>
        <h3 className='text-xl font-semibold mb-3'>Available Time Slots</h3>
        <div className='mb-4'>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className='border border-gray-300 p-2 rounded-md shadow-sm'
          >
            {next7Days.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {loadingSlots ? (
          <p className="text-gray-500">Loading slots...</p>
        ) : slots.length === 0 ? (
          <p className="text-gray-500">No slots available for the selected date.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {slots.map((slot) => (
              <div key={slot._id} className="p-4 bg-blue-50 rounded-lg shadow-md flex flex-col items-center">
                <p className="font-medium text-gray-700">{slot.startTime} - {slot.endTime}</p>
                <button
                  onClick={() => handleBooking(slot._id)}
                  className="mt-2 px-3 py-1 bg-bg_sky hover:bg-bg_grey text-white rounded-md text-sm"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;