import { NextApiRequest, NextApiResponse } from "next";

export default async function translateHandler(req:NextApiRequest, res:NextApiResponse) {
    const text = req.body.text
    console.log(text)

    if(typeof text !== "string") return 

    let url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
    url += '&q=' + encodeURI(text);
    url += `&source=${"es"}`;
    url += `&target=${"en"}`;
    url += `&format=text`

    fetch(url, { 
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(res => res.json())
    .then((response) => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json({error:"There was an error with the translation request: " + error})
    });
    
}
