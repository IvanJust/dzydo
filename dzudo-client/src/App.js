import React from 'react';
import './App.css';
import { RouterProvider } from "react-router-dom";
import Socket from "./components/Socket";
import router from "./router";
// import { MuiThemeProvider } from '@material-ui/core/styles/MuiThemeProvider';
import { Toaster } from 'react-hot-toast';
import { getCurrentAccessToken } from './core/Api/functions';
import { processAccessToken } from './features/functions';
import { useDispatch, useSelector } from 'react-redux';
import { getFIO, setUser } from './store/slices/userSlice';
import { getProfile } from './core/Api/ApiData/methods/portfolio';

function App() {
  const accessToken = getCurrentAccessToken();
  const user = useSelector((state) => state.user.userInfo.shortName);
  const dispatch = useDispatch();
  if (accessToken) {
      const userData = processAccessToken(accessToken);
      getProfile(userData.sub).then((response) =>{
              dispatch(getFIO(response.data[0]));
          }
      );
      dispatch(setUser(userData));
  }
  return (
      <>
        {/* <MuiThemeProvider> */}
        {/* <MuiThemeProvider> */}
          <Socket children={<RouterProvider router={router} test={user} />} />
          <Toaster position="bottom-center" />
        {/* </MuiThemeProvider> */}
      </>

  )
}

export default App;
