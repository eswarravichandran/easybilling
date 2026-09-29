import React, { useContext, useEffect, useState } from 'react'
import '../css/youritems.css'
import Navbar from './Navbar'
import { itemContext } from '../App'
import MobileSite from './MobileSite'
import { saveAs } from 'file-saver'
import CryptoJS from 'crypto-js'
import { toast } from 'react-toastify'

export const YourItems = ({dataToApp}) => {
    
    const {items} = useContext(itemContext)
    const [itemArr, setItemArr] = useState([])
    const [name, setName] = useState()
    const [unit, setUnit] = useState()
    const [price, setPrice] = useState()
    const [index, setIndex] = useState()
    const [boolin, setBoolin] = useState(false)
    const [updated, setUpdated] = useState(false)

    if(updated) {
        dataToApp(itemArr)
        setUpdated(false)
    }

    const handleAdd = () => {
        if(name && unit && price) {
            setItemArr([...itemArr, {name, unit, price}])
            setName('')
            setUnit('')
            setPrice('')
            setUpdated(true)
        }
        else {
            toast.error('All the fields are required!')
        }
    }
    const editData = (i) => {
        let {name, unit, price} = itemArr[i]
        setName(name)
        setUnit(unit)
        setPrice(price)
        setBoolin(true)
        setIndex(i)
    }
    const updateInfo = () => {
        let total = [...itemArr]
        if(name && unit && price) {
            total.splice(index, 1, {name, unit, price})
            setItemArr(total)
            setBoolin(false)
            setName('')
            setUnit('')
            setPrice('')
            setUpdated(true)
        }
        else {
            toast.error('All the fields are required!')
        }
    }
    const deleteData = (i) => {
        let total = [...itemArr]
        total.splice(i, 1)
        setItemArr(total)
        setUpdated(true)
    }

    const exportFile = () => {
        if(itemArr.length>0) {
            var encData = CryptoJS.AES.encrypt(JSON.stringify(itemArr), 'easy-billing-kjefeGFF545#$v').toString()
            var itemdata = `data:text/json;chatset=utf-8, ${encodeURIComponent(
                JSON.stringify(encData)
            )}`
            saveAs(itemdata, 'easy-billing-items.txt')
        }
        else {
            toast.error('Empty data can\'t be download!')
        }
    }

    let fileReader

    const handleFileRead = (e) => {
        const content = JSON.parse(fileReader.result)
        console.log(content)
        const bytes = CryptoJS.AES.decrypt(content, 'easy-billing-kjefeGFF545#$v')
        const decData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        setItemArr([...decData])
        setUpdated(true)
    }
    const handleFileChosen = (file) => {
        fileReader = new FileReader()
        fileReader.onloadend = handleFileRead
        fileReader.readAsText(file)
    }

    useEffect(() => {
        setItemArr([...items], {name, unit, price})
    }, updated)
    return (
        <>
        <Navbar/>
        <div className='show'>
            <div className='file-action'>
                <div className='items-file'>
                    <h3>Items File(.txt)</h3><input type='file' accept="text/plain" onChange={e => handleFileChosen(e.target.files[0])}></input>
                    <h6>* text/plain files only acceptable</h6>
                </div>
                <button onClick={exportFile}>Download</button>
            </div>
            <div className='additem-form'>
                <div className='input-data'>
                    <label>Item Name</label>
                    <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className='input-data'>
                    <label>Item Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="" hidden>--SELECT--</option>
                        <option value='KG'>Kilogram</option>
                        <option value='Ltr'>Litre</option>
                        <option value='Pcs'>Piece</option>
                    </select>
                </div>
                <div className='input-data'>
                    <label>Item Price</label>
                    <input type='text' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)}/>
                </div>
                <div className='input-data'>
                    <button onClick={!boolin ? handleAdd : updateInfo}>{!boolin ? `Add Item` : `Update Item`}</button>
                </div>
            </div>
            <div className='item-list'>
                <table>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
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
                                            <td>Rs.{item.price} per {item.unit}</td>
                                            <td>
                                                <button className='edit-item' onClick={() => editData(i)}>Edit</button>
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
            </div>
        </div>
        {/* <div className='showmobile'>
            <MobileSite/>
        </div> */}
        </>
    )
}