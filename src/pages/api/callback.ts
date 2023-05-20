import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
export default async function callback(req:NextApiRequest, res:NextApiResponse) {
    console.log("callback")
    var code = req.body.code || "";
    var state = req.body.state || null;
    const buffer = Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')

    const args = new URLSearchParams({
        error: 'state_mismatch'
    })
    console.log(code, state)
    if (state === null) {
        res.redirect('/#' + args);
        console.log("aaa")
    } else {

        var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: new URLSearchParams({
            code: typeof code === "string" ? code : "",
            redirect_uri: process.env.REDIRECT_URI ? process.env.REDIRECT_URI: "",
            grant_type: 'authorization_code'
        }),
        headers: {
            'Authorization': 'Basic ' + buffer
        },
        json: true
        };

        await fetch(authOptions.url, {
            method: "POST",
            body: authOptions.form + "",
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`,
              }
        
        })    
        .then(response => response.json())
        .then(data => {
            console.log("access token: " + data)

            res.status(200).send(data)
        })
        .catch(error => {
            console.log(error);
          });
    }
}
