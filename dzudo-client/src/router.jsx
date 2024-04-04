import { Outlet, createBrowserRouter } from "react-router-dom"

import * as views from "./views"
// console.debug(views);
const router = createBrowserRouter([
    //блок для отображения контента со всякой фигней вокруг
    {
        path: "/",
        element: <views.DefaultPage />,
        children: [
            // {
            //     path: 'registration',
            //     element: <views.Registration/>
            // },
            {
                path: 'writing',
                element: <views.TableExs/>
            },
            {
                path: 'admin',
                element: <views.AdminMenu/>
            },
            {
                path: '',
                element: <views.Main/>
            },
            //страница не найдена
            {
                path: "*",
                element: <views.NotFound/>
            }
        ]
        
    },
    //блок для отображения контента без всякой фигни вокруг
    {
        path: "/",
        element: <Outlet/>,
    },
    

])
export default router