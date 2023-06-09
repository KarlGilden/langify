import React from 'react'
import ArtistsContainer from './ArtistsContainer';

interface IProps{
    handleClickTrack: (id:string) =>void;
    track:any;
}

const TrackListItem = ({handleClickTrack, track}:IProps) => {
  return (
    <div onClick={()=>{handleClickTrack(track.track.id)}} className='text-white flex items-end text-sm px-3 py-2 border-b-[1px] border-spotify-lightgray hover:bg-spotify-gray cursor-pointer'>
        <p className='leading-none'>{track.track.name}</p>
        <div className='p-1'></div>
        <ArtistsContainer artists={track.track.artists}/>
    </div>
  )
}

export default TrackListItem