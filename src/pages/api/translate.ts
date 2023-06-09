import { NextApiRequest, NextApiResponse } from "next";

export default async function translateHandler(req:NextApiRequest, res:NextApiResponse) {
    const text = req.body.text

    if(typeof text !== "string") return 
 
    detect(text).then((data:any)=>{
        if(data == "en") {
            res.status(200).json(text)
        }else{
            translate(data, text, res);
        }
    })
    
}

async function translate(source:string, text:string, res:NextApiResponse){
    let url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
    url += '&q=' + encodeURI(text);
    url += `&source=${source}`;
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
    .then((data) => {
        res.status(200).json(data.data.translations[0].translatedText);
    })
    .catch(error => {
      res.status(400).json(["There was an error with the translation request: " + error])
    });
}

async function detect(text:string){
    let url = `https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
    url += '&q=' + encodeURI(text);

    return new Promise((resolve, reject)=>{
        fetch(url, { 
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          })
          .then(res => res.json())
          .then((data) => {
            return resolve(data.data.detections[0][0].language)
          })
          .catch(error => {
            return reject("en")
          });
      });
}
