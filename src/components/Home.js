import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { itemContext } from '../App'
import '../css/home.css'
import { Link } from 'react-router-dom'
import MobileSite from './MobileSite'
import { toast } from 'react-toastify'

export const Home = ({dataToApp}) => {
    const {items, billing, totals} = useContext(itemContext)
    const [draftItems, setDraftItems] = useState([])
    const [itemArr, setItemArr] = useState([])
    const [name, setName] = useState()
    const [unit, setUnit] = useState()
    const [price, setPrice] = useState()
    const [quantity, setQuantity] = useState()
    const [total, setTotal] = useState(0)
    const [updated, setUpdated] = useState(false)
    const [customerName, setCustomerName] = useState()

    const handleAdd = () => {
        if(name && quantity) {
            var price = ""
            for(var i in draftItems) {
                if(draftItems[i].name === name) {
                    price = draftItems[i].price
                    setItemArr([...itemArr, {name, quantity, price}])
                    setTotal((total) => total+(quantity*price))
                }
            }
            setName('')
            setQuantity('')
        }
        else {
            toast.error('All the fields are required!')
        }
    }
    const deleteData = (i) => {
        let total = [...itemArr]
        setTotal((total) => total-(itemArr[i].price*itemArr[i].quantity))
        total.splice(i, 1)
        setItemArr(total)
    }
    useEffect(() => {
        setDraftItems([...items], {name, unit, price})
        setItemArr([...billing], {name, unit, price})
        setTotal(totals)
    }, updated)
    return (
        <>
        <Navbar/>
        <div className='show'>
            <div className='additem-form'>
                <div className='input-data'>
                    <label>Item Name</label>
                    <select value={name} onChange={(e) => setName(e.target.value)}>
                        <option value="" hidden>--SELECT--</option>
                        {
                            draftItems.length>0 && draftItems.map((data, i) => {
                                return (
                                    <option value={data.name}>{data.name}</option>
                                )
                            })
                        }
                        {
                            items.length == 0 && (
                                <option value="">Empty List</option>
                            )
                        }
                    </select>
                </div>
                <div className='input-data'>
                    <label>Item Quantity</label>
                    <input type='text' placeholder='Quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                </div>
                <div className='input-data'>
                    <button onClick={handleAdd}>Add Item</button>
                </div>
            </div>
            <div className='bill-details'>
                <h1>Make Billing Here</h1>
                <label>Customer Name:</label>
                <input type='text' placeholder='Customer Name' onChange={(e) => setCustomerName(e.target.value)} autoComplete='off'/>
            </div>
            <div className='item-list'>
                <table>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            itemArr.length>0 && itemArr.map(
                                (item, i) => {
                                    return (
                                        <tr>
                                            <td>{i+1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.quantity} x {item.price}</td>
                                            <td>Rs. {item.quantity*item.price}</td>
                                            <td>
                                                <button className='delete-item' onClick={() => deleteData(i)}>Delete</button>
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
                {itemArr.length === 0 &&
                    <h5 style={{textAlign:'center', padding:'10px'}}>Add Items to view</h5>
                }
                <div className='total-price'>
                    <h2>Total: Rs. {total}</h2>
                </div>
            </div>
            <div className='check-out'>
                {
                    (total>0 && customerName) && (
                        <button onClick={() => {dataToApp(itemArr, total, customerName)}}><Link to='/checkout'>Check-Out</Link></button>
                    )
                }
            </div>
        </div>
        {/* <div className='showmobile'>
            <MobileSite/>
        </div> */}
        </>
    )
}