import React, { useEffect, useState } from 'react';
import { RiSearch2Line } from "react-icons/ri";
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { DOCTOR_GROUPING } from '../constants.js';
import { useDispatch, useSelector } from 'react-redux';
import { searchDoctors } from '../app/searchSlice.js';
import { Link } from 'react-router-dom';
import Loading from './Loading.jsx';
import { avatar1, man_img, woman_img } from '../assets/Doc/init.js';

// Sidebar for filters
const Sidebar = ({ onFilter }) => {
  const [openCategory, setOpenCategory] = useState(null);

  const handleSelect = (groupId, specialization) => {
    onFilter({ groupId, specialization });
  };

  return (
    <div className='max-w-[300px] h-full bg-bg_white p-6'>
      <h2 className='text-xl font-bold mb-4'>Doctor Categories</h2>
      <ul className='space-y-2 mt-8'>
        {DOCTOR_GROUPING.map((group, index) => (
          <li key={group.groupId}>
            <div
              className='flex justify-between items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100'
              onClick={() => {
                // setOpenCategory(openCategory === index ? null : index);
                // (!openCategory) ? handleSelect(group.groupId, null) : handleSelect(null, null);
                setOpenCategory((prev) => {
                  if (prev === index) handleSelect(null, null);
                  else handleSelect(group.groupId, null)
                  return (prev === index) ? null : index;
                })
              }}
            >
              <span className='font-semibold'>{group.category}</span>
              {openCategory === index ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {openCategory === index && (
              <ul className='pl-4 mt-2 space-y-1'>
                {group.specializations.map((spec, specIndex) => (
                  <li
                    key={specIndex}
                    className="cursor-pointer hover:text-blue-500 transition"
                    onClick={() => handleSelect(group.groupId, spec.toLowerCase())}
                  >
                    {spec}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AllDoctors = () => {
  const dispatch = useDispatch();
  const { doctors, pagination = {} } = useSelector((state) => state.search);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    groupId: '',
    specialization: '',
    page: 1,
    limit: 6,
    sortBy: 'fullName',
    order: 'asc',
  });

  useEffect(() => {
    dispatch(searchDoctors(filters));
  }, [filters]);

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, name: searchQuery, page: 1 }));
  };

  const handleFilter = ({ groupId, specialization }) => {
    setFilters((prev) => ({
      ...prev,
      groupId,
      specialization,
      page: 1,
    }));
  };

  const handlePageChange = (next) => {
    const newPage = filters.page + next;
    if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
      setFilters({ ...filters, page: newPage });
    }
  };

  return (
    <div className='min-h-screen bg-bg_white'>
      <div className='flex flex-row justify-around w-full'>
        <Sidebar onFilter={handleFilter} />

        <div className='w-full p-6'>
          <h1 className='text-2xl font-bold text-bg_sky mb-4'>Find Your Doctor</h1>

          {/* Search Bar */}
          <div className='flex flex-col md:flex-row items-baseline gap-1'>
            <input
              type="text"
              placeholder="Search by Doctor's Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bg_sky transition-colors mb-4 md:mb-0 md:mr-4'
            />
            <button
              onClick={handleSearch}
              className='mt-4 bg-bg_sky text-white font-semibold px-6 py-4 rounded-lg hover:bg-gray-100 transition-colors'
            >
              <RiSearch2Line />
            </button>
          </div>

          {/* Doctor Cards */}
          <div className='mt-6 rounded-lg bg-bg_dim_sky p-6 w-full flex flex-wrap justify-center gap-4'>
            {doctors?.length > 0 ? (
              doctors.map((doc) => (
                <div
                  key={doc._id}
                  className='bg-white p-4 rounded shadow w-full sm:w-[250px] text-center'
                >
                  <img
                    src={doc.avatar || ((doc.gender === 'female') ? woman_img : man_img)}
                    alt="doctor avatar"
                    className='w-20 h-20 rounded-full mx-auto mb-2 object-cover'
                  />
                  <h3 className='font-bold'>{`Dr. ${doc.fullName}`}</h3>
                  <p className='text-sm text-gray-500'>{doc.specialization}</p>
                  <Link to={`/doctor/${doc._id}`}>
                    <button className='px-2 py-2 bg-bg_sky text-white cursor-pointer hover:bg-bg_grey transition-colors rounded-lg mt-4'>
                      View Profile
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <div className='w-[60%]'>
                <Loading isLoading={0} text={"No Doctors Found."}/>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className='flex justify-between items-center mt-6'>
            <button
              onClick={() => handlePageChange(-1)}
              disabled={filters.page <= 1}
              className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'
            >
              Previous
            </button>
            <p className='text-sm'>
              Page <strong>{pagination?.currentPage || 1}</strong> of{' '}
              <strong>{pagination?.totalPages || 1}</strong>
            </p>
            <button
              onClick={() => handlePageChange(1)}
              disabled={filters.page >= pagination?.totalPages}
              className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50'
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDoctors;
