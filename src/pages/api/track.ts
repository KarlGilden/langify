import { NextApiRequest, NextApiResponse } from "next";

interface ITrack{
  track_id: string;
  has_lyrics: string;
  has_richsync: string;
  has_translation: string;
}

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
            const track = {
              track_id: data.message.body.track.track_id,
              has_lyrics: data.message.body.track.has_lyrics,
              has_richsync: data.message.body.track.has_richsync
            }
            resolve(track)
        });
    })
}

async function getStandardLyrics(track:any) {
  console.log(track)
    return new Promise((resolve, reject)=>{
      fetch(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${track.track_id}&apikey=${process.env.MUSIXMATCH_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if(track.has_richsync){
          const lyrics = data.message.body.lyrics.lyrics_body
          resolve(lyrics)
          return;
        } 
        if(track.has_lyrics){
          const lyrics = data.message.body.lyrics.lyrics_body
          resolve(lyrics)
          return;
        }
        if(!track.has_lyrics){
          const lyrics = "No lyrics yet..."
          resolve(lyrics);
          return;
        }
      });
    })
}

async function getTranslation(text:string){
    return new Promise((resolve, reject)=>{

      if(text == "No lyrics yet...") {
        resolve("");
        return;
      }

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