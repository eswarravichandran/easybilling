import React, { useContext, useState } from 'react'
import '../css/transactions.css'
import Navbar from './Navbar'
import MobileSite from './MobileSite'
import { Link } from 'react-router-dom'
import { itemContext } from '../App'
import { saveAs } from 'file-saver'
import CryptoJS from 'crypto-js'
import { toast } from 'react-toastify'

export const Transactions = ({dataToApp}) => {
    const {transactions} = useContext(itemContext)

    const exportFile = () => {
        if(transactions.length>0) {
            var encData = CryptoJS.AES.encrypt(JSON.stringify(transactions), 'easy-billing-kjefeGFF45#$v').toString()
            var transactiondata = `data:text/json;chatset=utf-8, ${encodeURIComponent(
                JSON.stringify(encData)
            )}`
            saveAs(transactiondata, 'easy-billing-transactions.txt')
        }
        else {
            toast.error('Empty data can\'t be download!')
        }
    }

    let fileReader

    const handleFileRead = (e) => {
        const content = JSON.parse(fileReader.result)
        console.log(content)
        const bytes = CryptoJS.AES.decrypt(content, 'easy-billing-kjefeGFF45#$v')
        const decData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        dataToApp(decData)
    }
    const handleFileChosen = (file) => {
        fileReader = new FileReader()
        fileReader.onloadend = handleFileRead
        fileReader.readAsText(file)
    }

    return (
        <>
        <Navbar/>
        <div className='show'>
            <div className='file-action'>
            <div className='transactions-file'>
                    <h3>Transactions File(.txt)</h3><input type='file' accept="text/plain" onChange={e => handleFileChosen(e.target.files[0])}></input>
                    <h6>* text/plain files only acceptable</h6>
                </div>
                <button onClick={exportFile}>Download</button>
            </div>
            <div className='transaction-list'>
                <table>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Date</th>
                            <th>Customer Name</th>
                            <th>Transaction ID</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        transactions.length>0 && transactions.map(
                            (item, i) => {
                                return (
                                    <>
                                    <tr>
                                        <td>{i+1}</td>
                                        <td>{item.date}</td>
                                        <td>{item.customerName}</td>
                                        <td>{item.transId}</td>
                                        <td>Rs.{item.totals}</td>
                                        <td><Link to={`/transactions/${item.transId}`} className='show-btn'>View</Link></td>
                                    </tr>
                                    </>
                                )
                            }
                        )
                    }
                    </tbody>
                </table>
                {transactions.length === 0 &&
                    <h5 style={{textAlign:'center', padding:'10px'}}>Make Billing to view transactions</h5>
                }
            </div>
        </div>
        {/* <div className='showmobile'>
            <MobileSite/>
        </div> */}
        </>
    )
}