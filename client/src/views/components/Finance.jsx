import React from 'react';

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip, Col,
} from 'reactstrap';
// core components
import FinanceHeader from '../../components/Headers/FinanceHeader';

const boostStrapImg = require('../../assets/img/theme/bootstrap.jpg');
const team1ThemeImg = require('../../assets/img/theme/team-1-800x800.jpg');
const team2ThemeImg = require('../../assets/img/theme/team-2-800x800.jpg');
const team3ThemeImg = require('../../assets/img/theme/team-3-800x800.jpg');
const team4ThemeImg = require('../../assets/img/theme/team-4-800x800.jpg');
const angularImg = require('../../assets/img/theme/angular.jpg');
const sketchThemeImg = require('../../assets/img/theme/sketch.jpg');
const reactImg = require('../../assets/img/theme/react.jpg');
const vueImg = require('../../assets/img/theme/vue.jpg');

const Finance = () => {
  // Useless function
  const tester = () => {
  };

  return (
    <>
      <FinanceHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>

        {/* Dark table */}
        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="text-white mb-0">Welcome to Finance!</h3>
              </CardHeader>
              <Row className="mb-2 ml-2 mr-2 mt-2">
                <Col className="" >
                  <Card className="shadow">
                    <CardHeader className="bg-transparent text-center">
                      <h1 className=" mb-0">What's New with BIKERR?</h1>
                    </CardHeader>
                  </Card>
                </Col>
              </Row>
              <Row className="mb-2 ml-2 mr-2 mt-2">
                <Col className="" >
                  <Card className="shadow">
                    <CardHeader className="bg-transparent text-center">
                      <h2 className=" mb-0">Announcements</h2>
                    </CardHeader>
                  </Card>
                </Col>
                <Col className="" >
                  <Card className="shadow">
                    <CardHeader className="bg-transparent text-center">
                      <h2 className=" mb-0">Our Goals</h2>
                    </CardHeader>
                  </Card>
                </Col>
              </Row>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Finance;
