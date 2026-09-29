import React, { createContext, useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home } from './components/Home'
import { YourItems } from './components/YourItems'
import { Transactions } from './components/Transactions'
import Checkout from './components/Checkout'
import Viewdetails from './components/Viewdetails'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const itemContext = createContext()

const App = () => {
  const [customerName, setCustomerName] = useState()
  const [totals, setTotals] = useState(0)
  const [items, setItems] = useState([])
  const [billing, setBilling] = useState([])
  const [transactions, setTransactions] = useState([])

  const [transId, setTransId] = useState()
  const [date, setDate] = useState()

  const handleItemList = (data) => {
    setItems(data)
    // console.log(items)
  }
  const handleBilling = (data, total, customerName) => {
    setBilling(data)
    setTotals(total)
    setCustomerName(customerName)
  }
  const handleReceipt = (transId, date) => {
    setTransId(transId)
    setDate(date)
    transactions.push({transId, customerName, date, billing, totals})
    setTotals(0)
    setBilling([])
  }
  const handleTransactions = (transaction) => {
    setTransactions(transaction)
  }

  return (
    <>
    <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHove theme="colored"/>
    <itemContext.Provider value={{items, billing, totals, customerName, transactions}}>
      <Routes>
        <Route path="/" index element={ <Home dataToApp = {handleBilling}/> } />
        <Route path="/youritems" element={ <YourItems dataToApp = {handleItemList}/> } />
        <Route path="/transactions" element={ <Transactions dataToApp={handleTransactions}/> } />
        <Route path='/checkout' element={ <Checkout dataToApp = {handleReceipt}/> } />
        <Route path='/transactions/:id' element={ <Viewdetails/> }/>
      </Routes>
    </itemContext.Provider>
    </>
  )
}

export default App