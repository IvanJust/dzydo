import { Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export default function Bread(bread){
    console.debug(bread);
    
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Главная
    </Link>,
    <Typography key="2" color="text.primary">
      Административное меню
    </Typography>,
  ];
  
    const bread_new = [];
    console.debug(bread_new, breadcrumbs, bread.length);
    bread = bread.map((item, key) => {
        if(item.key != bread.length){
            return(
                    <Link underline="hover" key={item.key} color="inherit" href={item.link}>
                        {item.title}
                    </Link>)
                        
        } 
        if(item.key == bread.length){
            return(
                    <Typography key={item.key} color="text.primary">
                        {item.title}
                    </Typography>)
                        
        } 
    });
    console.debug(bread_new, breadcrumbs, bread, bread.length);
    return bread;
}