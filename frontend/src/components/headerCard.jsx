import React from 'react';
import { nature1, nature2, nature3 } from '../assets/Doc/init';
import { useNavigate } from 'react-router-dom';

const headerCard = ({ title, data }) => {
  const navigate = useNavigate();
  function handleClickEvent(e) {
    e.preventDefault();
    if (data && data.link) navigate(data.link);
  }
  return (
<div className="mb-4 w-full bg-white rounded-2xl shadow-md p-6 flex flex-wrap mx-auto relative z-10">
  <div>
    <img
      src={nature1}
      alt=""
      className="absolute bottom-0 right-0 w-54 h-54 opacity-20 -z-10"
    />
    <img
      src={nature3}
      alt=""
      className="absolute top-0 left-0 rotate-180 w-54 h-54 opacity-20 -z-10"
    />

  </div>
  <h3 className="font-bold text-xl">{title}</h3>
  <div className="flex flex-wrap justify-around opacity-80 sm:justify-between items-center gap-4 mt-4">
    {data.map((item, index) => (
      <div
        key={index}
        onClick={handleClickEvent}
        className="cursor-pointer flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md
                   basis-[30%] grow shrink min-h-[220px] hover:opacity-70 duration-200 transition-all"
      >
        <div className={`text-5xl ${item.color ? `text-[${item.color}]` : 'text-bg_sky'} mb-2`}>
          {item.icon}
        </div>
        {item.title && <h3 className="font-semibold text-lg text-center">{item.title}</h3>}
        {item.desc && <p className="text-sm text-gray-600 text-center mt-2">{item.desc}</p>}
      </div>
    ))}
  </div>
</div>

  );
};

export default headerCard;
