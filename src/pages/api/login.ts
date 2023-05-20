import { NextApiRequest, NextApiResponse } from "next";

export default function login(req:NextApiRequest, res:NextApiResponse) {
    var state = generateRandomString(16);
    console.log("hello")
    var scope = 'user-read-private user-read-email';
    const args = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.CLIENT_ID ? process.env.CLIENT_ID : "",
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI ? process.env.REDIRECT_URI : "",
        state: state
      })
    res.send({url:'https://accounts.spotify.com/authorize?'+args});
  }

  var generateRandomString = function(length:number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };