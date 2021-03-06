import React, { CSSProperties, useState, useEffect } from 'react';
import { httpGetAsync } from '../../utils';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {setUser, selectUser, setUserBooks, setUserHistory, setUserCommunity} from '../user/userSlice';
import { useNavigate } from 'react-router';
import { useCookies } from "react-cookie";

export function SignIn() {
  let navigate = useNavigate();
  let dispatch = useAppDispatch();
  let user = useAppSelector(selectUser);
  let [errorMessage, setErrorMessage] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"])

  const cardStyle: CSSProperties = {
      backgroundColor: '#f1f7ed',
      width: "30vw",
      height: "50%",
      maxWidth: "50rem",
      marginLeft: "182px",
      marginTop: "12%",
      borderRadius: "20px",
      textAlign: "left",
      display: "flex",
      position: "absolute",
  };

  const pageStyles: CSSProperties = {
    backgroundImage: `url(/images/bgs/signIn.png)`,
    width: "100vw",
    height: "100vh",
    position: "absolute", top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
  };

  function signOut() {
    const url = `http://127.0.0.1:8888/api/v1/logout?name=${user?.username}`;
    httpGetAsync(url, (res: string) => {
      let json = JSON.parse(res);
      if (json.err) {
        console.error(json.err);
      }
      removeCookie("user");
      dispatch(setUser({ username: null, signedIn: false, avatar: null }));
      dispatch(setUserBooks({}))
      dispatch(setUserHistory([]))
      dispatch(setUserCommunity({}))
    });
  }

  function submit(e: any): void {
    e.preventDefault();
    setErrorMessage(null);

    let username = encodeURI(e.target.username.value);
    let pwd = encodeURI(e.target.password.value);
    let url = `http://127.0.0.1:8888/api/v1/login?name=${username}&pwd=${pwd}`;

    httpGetAsync(url, (res: string) => {
      let json = JSON.parse(res);
      let { name, avatar } = json;
      console.log(json, avatar);
      
      if (json.err) {
        console.error(json.err);
        setErrorMessage(json.err);
      } else {
        dispatch(setUser({
          username: name,
          signedIn: true,
          avatar, 
        }));
        setCookie("user", name, {path: '/'})
        navigate("/home");
      }
    });

    e.target.username.value = "";
    e.target.username.password = "";
  }

  useEffect(() => {
    if (user?.signedIn) {
      signOut();
    }
    dispatch(setUser({username: null, signedIn: false, avatar: null}));
  }, []);

  return (
    <div className="bg-no-repeat bg-cover" style={pageStyles}>
      <div style={cardStyle}>
        <div className="flex flex-row items-center w-full">
          <form className="flex flex-col m-3 items-start w-full" onSubmit={submit}>
            <h1 className="text-3xl font-bold">
              Sign In
            </h1>
            { errorMessage !== null && <div className="rounded-md mt-6 bg-red-200 w-full p-5">
              <p>{errorMessage}</p>
            </div> }
            <input id="username" className="mt-6 ml-0 placeholder:italic placeholder:text-slate-400 block w-full border border-slate-300 rounded-md py-2 pl-1.5 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm bg-themeField" placeholder="Username" type="text" name="search"/>
            <input id="password" className="mt-6 ml-0 placeholder:italic placeholder:text-slate-400 block w-full border border-slate-300 rounded-md py-2 pl-1.5 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm bg-themeField" placeholder="Password" type="password" name="search"/>
            <small className="mt-6"> Don't have an account? <button onClick={() => navigate("/signup")} className="text-slate-600 hover:cursor-pointer font-bold">Sign Up.</button></small>
            <button className="border border-solid border-gray-600 mt-3 p-1.5 pl-5 pr-5 rounded-md hover:bg-gray-100 font-bold" type="submit">Continue</button>
          </form>
        </div>
      </div>
    </div>
  );
}
