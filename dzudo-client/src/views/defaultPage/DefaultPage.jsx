import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

import "./defaultPage-style.css";
import Footer from "./Footer/Footer";
import { useSelector } from "react-redux";
import { Alert, Box } from "@mui/material";

function DefaultPage(){
    const isLogin = useSelector((state) => state.user.isLogin);
    // console.debug(isLogin);
    return(
        <div className="page">
            <Header/>
            <div className="content">
                <div className="content-block1">
                    <div className="container">
                        <div className="content-page">
                            {isLogin && <Outlet/>}
                            {!isLogin && <Box mt={3} sx={{ display: 'flex', alignItems: 'flex-start' }}><Alert severity="info">Необходимо авторизоваться для дальнейших действий!</Alert></Box>}
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer/> */}
        </div>
    )
}
export default DefaultPage