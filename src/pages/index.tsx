import { type NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import Image from 'next/image'
import SongPicker from "~/components/SongPicker";
import ArtistsContainer from "~/components/ArtistsContainer";
import Profile from "~/components/Profile";
const Home: NextPage = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>({images: [{url:""}]});
  const [userPlaylists, setUserPlaylists] = useState<any>({})
  const [showSongPicker, setShowSongPicker] = useState<boolean>(false)
  const [currentPlaylist, setCurrentPlaylist] = useState<any>("")
  const [currentPlaylistName, setCurrentPlaylistName] = useState<string>("")
  const [currentTrack, setCurrentTrack] = useState<any>()

  const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);

  useEffect(()=>{
    if(localStorage.getItem("access_token")){
      setToken(localStorage.getItem("access_token"))
      getProfile()
      getUserPlaylists()
    }
    else if(window.location.search.split("?").length > 1){
      getToken()
    }
  }, [])

  async function getProfile() {
    setLoadingUser(true)
    let accessToken = localStorage.getItem('access_token');
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setUser(data)
      setLoadingUser(false)
    });
  }

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
  }

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
  }

  const handleClickPlaylist = (id:string, name:string) => {
    setShowSongPicker(true)
    setCurrentPlaylistName(name)
    setCurrentPlaylist(id)
    getPlaylistTracks(id)
  }

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
  }

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
  }

  const logout = () => {
    setToken("");
    localStorage.removeItem("access_token")
  }

  return (
    <>
      <Head>
        <title>Langify</title>
        <meta name="description" content="Translate songs in real time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SongPicker display={showSongPicker} setDisplay={setShowSongPicker} loading={loadingPlaylist} playlist={currentPlaylist} title={currentPlaylistName} setTrack={setCurrentTrack}/>
      <main className="bg-spotify-black h-screen px-32">
        <div className="p-10 flex justify-center">
          {token ? 
            <Profile loadingUser={loadingUser} loadingPlaylist={loadingPlaylists} user={user} userPlaylists={userPlaylists} logout={logout} handleClickPlaylist={handleClickPlaylist}/>
          :
          <button onClick={()=>login()} className="bg-white w-[125px] p-4 rounded-full font-bold hover:scale-105">Log in</button>
          }
        </div>

        {currentTrack && 
        <div className="text-white text-2xl font-bold w-full text-center p-5">
          <h2>{currentTrack.name}</h2>
          <div className="text-sm">
            <ArtistsContainer artists={currentTrack.artists} />
          </div>
        </div>
        }


        <div className="flex">
          <div className="w-[100%] p-24 bg-spotify-green rounded-2xl">

          </div>
          <div className="p-2"></div>
          <div className="w-[100%] p-24 bg-gray-200 rounded-2xl">

          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
