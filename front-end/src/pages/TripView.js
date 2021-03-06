import "../css/TripView.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ResultMap from "../components/ResultMap"
import ResultFlowDiagram from "../components/ResultFlowDiagram"
import Modal from "../components/SaveModal"
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import MapIcon from '@mui/icons-material/Map';
import Day from "../components/Day/Day"
import DayView from "../components/DayView/DayView"
import { useEffect, useState } from "react"
import {useLocation} from "react-router-dom"
import { duration } from "@mui/material"
import { useNavigate } from "react-router"
import { useSearchParams, createSearchParams } from "react-router-dom";
const axios=require("axios")
const Buffer=require('buffer').Buffer

const TripView=props=>{
    const navigate=useNavigate()
    const [searchParams]=useSearchParams()
    const {state}=useLocation()
    const {actiData}=state
    const [hotel, setHotel]=useState()
    const duration=searchParams.get("duration")
    const destination=searchParams.get("destination")
    const renderDays=(duration)=>{
        let dayList=[]
        for (let i=1;i<parseInt(duration)+1;i++){
            const idVal="dayIc"+i
            dayList.push(<button id={idVal} className = "dayIcon1" onClick = {() =>handleDayClick(i)}>Day{i}</button>)
        }
        return dayList
    }
    const [showModal, setModal]=useState(false)
    const [displayMap, showMap]=useState(false);
    // handles the current day view - based on button pressed
    const [displayDay, setDisplayDay]=useState(1);
    const [dir, setDir]=useState([]);
    const [mode, setMode]=useState(window.google.maps.TravelMode.DRIVING);
    const [timeL, setTimeL] = useState([])
    // const [totalTime, setTotalTime]=useState(0) calculate total time functionality to be implemented.
    const handleDayClick=num=>{
        switchMap(false)
        if(displayDay!=num){
            const originBtn=document.getElementById("dayIc"+displayDay)
            const newBtn=document.getElementById("dayIc"+num)
            originBtn.style.background=""
            newBtn.style.background="grey"
            setDisplayDay(num)
        }
        //for first render
        else if(num===1){
            const btn=document.getElementById("dayIc"+1)
            if(btn.style.background===""){
                btn.style.background='grey'
            }
        }
    }  
    const switchMap=(show)=>{
        const mapIcon=document.getElementById("mapIc")
        console.log(show)
        if (show===undefined){
            if(!displayMap){
                mapIcon.style.background="grey"
            }
            else{
                mapIcon.style.background="white"
            }
            showMap(!displayMap)
        }
        else if(show){
            mapIcon.style.background='grey'
            showMap(true)
        }
        else if(show===false){
            mapIcon.style.background='white'
            showMap(false)
        }
    }
    const handleMapClick=()=>{
        switchMap()
    }
    const handleEditClick=()=>{
        showMap(false)
        const params={hotel: hotel.name, destination, duration, startDate: searchParams.get("startDate"), endDate: searchParams.get("endDate") }
        navigate({pathname:"/hotelToTrip", search:`?${createSearchParams(params)}`}, {state:{dataEachDay: actiData}})}
    const handleSaveClick=()=>{
        if(localStorage.getItem("user")==null){
            alert("Please log in to save trips") 
        }
        else{
            setModal(true)
            // document.body.style.overflow = 'hidden';
        }
    }
    const closeModal=()=>{
        setModal(false)
        // document.body.style.overflow="scroll";
    }
    const directionService=new window.google.maps.DirectionsService();
    const waypointsList=[]
    for(let x=0;x<actiData.length;x++){
        const dayWPList=[]
        for (let i=0;i<actiData[x].length;i++){
          dayWPList.push({location: new window.google.maps.LatLng(actiData[x][i].lat,actiData[x][i].lng), stopover: true})
        }
      waypointsList.push(dayWPList)
    }
    async function getDir(request){
        const result2 = await directionService.route(
          request, (result, status) => {
            if (status !== window.google.maps.DirectionsStatus.OK){
              console.error(`error fetching directions ${result}`);
              return false
            }
          }
        )
        return result2
    }
    function getRequest(idx, mode){
        let dirRequest={
            origin: new window.google.maps.LatLng(hotel.lat, hotel.lng),
            destination: new window.google.maps.LatLng(hotel.lat, hotel.lng),
            travelMode: mode,
            waypoints: waypointsList[idx]
        }
        return dirRequest
    }
    
    const displayContent=()=>{
        if (displayMap){           
            return <ResultMap dayNum={displayDay} dir={dir} actiData={actiData[displayDay-1]} timeData={timeL} hotel={hotel}></ResultMap>
        }
        else {
            return <ResultFlowDiagram actiData={actiData[displayDay-1]} duration={duration} destination={destination} hotel={hotel} timeData={timeL}></ResultFlowDiagram>
        }
    }
    const fetchData=async()=>{
        const res=await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/getSingleHotel`,{name:searchParams.get("hotel"), city: searchParams.get("destination")})
        const hotelFetched=res.data
        hotelFetched.image="data:image/jpeg;base64,".concat(Buffer.from(hotelFetched.image.data).toString("base64"))
        setHotel(hotelFetched)
    }
    useEffect(()=>{
        fetchData();
        handleDayClick(1)
    },[]);
    (async() => {
        const aDir=await getDir(getRequest(displayDay-1, mode))
        setDir(aDir)
        const timeData=[]
        for(let i=0;i<aDir.routes[0].legs.length;i++){
            let durationText=aDir.routes[0].legs[i].duration.text
            timeData.push(durationText)
        }
        setTimeL(timeData)
    })()
    return(
        <div>
            <Header />
            <div className="template">
                <h1>Trip to {destination} </h1>
                <div className="subHeader">
                    <div className="dayIcons">
                        {renderDays(duration)}
                    </div>
                    <div className="Icons">
                        <MapIcon id="mapIc" className="Icon"  sx={{ fontSize: "5vh"}} onClick={handleMapClick} />
                        <EditIcon className="Icon" sx={{ fontSize: "5vh"}} onClick={handleEditClick}/>
                        <SaveIcon className="Icon" sx={{ fontSize: "5vh"}} onClick={handleSaveClick}/>
                    </div>
                </div>
                {/* <DayView dayNumber = {displayDay} key = {displayDay} /> */}
                <div className="panelAndSummary">
                    <div className="floatingPanel">
                        <p id="panelIntro">Mode of Travel:</p>
                        <select id="selectBox" value={mode} onChange={e=>setMode(e.target.value)}>
                        <option value={window.google.maps.TravelMode.DRIVING}>Driving</option>
                        <option value={window.google.maps.TravelMode.WALKING}>Walking</option>
                        <option value={window.google.maps.TravelMode.BICYCLING}>Bicycling</option>
                        <option value={window.google.maps.TravelMode.TRANSIT}>Transit</option>
                        </select>
                    </div>
                    {/* <div className="timeSummary">
                        <div id="timeText">Time in total:</div>
                        <p id="timeValue">{totalTime}</p>
                    </div> */}
                </div>
                {hotel && displayContent()}
                {showModal && <Modal toClose={closeModal} actiData={actiData} />}
            </div>
            <Footer />
        </div>
    )
}
export default TripView