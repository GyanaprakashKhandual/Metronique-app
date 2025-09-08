import { SubWorkNavbar } from '@/app/components/modules/Navbar'
import { SubWorkSidebar } from '@/app/components/modules/Sidebar'
import React from 'react'

function page() {
  return (
    <div className='flex'>
      <SubWorkSidebar/>
      <SubWorkNavbar/>
    </div>
  )
}

export default page