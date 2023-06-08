import React from 'react'

interface IProps {
    loading: boolean;
    userPlaylists:any;
    handleClickPlaylist: (id:string, name:string)=>void;
}

const PlaylistList = ({userPlaylists, handleClickPlaylist, loading}:IProps) => {
  return (
    <div className="h-[150px] w-full bg-spotify-gray rounded-sm overflow-y-scroll">
        {userPlaylists?.items?.map((value:any, index:number)=>{
            return <div onClick={()=>{handleClickPlaylist(value.id, value.name)}} className="p-1 text-white border-b-[1px] border-spotify-lightgray text-sm cursor-pointer hover:bg-spotify-black" key={index}>{value.name}</div>
        })}
    </div>
  )
}

export default PlaylistList