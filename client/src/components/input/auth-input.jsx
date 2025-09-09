import React from 'react'

const AuthInput = ({label, placeholder, type, className, value, onChange, style}) => {
  return (
    <div className={className}>
      <label className='text-start'>{label}</label>
      <br />
      <input type={type} style={style} value={value} onChange={onChange} placeholder={placeholder} className='h-11 w-80 mt-2 px-4 border-1 border-gray-300 rounded-lg max-sm:w-70' />
    </div>
  )
}

export default AuthInput