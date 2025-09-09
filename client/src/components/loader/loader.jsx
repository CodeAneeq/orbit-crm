import React from 'react';
import { HashLoader } from 'react-spinners';

const Loader = ({ fullScreen = false }) => {
  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 flex justify-center items-center bg-white z-50'
          : 'flex justify-center items-center'
      }
    >
      <HashLoader size={fullScreen ? 100 : 50} color='#000000' speedMultiplier={1.6} />
    </div>
  );
};

export default Loader;
