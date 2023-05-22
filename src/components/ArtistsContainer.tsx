import React from 'react'

interface IProps {
    artists:any[]
}
const ArtistsContainer = ({artists}:IProps) => {
  return (
    <div className='leading-none'>
        {artists.map((value:any,index:number)=>{
            return <small key={index} className='mr-1 text-spotify-lightgray leading-none'>{value.name}{index < (artists.length-1) && ","}</small>
        })}
    </div>
  )
}

export default ArtistsContainer