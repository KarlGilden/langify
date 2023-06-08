import { type NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import SpotifyPlayer from 'react-spotify-web-playback';
import SongPicker from "~/components/SongPicker";
import Profile from "~/components/Profile";
const Home: NextPage = () => {

  // state token
  const [token, setToken] = useState<any>(null);

  // state
  const [user, setUser] = useState<any>({images: [{url:""}]});
  const [userPlaylists, setUserPlaylists] = useState<any>({});
  const [showSongPicker, setShowSongPicker] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<any>("");
  const [currentPlaylistName, setCurrentPlaylistName] = useState<string>("");
  const [currentTrack, setCurrentTrack] = useState<any>();
  const [currentLyrics, setCurrentLyrics] = useState<string[]>([""]);
  const [currentTranslation, setCurrentTranslation] = useState<string[]>([""]);
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
      setToken(t);
      loadInitData();
    }
    else if(window.location.search.split("?").length > 1){
      getToken()
      .then((data:any)=>{

        localStorage.setItem("access_token", JSON.stringify(data))
        setToken(data);

        loadInitData();

        window.location.search = "";
      })
    }
  }, []);

  // data fetching functions

  async function getProfile() {
    setLoadingUser(true)

    let accessToken = JSON.parse(localStorage.getItem('access_token') || "").access_token;

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
    .catch((e)=>{
      setToken(null)
    })
  };

  async function getUserPlaylists() {
    let accessToken = JSON.parse(localStorage.getItem('access_token') || "").access_token;
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
    let accessToken = JSON.parse(localStorage.getItem('access_token') || "").access_token;
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

    return new Promise((resolve, reject)=>{

      let accessToken = JSON.parse(localStorage.getItem('access_token') || "").access_token;

      fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          id: id,
          accessToken: accessToken
        })
      })
      .then(res => res.json())
      .then(data => {
        resolve(data)
      })    
      })
  };

  // click handlers
  
  const handleClickPlaylist = (id:string, name:string) => {
    setShowSongPicker(true)
    setCurrentPlaylistName(name)
    setCurrentPlaylist(id)
    getPlaylistTracks(id)
  };

  const handleClickTrack = (id:string) => {
    
    // set UI state
    setLoadingTrack(false)
    setLoadingTranslation(true)
    setShowSongPicker(false)

    getTrack(id).then((data:any)=>{
      setCurrentTranslation(data)
      setLoadingTranslation(false);
    })
  };

  const loadInitData = () => {
    getProfile()
    getUserPlaylists()
    setPlayer(player)
  };

  // auth functions

  const getToken = async () => {
    return new Promise((resolve, reject)=>{
      const params = new URLSearchParams(window.location.search);
      fetch("/api/callback", {
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
        resolve(data);
      })
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

      <SongPicker display={showSongPicker} setDisplay={setShowSongPicker} loading={loadingPlaylist} loadingTrack={loadingTrack} playlist={currentPlaylist} title={currentPlaylistName} setTrack={setCurrentTrack} handleClickTrack={handleClickTrack}/>
      
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

        <div className="grid grid-cols-2 gap-5">
          <div className="w-[100%] p-5 bg-spotify-green rounded-2xl font-extrabold">
          {loadingTranslation ? 
            <p>Loading...</p>
            :
              <>{currentLyrics?.map((value:string, index:number)=>{
                return <p className="pb-1 text-lg" key={index}>{value}</p>
              })}
              </>
            }
          </div>
          <div className="w-[100%] p-5 bg-gray-200 rounded-2xl font-extrabold">
          {loadingTranslation ? 
            <p>Loading...</p>
            :
              <>{currentTranslation?.map((value:string, index:number)=>{
                return <p className="pb-1 text-lg" key={index}>{value}</p>
              })}
              </>
            }
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
