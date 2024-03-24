import React from 'react';
import './App.css';
import { RouterProvider } from "react-router-dom";
import Socket from "./components/Socket";
import router from "./router";
// import { MuiThemeProvider } from '@material-ui/core/styles/MuiThemeProvider';
import { Toaster } from 'react-hot-toast';

function App() {
  // const accessToken = getCurrentAccessToken();
  // const user = useSelector((state) => state.user.shortName);
  // if (accessToken) {
  //     const dispatch = useDispatch();
  //     const userData = processAccessToken(accessToken);
  //     dispatch(setUser(userData));
  // }
  return (
      <>
        {/* <MuiThemeProvider> */}
        {/* <MuiThemeProvider> */}
          <Socket children={<RouterProvider router={router} />} />
          <Toaster position="bottom-center" />
        {/* </MuiThemeProvider> */}
      </>

  )
}

export default App;
