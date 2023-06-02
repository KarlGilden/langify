import { type NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import SpotifyPlayer from 'react-spotify-web-playback';
import SongPicker from "~/components/SongPicker";
import ArtistsContainer from "~/components/ArtistsContainer";
import Profile from "~/components/Profile";
const Home: NextPage = () => {

  // state token
  const [token, setToken] = useState<string>("");

  // state
  const [user, setUser] = useState<any>({images: [{url:""}]});
  const [userPlaylists, setUserPlaylists] = useState<any>({});
  const [showSongPicker, setShowSongPicker] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<any>("");
  const [currentPlaylistName, setCurrentPlaylistName] = useState<string>("");
  const [currentTrack, setCurrentTrack] = useState<any>();
  const [currentLyrics, setCurrentLyrics] = useState<string>("");
  const [currentTranslation, setCurrentTranslation] = useState<string>("");
  const [player, setPlayer] = useState<Spotify.Player>();

  // loading states
  const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [loadingTrack, setLoadingTrack] = useState<boolean>(false);
  const [loadingTranslation, setLoadingTranslation] = useState<boolean>(false);

  useEffect(()=>{
    const t = localStorage.getItem("access_token")
    if(t){
      setToken(t || "")
      getProfile()
      getUserPlaylists()
      setPlayer(player)
    }
    else if(window.location.search.split("?").length > 1){
      getToken()
    }
  }, []);

  // data fetching functions

  async function getProfile() {
    setLoadingUser(true)

    let accessToken = localStorage.getItem('access_token');

    await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        accessToken: accessToken
      })
    })
    .then(res=>res.json())
    .then(data=>{
      setUser(data)
      setLoadingUser(false)
    })
  };

  async function getUserPlaylists() {
    let accessToken = localStorage.getItem('access_token');
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setUserPlaylists(data)
    });
  };

  async function getPlaylistTracks(playlistid:string){
    setLoadingPlaylist(true)
    let accessToken = localStorage.getItem('access_token');
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistid}/tracks`, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setCurrentPlaylist(data)
      setLoadingPlaylist(false)
    });
  };

  async function getTrack(id:string){

    setLoadingTrack(true)
    let accessToken = localStorage.getItem('access_token');

    const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
    .then(res => res.json())
    .then(data => {

      // get lyrics
      getLyricsByTrackId(data.external_ids.isrc)

      // update global state 
      setCurrentTrack(data)

      // set UI state
      setShowSongPicker(false)
      setLoadingTrack(false)

    });
  };

  async function getLyricsByTrackId(isrc:string){

    const response = await fetch('/api/getLyricsByTrackId',{
        method: 'POST',
        body: JSON.stringify({isrc}),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {

        const lyrics = data.lyrics.lyrics_body;

        // update global state
        setCurrentLyrics(lyrics);

        // get translation
        getLyricsTranslation(lyrics);

    });
  };

  async function getLyricsTranslation(text:string){
    await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({text})
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      setCurrentTranslation(data.data.translations[0].translatedText)
    })
    .catch(error=> {
      setCurrentTranslation(error);
    })

  };

  // click handlers
  
  const handleClickPlaylist = (id:string, name:string) => {
    setShowSongPicker(true)
    setCurrentPlaylistName(name)
    setCurrentPlaylist(id)
    getPlaylistTracks(id)
  };

  // auth functions

  const getToken = async () => {
    const params = new URLSearchParams(window.location.search);
    console.log("code: " + params.get("code"))
    console.log("state: " + params.get("state"))
    await fetch("/api/callback", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: params.get("code"),
        state: params.get("state")
      })
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("access_token", data.access_token)
      setToken(data.access_token)
      window.location.search = ""
      getProfile()
      getUserPlaylists()
    })
  };

  const login = () => {
    console.log("hello")
    fetch("/api/login", {

    })
    .then(res=>res.json())
    .then(data=> {
      window.location.assign(data.url)
    })
    .catch(e=>{
      console.log(e)
    })
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("access_token")
  };

  return (
    <>
      <Head>
        <title>Langify</title>
        <meta name="description" content="Translate songs in real time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SongPicker display={showSongPicker} setDisplay={setShowSongPicker} loading={loadingPlaylist} loadingTrack={loadingTrack} playlist={currentPlaylist} title={currentPlaylistName} setTrack={setCurrentTrack} getTrack={getTrack}/>
      
      <main className="bg-spotify-black min-h-screen px-16 lg:px-48 py-5">
        <div className="p-10 flex justify-center w-full">
          {token ? 
            <Profile loadingUser={loadingUser} loadingPlaylist={loadingPlaylists} user={user} userPlaylists={userPlaylists} logout={logout} handleClickPlaylist={handleClickPlaylist}/>
            :
            <button onClick={()=>login()} className="bg-white w-[125px] p-4 rounded-full font-bold hover:scale-105">Log in</button>
          }
        </div>

        {/* <SpotifyPlayer
        token={token} uris={currentTrack?.uri}  
        styles={{
          activeColor: 'transparent',
          bgColor: '#3333330',
          color: '#fff',
          loaderColor: '#fff',
          sliderColor: '#1cb954',
          trackArtistColor: '#ccc',
          trackNameColor: '#fff',
        }} 
         /> */}

        <div className="flex">
          <div className="w-[100%] p-5 bg-spotify-green rounded-2xl font-extrabold">
            {currentLyrics.split(`\n`).map((value:string, index:number)=>{
              return <p key={index}>{value}</p>
            })}
          </div>
          <div className="p-2"></div>
          <div className="w-[100%] p-5 bg-gray-200 rounded-2xl">
            {currentTranslation}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
