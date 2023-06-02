import { NextApiRequest, NextApiResponse } from "next";

export default async function getLyricsByTrackId(req:NextApiRequest, res:NextApiResponse) {
    const isrc = req.body.isrc
    const response = await fetch(`http://api.musixmatch.com/ws/1.1/track.get?track_isrc=${isrc}&apikey=${process.env.MUSIXMATCH_API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const track = data.message.body.track

      if(track.has_richsync){
        getRichSyncLyrics(track.track_id, res)
      }else if(track.has_lyrics){
        getStandardLyrics(track.track_id, res)
      }else{
        res.send({lyrics:{lyrics_body:"no lyrics yet..."}})
      }
    });
  }

async function getStandardLyrics(id:number, res:NextApiResponse) {
  const response = await fetch(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${id}&apikey=${process.env.MUSIXMATCH_API_KEY}`)
  .then(res => res.json())
  .then(data => {
    res.send(data.message.body)
  });
}

async function getRichSyncLyrics(id:number, res:NextApiResponse) {
  const response = await fetch(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${id}&apikey=${process.env.MUSIXMATCH_API_KEY}`)
  .then(res => res.json())
  .then(data => {
    res.send(data.message.body)
  });
}
