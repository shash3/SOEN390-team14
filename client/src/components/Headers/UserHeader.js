import React from "react";

// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";
import UserWallpaper from "../../assets/img/brand/user-wallpaper.jpg";

const UserHeader = (props) => {
  const permission = JSON.parse(localStorage.getItem("permission"));
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "600px",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white" style={{ width: "500px" }}>
                {permission === "admin" && <>ADMIN CONTROLS</>}
                {permission !== "admin" && <> Welcome {props.user.name}</>}
              </h1>
              <p className="text-white mt-0 mb-5" style={{ width: "500px" }}>
                {permission === "admin" && (
                  <>The admin panel lets you view and edit users permissions.</>
                )}
                {permission !== "admin" && (
                  <>
                    {" "}
                    This is your profile page. You can view and edit your
                    personal information
                  </>
                )}
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
