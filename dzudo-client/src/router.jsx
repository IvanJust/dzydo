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
                path: 'games',
                element: <views.Games bread={
                    [
                        {title: 'Главная', link: '/', key: 1},
                        {title: 'Выступающие пары', key: 2}
                    ]
                }/>,
                children: [
                    {
                        path: ':id',
                    },
                    {
                        path: "*",
                    }
                ]
            },
            {
                path: 'writing',
                element: <views.TableExs bread={
                    [
                        {title: 'Главная', link: '/', key: 1},
                        {title: 'Результаты', key: 2}
                    ]
                }/>
            },
            {
                path: 'admin',
                element: <views.AdminMenu bread={
                    [
                        {title: 'Главная', link: '/', key: 1},
                        {title: 'Административное меню', key: 2}
                    ]
                } />
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
        children: [
            {
                path: 'table',
                element: <views.TableResult />
            }
        ]
    },
    

])
export default router