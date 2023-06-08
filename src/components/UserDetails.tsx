import React from 'react'

interface IProps{
    loading: boolean;
    user: any;
}

const UserDetails = ({loading, user}:IProps) => {
  return (
    <div className="w-full">
    {!loading ?
        <>
            <h2 className="text-white text-2xl font-bold leading-none">{user?.display_name}</h2>
            <div className="p-1"></div>
            <small className="leading-none text-white font-bold">{user?.country}</small>
        </>
        :
        <div>
            <div className='bg-spotify-gray w-[50%] p-5 rounded-md'></div>
            <div className='p-1'></div>
            <div className='bg-spotify-gray w-[100%] p-5 rounded-md'></div>
        </div>
    }
</div>
  )
}

export default UserDetails