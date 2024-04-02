import { Outlet, createBrowserRouter } from "react-router-dom"

import * as views from "./views"
// console.debug(views);
const router = createBrowserRouter([
    //блок для отображения контента со всякой фигней вокруг
    {
        path: "/",
        element: <views.DefaultPage />,
        children: [
            {
                path: 'registration',
                element: <views.Registration/>
            },
            {
                path: 'writing',
                element: <views.TableExs/>
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
        // children: [
            // {
            //     path: "/card2",
            //     element: <views.Card />
            // },
            // {
            //     path: "/calendar",
            //     // element: <views.Calendar />,
            //     children:[
            //         {
            //             path: "headschedule",
            //             children:[
            //                 {
            //                     path: "add",
            //                     element: <views.AddHeadschedule />,
            //                 },
            //                 {
            //                     path: "list",
            //                     element: <views.ListHeadschedule />
            //                 }
            //             ]
            //         },
            //         {
            //             path: "lesson",
            //             children:[
            //                 {
            //                     path: ":id",
            //                     element: <views.RouteSchedule />,
            //                 }
            //             ]
            //         },
            //         {
            //             path: "",
            //             element: <views.ListHeadschedule />,
            //         }
            //     ]
            // },
        // ]
        
    },
    

])
export default router