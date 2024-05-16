import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

import "./defaultPage-style.css";
import Footer from "./Footer/Footer";
import Alert from '@mui/material/Alert';
import { useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";
import { useContext } from "react";
import { SocketContext } from "../../context/SocketProvider";

function DefaultPage(){
    const isLogin = useSelector((state) => state.user.isLogin);
    const { socketAuth, isConnected } = useContext(SocketContext);
    // isConnected = false;
    // console.debug(isLogin);
    return(
        <div className="page">
            <Header/>
                <div className="content">
            {!isConnected && <Grid justifyContent={'center'}><Alert variant="filled" severity="error">Нет соединения с сервером</Alert></Grid>}
            {/* <Container> */}
                    {/* <div className="content-block1"> */}
                        <div className="container">
                            <div className="content-page">
                                {isLogin && <Outlet/>}
                                {!isLogin && <Box mt={3} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}><Alert severity="info">Необходимо авторизоваться для дальнейших действий!</Alert></Box>}
            <Footer/>
                            </div>
                       </div>
                {/*  </div> */}
            {/* </Container> */}
                    </div>
        </div>
    )
}
export default DefaultPage