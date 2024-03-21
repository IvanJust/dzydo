import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

import "./defaultPage-style.css";

function DefaultPage(){
    console.debug('ded');
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
            
        </div>
    )
}
export default DefaultPage