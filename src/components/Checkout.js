import React, { useContext, useEffect, useState } from 'react'
import { itemContext } from '../App'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {v4 as uuidv4} from 'uuid'
import '../css/checkout.css'
import MobileSite from './MobileSite'

const Checkout = ({dataToApp}) => {
    const {billing, totals, customerName} = useContext(itemContext)
    const [draftItems, setDraftItems] = useState([])
    const [updated, setUpdated] = useState(false)
    const [name, setName] = useState()
    const [quantity, setQuantity] = useState()
    const [price, setPrice] = useState()
    const [transId, setTransId] = useState(uuidv4())
    const [tot, setTot] = useState(totals)

    const current = new Date()
    const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`

    // For billing pdf
    const [loader, setLoader] = useState(false)

    const downloadPDF = () => {
        dataToApp(transId, date)
        const capture = document.querySelector('.receipt')
        setLoader(true)
        html2canvas(capture).then((canvas) => {
            const imgData = canvas.toDataURL('img/png')
            const doc = new jsPDF('p', 'mm', 'a4')
            const componentWidth = doc.internal.pageSize.getWidth()
            doc.addImage(imgData, 'PNG', 0, 10, componentWidth, 0)
            setLoader(false)
            doc.save(`easybilling-receipt-${transId}.pdf`)
        })
    }

    useEffect(() => {
        setDraftItems([...billing], {name, quantity, price})
    }, updated)

    return (
        <>
        <Navbar/>
        <div className='show'>
            <div className='receipt'>
                <div className='item-list'>
                    <div className='navbar' style={{'margin': '10px 0px'}}>
                        <div>
                            <h2><span>E</span>asy <span>B</span>illing</h2>
                        </div>
                    </div>
                    <h4 style={{'margin': '10px 0px'}}>Transaction ID: {transId}</h4>
                    <div className='date-details'>
                        <h4>Customer Name: {customerName}</h4>
                        <h4>PDF Generated at: {date}</h4>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                draftItems.length>0 && draftItems.map(
                                    (item, i) => {
                                        return (
                                            <tr>
                                                <td>{i+1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.quantity} x {item.price}</td>
                                                <td>Rs. {item.quantity*item.price}</td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                    </table>
                    {draftItems.length === 0 &&
                        <h5 style={{textAlign:'center', padding:'10px'}}>Add Items to view</h5>
                    }
                    <div className='total-price'>
                        <h2>Total: Rs. {tot}</h2>
                    </div>
                </div>
            </div>
            <div className='check-out'>
                <button onClick={downloadPDF} disabled={!(loader===false)}>{loader? `Processing...` : `Check-Out & Print Receipt`}</button>
            </div>
        </div>
        {/* <div className='showmobile'>
            <MobileSite/>
        </div> */}
        </>
    )
}

export default Checkout