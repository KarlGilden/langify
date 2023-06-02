import { NextApiRequest, NextApiResponse } from "next";

export default async function userHandler(req:NextApiRequest, res:NextApiResponse) {
    const accessToken = req.body.accessToken;
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      res.send(data);
    });
  }
