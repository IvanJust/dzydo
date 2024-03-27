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
import { setUser } from './store/slices/userSlice';

function App() {
  const accessToken = getCurrentAccessToken();
  const user = useSelector((state) => state.user.shortName);
  const dispatch = useDispatch();
  if (accessToken) {
    console.debug('test');
      const userData = processAccessToken(accessToken);
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
