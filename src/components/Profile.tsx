import React from 'react'
import PlaylistList from './PlaylistList'
import PfpContainer from './PfpContainer'
import UserDetails from './UserDetails'

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
<div className="flex md:w-[80%] w-[100%]">
    <div className='w-full'>
        <div className="flex items-center justify-center">

            <PfpContainer loading={loadingUser} user={user}/>

            <div className='p-2'></div>

            <UserDetails loading={loadingUser} user={user}/>

        </div>

        <div className="p-2"></div>

        <small onClick={()=>logout()} className="text-white p-1 rounded-full font-bold">Sign out</small>
    </div>
    
    <div className="p-2"></div>

        <PlaylistList loading={loadingPlaylist} handleClickPlaylist={handleClickPlaylist} userPlaylists={userPlaylists}/>
    
    </div>
  )
}

export default Profile