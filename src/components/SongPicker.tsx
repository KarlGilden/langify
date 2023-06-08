import React, { Dispatch, SetStateAction, useState } from 'react'
import {BiArrowBack} from 'react-icons/bi'
import ArtistsContainer from './ArtistsContainer'
interface IProps{
    loading: boolean;
    loadingTrack: boolean;

    playlist: any;
    display:boolean;
    title:string;

    setDisplay: Dispatch<SetStateAction<boolean>>;
    setTrack: Dispatch<SetStateAction<any>>;
    handleClickTrack: (id:string)=>void;
}

const SongPicker = ({loading, loadingTrack, playlist, title, display, setDisplay, handleClickTrack}:IProps) => {

  return (
    <div className={`${!display ? "hidden" : ""} fixed flex justify-center items-center top-0 left-0 bottom-0 w-full h-screen bg-blur`}>
        <div className='bg-spotify-black w-[50%] h-[50%] flex flex-col rounded-sm'>
           
            <div className='p-3 flex text-white font-bold'>
                <p className='text-white text-2xl cursor-pointer' onClick={()=>setDisplay(false)}><BiArrowBack/></p>
                <div className='p-2'></div>
                <h1>{title}</h1>
            </div>

            {!loading && !loadingTrack ? 
                <div className='overflow-y-scroll h-full' >
                    {playlist?.items?.map((value:any,index:number)=>{
                        return <div onClick={()=>{handleClickTrack(value.track.id)}} key={index} className='text-white flex items-end text-sm px-3 py-2 border-b-[1px] border-spotify-lightgray hover:bg-spotify-gray cursor-pointer'>
                                    <p className='leading-none'>{value.track.name}</p>
                                    <div className='p-1'></div>
                                    <ArtistsContainer artists={value.track.artists}/>
                                </div>
                    })}
                </div>
                :
                <div className='w-full h-full flex justify-center items-center'>
                    <p className='text-white'>
                        Loading...
                    </p>
                </div>
            }
        </div>
    </div>
  )
}

export default SongPicker