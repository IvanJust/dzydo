import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

import "./defaultPage-style.css";
import Footer from "./Footer/Footer";
import { useSelector } from "react-redux";
import { Alert } from "@mui/material";

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
                            {!isLogin && <Alert severity="info">Необходимо авторизоваться для дальнейших действий!</Alert>}
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer/> */}
        </div>
    )
}
export default DefaultPage