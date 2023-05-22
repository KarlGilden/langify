import React from 'react'
import Image from 'next/image'

interface IProps {
    loadingUser:boolean,
    loadingPlaylist:boolean,
    user:any,
    userPlaylists:any,
    logout: ()=>void,
    handleClickPlaylist: (id:string, name:string)=>void
}

const Profile = ({user, userPlaylists, logout, handleClickPlaylist, loadingUser, loadingPlaylist}:IProps) => {
  return (
<div className="flex w-[80%]">
    {!loadingUser &&
    <div className='w-full'>
        <div className="flex items-center">
            <div className="w-[100px] h-[100px] rounded-full"><Image className="rounded-full" alt="profile" height={100} width={100} src={user?.images[0].url}></Image></div>
            <div className="p-2"></div>
            <div className="flex items-end">
                <h2 className="text-white text-3xl font-bold leading-none">{user?.display_name}</h2>
                <div className="p-1"></div>
                <small className="leading-none text-white font-bold">{user?.country}</small>
            </div>
        </div>
        <div className="p-2"></div>
        <small onClick={()=>logout()} className="text-white p-1 rounded-full font-bold">Sign out</small>
    </div>
    }
    {loadingUser &&
        <div className='flex justify-center items-center w-full'>
            loading...
        </div>
    }
    
    <div className="p-5"></div>

    {!loadingPlaylist && 
        <div className="h-[150px] w-full bg-spotify-gray rounded-sm overflow-y-scroll">
            {userPlaylists?.items?.map((value:any, index:number)=>{
            return <div onClick={()=>{handleClickPlaylist(value.id, value.name)}} className="p-1 text-white border-b-[1px] border-spotify-lightgray text-sm cursor-pointer hover:bg-spotify-black" key={index}>{value.name}</div>
            })}
        </div>
    }
    {loadingPlaylist &&
        <div className='flex justify-center items-center h-[150px] w-full bg-spotify-gray rounded-sm overflow-y-scroll'>
            loading...
        </div>
    }

    </div>
  )
}

export default Profile