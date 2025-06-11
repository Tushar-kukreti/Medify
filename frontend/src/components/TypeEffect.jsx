import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const TypingEffect = () => {
  const el = useRef(null);   // Element reference
  const typed = useRef(null); // Typed instance reference

  useEffect(() => {
    const options = {
      strings: [
        'Health',
        'Well Being',
        'Future',
        'Priority',
        'Responsibility',
      ],
      typeSpeed: 100,
      backSpeed: 80,
      backDelay: 1000,
      loop: true,
    };

    typed.current = new Typed(el.current, options);

    return () => {
      typed.current.destroy(); // Cleanup
    };
  }, []);

  return (
    <span
      id="runningText"
      ref={el}
      className="text-lg font-bold text-gray-700"
    ></span>
  );
};

export default TypingEffect;
