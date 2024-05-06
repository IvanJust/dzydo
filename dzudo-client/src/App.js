import React from 'react';
import './App.css';
import { RouterProvider } from "react-router-dom";
import router from "./router";
// import { MuiThemeProvider } from '@material-ui/core/styles/MuiThemeProvider';
import { Toaster } from 'react-hot-toast';
import { getCurrentAccessToken } from './core/Api/functions';
import { processAccessToken } from './features/functions';
import { useDispatch, useSelector } from 'react-redux';
import { getFIO, setEventInfo, setUser } from './store/slices/userSlice';
import { getProfile } from './core/Api/ApiData/methods/portfolio';
import SocketProvider from './context/SocketProvider';
import { getEvent } from './core/Api/ApiData/methods/event';

function App() {
  const accessToken = getCurrentAccessToken();
  const user = useSelector((state) => state.user.userInfo.shortName);
  const dispatch = useDispatch();
  if (accessToken) {
    const userData = processAccessToken(accessToken);
    getProfile(userData.sub).then((response) => {
      dispatch(getFIO(response.data[0]));
    }
    );
    getEvent(userData.event_id).then((response) => {
      dispatch(setEventInfo(response.data[0]));
    })
    dispatch(setUser(userData));
  }

  return (
    <>
      <SocketProvider>
        <RouterProvider router={router} test={user} />
      </SocketProvider>
      <Toaster position="bottom-center" />
    </>

  )
}

export default App;
