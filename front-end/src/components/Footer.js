import {Link} from "react-router-dom"
import "../css/Footer.css"

const Footer=()=>{
    return (
        <>
        <div className='blank'></div >
        <div className="container">
            <Link className="item" to="/about">About</Link>
            <Link className="item" to="/contact">Help</Link>
        </div>
        </>
    )
}
export default Footer