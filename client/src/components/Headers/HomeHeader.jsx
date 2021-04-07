import React from 'react'
import '../../assets/scss/home.scss';
// reactstrap components
import { Container } from 'reactstrap'

const HomeHeader = () => (
  <>
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="main-message">WELCOME TO BIKERR</div>
      </Container>
    </div>
  </>
)

export default HomeHeader
