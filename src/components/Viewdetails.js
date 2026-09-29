import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { itemContext } from '../App'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Navbar from './Navbar'
import MobileSite from './MobileSite'

const Viewdetails = () => {
    const { id } = useParams()
    const {transactions} = useContext(itemContext)
    const [item, setItem] = useState([])

    if(item.length === 0 && transactions.length != 0) {
        const results = transactions.filter((items) => {
            return items.transId.toLowerCase().startsWith(id.toLowerCase())
        })
        setItem(results)
    }

    // For billing pdf
    const [loader, setLoader] = useState(false)

    const downloadPDF = () => {
        const capture = document.querySelector('.receipt')
        setLoader(true)
        html2canvas(capture).then((canvas) => {
            const imgData = canvas.toDataURL('img/png')
            const doc = new jsPDF('p', 'mm', 'a4')
            const componentWidth = doc.internal.pageSize.getWidth()
            doc.addImage(imgData, 'PNG', 0, 10, componentWidth, 0)
            setLoader(false)
            doc.save(`easybilling-receipt-${item[0].transId}.pdf`)
        })
    }

    return (
        <>
        <Navbar/>
        {
            item.length === 0 && (
                <h5 style={{textAlign:'center', padding:'10px'}}>Broken URL or Invalid URL</h5>
            )
        }
        {
            item.length > 0 && (
                <>
                <div className='show'>
                    <div className='receipt'>
                        <div className='item-list'>
                            <div className='navbar' style={{'margin': '10px 0px'}}>
                                <div>
                                    <h2><span>E</span>asy <span>B</span>illing</h2>
                                </div>
                            </div>
                            <h4 style={{'margin': '10px 0px'}}>Transaction ID: {item[0].transId}</h4>
                            <div className='date-details'>
                                <h4>Customer Name: {item[0].customerName}</h4>
                                <h4>PDF Generated at: {item[0].date}</h4>
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
                                        item[0].billing.length>0 && item[0].billing.map(
                                            (items, i) => {
                                                return (
                                                    <tr>
                                                        <td>{i+1}</td>
                                                        <td>{items.name}</td>
                                                        <td>{items.quantity} x {items.price}</td>
                                                        <td>Rs. {items.quantity*items.price}</td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                </tbody>
                            </table>
                            {item.length === 0 &&
                                <h5 style={{textAlign:'center', padding:'10px'}}>Add Items to view</h5>
                            }
                            <div className='total-price'>
                                <h2>Total: Rs. {item[0].totals}</h2>
                            </div>
                        </div>
                    </div>
                    <div className='check-out'>
                        <button onClick={downloadPDF} disabled={!(loader===false)}>{loader? `Processing...` : `Print Receipt`}</button>
                    </div>
                </div>
                {/* <div className='showmobile'>
                    <MobileSite/>
                </div> */}
                </>
            )
        }
        </>
    )
}

export default Viewdetails