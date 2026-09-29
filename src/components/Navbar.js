import React from 'react'
import '../css/navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div>
        <h2><span>E</span>asy <span>B</span>illing</h2>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/youritems'>Your Items</Link></li>
          <li><Link to='/transactions'>Transactions</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar