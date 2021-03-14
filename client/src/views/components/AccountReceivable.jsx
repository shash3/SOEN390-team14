/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint no-console: ["error", { allow: ["error"] }] */
import React, { useState, useEffect } from 'react';

import axios from 'axios';
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Media,
  Table,
  Container,
  Row,
  ButtonGroup,
  Button,
  Form,
} from 'reactstrap';

// core components
import FinanceHeader from '../../components/Headers/FinanceHeader';

const AccountReceivable = () => {
 
  return (
    <>
      <FinanceHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
       
      </Container>
    </>
  );
};

export default AccountReceivable;