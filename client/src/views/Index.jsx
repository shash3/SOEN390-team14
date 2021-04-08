import React from 'react'
// reactstrap components
import { Container } from 'reactstrap'

// core components
import HomeHeader from '../components/Headers/HomeHeader.jsx'

const Index = () => (
    <>
      <HomeHeader />
      {/* Page content */}
      <Container className="mt--7" fluid></Container>
    </>
  )

export default Index
