import { type NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import Image from 'next/image'
const Home: NextPage = () => {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>({images: [{url:""}]});

  useEffect(()=>{
    if(localStorage.getItem("access_token")){
      setToken(localStorage.getItem("access_token"))
      getProfile()
    }
    else if(window.location.search.split("?").length > 1){
      getToken()
    }
  }, [])

  async function getProfile() {
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
    });
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
      <main className="bg-spotify-black h-screen px-32">
        <div className="p-10 flex justify-center">
          {token ? 
          <div>
              <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full"><Image className="rounded-full" alt="profile" height={50} width={50} src={user?.images[0]?.url}></Image></div>
                  <div className="p-2"></div>
                  <div className="flex items-end">
                    <h2 className="text-white text-2xl font-bold leading-none">{user?.display_name}</h2>
                    <div className="p-1"></div>
                    <small className="leading-none text-white font-bold">{user?.country}</small>
                  </div>
            </div>
            <div className="p-2"></div>
            <small onClick={()=>logout()} className="text-white p-1 rounded-full font-bold">Sign out</small>
          </div>
          :
          <button onClick={()=>login()} className="bg-white w-[125px] p-4 rounded-full font-bold hover:scale-105">Log in</button>
          }
        </div>
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
