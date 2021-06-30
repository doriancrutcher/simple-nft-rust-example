import React from "react";

import { Container, Row, Button } from "react-bootstrap";

const LoginPage = (props) => {
  return (
    <Container>
      <Row
        className='d-flex justify-content-center'
        style={{ textAlign: "center", fontSize: "4vw" }}
      >
        This frontend will demonstrate the flow of the NEP-171 standard in use
        of minting a simple NFT.
      </Row>
      <Row
        className='d-flex justify-content-center'
        style={{ textAlign: "center", fontSize: "4vw", marginTop: "5vh" }}
      >
        Step 1 Login!
      </Row>

      <Row style={{ marginTop: "10vh" }}>
        <Button>Login</Button>
      </Row>
    </Container>
  );
};

export default LoginPage;
