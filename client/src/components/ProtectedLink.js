 
 
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { __STORENOTIFY_USERINFO } from "../constants/localStrorageConstant";
const ProtectedLink = ({ children, urlToProtect ,isAllowed }) => {
  const history = useHistory();
  const [selfAllowed, setSelfAllowed] = useState(false);
  useEffect(() => {
    // re-chekc if the user object and token is presnet
    let u  = localStorage.getItem(__STORENOTIFY_USERINFO);
    /*
    {"_id":"6819f27a808190ec8f62a952","name":"Shaik","email":"shaikh.abbas2609@gmail.com",
    "isAdmin":false,
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTlmMjdhODA4MTkwZWM4ZjYyYTk1MiIsImlhdCI6MTc0NjUzNTE5MCwiZXhwIjoxNzQ2NTM4NzkwfQ.ErL1gT5_dhmoI5-yrtIpa-2VTrc-hTYLhHtZcGDPIwk"}
    
    */
   if (u  !== null && u !== undefined) {
     try {
        u = JSON.parse(u);
        if (!u.token) {
        // alert("Please login to access this page.");
        // history.push("/requestlogin");
        setSelfAllowed(true);
        }
     } catch (e) {
        console.error("Invalid user object in localStorage");
      }
    }  
    
  },[])
  const handleClick = (e) => {
    if (!selfAllowed) {

      e.preventDefault(); // Stop navigation
      alert("Please login to access this page.");
    } else {
        history.push(urlToProtect);
    }
  };

  return (
    <Link to={urlToProtect} onClick={handleClick}>
       {children}
    </Link>
  );
};
export default ProtectedLink;
