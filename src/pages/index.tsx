import { type NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import SpotifyPlayer from 'react-spotify-web-playback';
import SongPicker from "~/components/SongPicker";
import Profile from "~/components/Profile";

interface ILyrics {
  original:string;
  translation:string;
}

interface IToken {
  access_token: string;
  token_type: string;
  scope: string;
  created?: number;
  expires_in: number;
}


const Home: NextPage = () => {

  // state token
  const [token, setToken] = useState<any>(null);

  // state
  const [user, setUser] = useState<any>({images: [{url:""}]});
  const [userPlaylists, setUserPlaylists] = useState<any>({});
  const [showSongPicker, setShowSongPicker] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<any>("");
  const [currentPlaylistName, setCurrentPlaylistName] = useState<string>("");
  const [currentTrack, setCurrentTrack] = useState<ILyrics | null>({original:"",translation:""});
  const [player, setPlayer] = useState<Spotify.Player>();

  // loading states
  const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [loadingTrack, setLoadingTrack] = useState<boolean>(false);
  const [loadingTranslation, setLoadingTranslation] = useState<boolean>(false);

  useEffect(()=>{

    const token = sessionStorage.getItem("access_token")
    
    if(token){
      if(tokenExpired(JSON.parse(token))){
        logout();
        return
      }
      setToken(token);
      loadInitData();
      
    }
    else if(window.location.search.split("?").length > 1){
      getToken()
      .then((data:any)=>{
        persistToken(data);

        setToken(data);
        loadInitData();

        window.location.search = "";
      })
    }
  }, []);

  // data fetching functions

  async function getProfile() {
    setLoadingUser(true)

    let accessToken = JSON.parse(sessionStorage.getItem('access_token') || "").access_token;

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
    let accessToken = JSON.parse(sessionStorage.getItem('access_token') || "").access_token;
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
    let accessToken = JSON.parse(sessionStorage.getItem('access_token') || "").access_token;
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
    return new Promise((resolve, reject)=>{

      let accessToken = JSON.parse(sessionStorage.getItem('access_token') || "").access_token;

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
      setCurrentTrack(data)
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
      .then((data) => {
        resolve(data);
      })
    })
  };

  const persistToken = (data:any) => {
    let token:IToken = data;
    data.created = new Date();
    sessionStorage.setItem("access_token", JSON.stringify(token))
  };

  const tokenExpired = (token:IToken):boolean => {
    if(!token.created) return true;

    const remainder = Date.now() - token.created;

    if(remainder >= token.expires_in) return true

    return false;
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
    setCurrentTrack(null)
    setToken(null);
    sessionStorage.removeItem("access_token");
  };

  return (
    <>
      <Head>
        <title>Langify</title>
        <meta name="description" content="Translate songs in real time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SongPicker display={showSongPicker} setDisplay={setShowSongPicker} loading={loadingPlaylist} loadingTrack={loadingTrack} playlist={currentPlaylist} title={currentPlaylistName} handleClickTrack={handleClickTrack}/>
      
      <main className="bg-spotify-black min-h-screen px-16 lg:px-48 py-5">
        <div className="my-10 h-[150px] flex justify-center items-center w-full">
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

        <div className="">
          <div className="p-10 bg-spotify-green rounded-2xl font-extrabold">
          {loadingTranslation ? 
            <p>Loading...</p>
            :
              <>{currentTrack?.original.split("\n")?.map((value:string, index:number)=>{
                return <div className="pb-1 flex text-lg" key={index}>
                          <p className="w-[50%] py-2 text-[#222]">{value}</p>
                          <div className="p-5"></div>
                          <p className="w-[50%] py-2">{currentTrack?.translation.split("\n")[index]}</p>
                        </div>
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
