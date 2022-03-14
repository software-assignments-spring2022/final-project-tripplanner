import "../css/Contact.css"
import Footer from "../components/Footer.js"
import Header from "../components/Header"
import React,{ useState } from "react"
import Plane from "../assets/Plane.png"
import {useNavigate} from "react-router-dom"


const Contact=e=>{
    let navigate=useNavigate();
    const [issueCategory,setCategory]=useState("")
    const [issueDescription,setDescription]=useState("")
    const [show, setShow]=useState(false)
    const handleSubmit=(e)=>{
        e.preventDefault();
        if (!issueDescription){
            alert("Please enter the description")
        }
        else if(!issueCategory){
            alert("Please choose a issue")
        }
        else{
            console.log("Category: ", {issueCategory}, "Description: ",{issueDescription})
            handleShow();
        }
    }
    const handleShow=()=>{setShow(true)}
    const handleClose=()=>{setShow(false)}
    return(
        <>
            <Header />
            <div className="contactDiv">
                <h1 className="H1">Travel Issues?</h1>
                <div className="div2">
                    <img alt="Plane" id="Plane" src={Plane} />
                    <h2 className="H2">We are here to help!</h2>
                </div>
                <h2 id="send_message">Send us a message!</h2>
                <form className="issueForm" onSubmit={handleSubmit}>
                    <label htmlFor= "issue_text">What kind of issue are you having:</label>
                    <select name="issues" id="issues" value={issueCategory} onChange={e=>setCategory(e.target.value)}>
                        <option value="Empty"></option>
                        <option value="Login issue">Login Issue</option>
                        <option value="Searching issue">Searching Issue</option>
                        <option value="Profile issue">Profile Issue</option>
                        <option value="Other">Other</option>
                    </select>
                    <label htmlFor= "issue_text">Please describe your problem:</label>
                    <textarea className="issueBox" value={issueDescription} onChange={e=>setDescription(e.target.value)}></textarea><br/>
                    <input type="submit" id="submit_button" name="button" value="submit"/>
                </form>
                <h2 className="support_num" >For further issue:</h2>
                <h2 className="support_num">Support number: xxx-xxx-xxx</h2>
            </div>
            <Footer />
        </>
    )
}

export default Contact