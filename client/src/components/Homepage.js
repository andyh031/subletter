import React from "react";
import { useLocation } from 'react-router-dom';

const Homepage = () => {
    const location = useLocation();

    return (
        <div>
            <h1>Hello welcome to the homepage</h1>
        </div>
    )
}

export default Homepage;
