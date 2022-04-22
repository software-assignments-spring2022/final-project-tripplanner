import "../css/Home.css"
import React, {useState, useEffect}  from "react"
import Search from "../components/SearchBar"
import RecommendationActivity from "../components/RecommendationActivity"
import RecommendationDestination from "../components/RecommendationDestination"
import Header from "../components/Header"
// import recData from '../components/recommendationData.json'
import Footer from "../components/Footer"
import { useContext } from 'react';
import AppContext from '../AppContext';
const axios=require("axios")
const Buffer=require('buffer').Buffer;
const Home=()=>{
    const myContext=useContext(AppContext)
    // state variables
    myContext.setDestination("New York")
    const [activityData, setActivityData] = useState([]);
    const [destData, setDestData] = useState([]);
    const fetchData = async() => {
        try{
            const activitiesReceived=await axios.get("http://localhost:3000/getRecommendedActivities")
            activitiesReceived.data.forEach((item)=>{
                item.image="data:image/jpeg;base64,".concat(Buffer.from(item.image.data).toString("base64"))
                setActivityData((activityData=>[...activityData, item]))
            })
            const destinationsReceived=await axios.get("http://localhost:3000/getRecommendedDestinations")
            destinationsReceived.data.forEach(item=>{
                item.image="data:image/jpeg;base64,".concat(Buffer.from(item.image.data).toString("base64"))
                setDestData((destData)=>[...destData,item])
            })
        }
        catch(error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
    return (
        <div>
            <div className="imageSearch">
                <Header/>
                <div className="search">
                    <Search />
                </div>
            </div>
            <h1 className="recTitle">
                    Recommended Activities
            </h1>
            <div className="recommendation">
                {activityData.map((recommendation, i) =>
                    <RecommendationActivity recommendation={recommendation} key={i}/>
                )}                   
            </div>
            <h1 className="recTitle">
                    Recommended Destinations
            </h1>
            <div className="recommendation">
                {destData.map((destination, i) =>
                    <RecommendationDestination destination={destination} key={i}/>  
                )}
            </div>
            <Footer />
        </div>
    )
}

export default Home



