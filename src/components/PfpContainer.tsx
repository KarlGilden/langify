import React from 'react'
import Image from 'next/image'

interface IProps{
    loading: boolean;
    user: any;
}

const PfpContainer = ({loading, user}:IProps) => {
  return (
    <div className="w-[100%] max-w-[100px] h-[100px] rounded-full bg-spotify-gray relative">
    {!loading &&
        <Image className="rounded-full" alt="r" fill={true} src={user?.images[0].url}></Image>
    }
</div>
  )
}

export default PfpContainer