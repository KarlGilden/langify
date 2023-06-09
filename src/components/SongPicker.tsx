import React, { Dispatch, SetStateAction, useState } from 'react'
import {BiArrowBack} from 'react-icons/bi'
import ArtistsContainer from './ArtistsContainer'
import TrackListItem from './TrackListItem';
interface IProps{
    loading: boolean;
    loadingTrack: boolean;

    playlist: any;
    display:boolean;
    title:string;

    setDisplay: Dispatch<SetStateAction<boolean>>;
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

                <div className={`overflow-y-scroll w-full h-full ${loading && ' flex justify-center items-center'}`}>
                    {!loading ? 
                        <>
                        {playlist?.items?.map((value:any,index:number)=>{
                            return <TrackListItem key={index} track={value} handleClickTrack={handleClickTrack}/>
                        })}
                        </>
                        :
                        <p className='text-white'>Loading...</p>
                        }
                </div>
        </div>
    </div>
  )
}

export default SongPicker