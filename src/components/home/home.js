import React, { useEffect } from 'react';
import Navbar from "../navigation/navbar";
import Mainlanding from "./mainlanding";
import { motion } from 'framer-motion';

function Home(props) {
    useEffect(()=>{
        document.title = 'DataStructs';
    }, []);
    return (
        <div>
            <Navbar/>
            <motion.div key="home" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
                <Mainlanding/>
            </motion.div>
        </div>
    );
}

export default Home;