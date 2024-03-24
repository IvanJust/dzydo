import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

import "./defaultPage-style.css";
import Footer from "./Footer/Footer";

function DefaultPage(){
    // console.debug('ded');
    return(
        <div>
            <Header/>
            <div className="content">
                <div className="content-block1">
                    <div className="container">
                        <div className="content-page">
                            <Outlet/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}
export default DefaultPage