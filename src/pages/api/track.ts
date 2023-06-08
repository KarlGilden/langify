import { NextApiRequest, NextApiResponse } from "next";

export default async function trackHandler(req:NextApiRequest, res:NextApiResponse) {
    const accessToken = req.body.accessToken;
    const trackId = req.body.id;

    let returnValue = {original:"", translation:""};

    getIsrc(trackId, accessToken).then((data:any)=>{
        getTrackId(data.external_ids.isrc).then((data:any)=>{
            getStandardLyrics(data).then((data:any)=>{
                returnValue.original = data
                getTranslation(data).then((data:any)=>{
                    returnValue.translation = data;
                    res.status(200).json(returnValue);
                  })
            })
        })
    });
}

const getIsrc = async (trackId:string, accessToken:string) => {
    return new Promise((resolve, reject)=>{
        fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
              Authorization: 'Bearer ' + accessToken
            }
          })
          .then(res => res.json())
          .then(data => {
            resolve(data)
          })  
    })
}

const getTrackId = (isrc:string) => {
    return new Promise((resolve,reject)=>{
        fetch(`http://api.musixmatch.com/ws/1.1/track.get?track_isrc=${isrc}&apikey=${process.env.MUSIXMATCH_API_KEY}`)
        .then(res => res.json())
        .then(data => {
            resolve(data.message.body.track.track_id)
        });
    })
}

async function getStandardLyrics(id:number) {
    return new Promise((resolve, reject)=>{
      fetch(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${id}&apikey=${process.env.MUSIXMATCH_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const lyrics = data.message.body.lyrics.lyrics_body
        resolve(lyrics)
      });
    })
}

async function getTranslation(text:string){
    return new Promise((resolve, reject)=>{
      fetch(`${process.env.URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text})
      })
      .then(res=>res.json())
      .then(data=>{
        resolve(data);
      })
      .catch(error=> {
        resolve(error)
      })
    })
}