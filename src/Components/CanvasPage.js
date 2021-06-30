import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Container,
  Col,
  Row,
  DropdownButton,
  Dropdown,
  Button,
  Form,
} from "react-bootstrap";

import CanvasDraw from "react-canvas-draw";
import DrawBack from "../assets/nearcat 1.svg";
import { HuePicker } from "react-color";

import { compressToBase64, decompressFromBase64 } from "lz-string";

const styles = {
  border: "0.0625rem solid #9c9c9c",
  borderRadius: "0.25rem",
};

const CanvasPage = (props) => {
  // State Variables

  const [penSize, setPenSize] = useState(10);
  const [color, changeColor] = useState("#fff");

  const penSizes = [1, 5, 10, 15, 20];
  const colorList = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "black",
    "white",
    "orange",
  ];

  const canvasRef = useRef("");
  const nearKatName = useRef("");

  const setNewColor = (color) => {
    changeColor(color);
  };

  // Blockchain Interface

  // metaData

  const now = Date.now();

  const initializeContract = async () => {
    const newArgs = {
      owner_id: window.accountId,
      metadata: {
        spec: "nft-1",
        name: localStorage.getItem("drawingName")
          ? localStorage.getItem("drawingName")
          : nearKatName.current.value,
        symbol: "NNFT",
      },
    };

    await window.contract.new(newArgs);
  };

  const sendToBlockChain = async () => {
    const now = Date.now();
    const metaData = {
      media: localStorage.getItem("drawingData")
        ? localStorage.getItem("drawingData")
        : canvasRef.current.getSaveData(),
      issued_at: now.toString(),
    };
  };

  useEffect(() => {
    if (localStorage.getItem("drawingData")) {
      canvasRef.current.loadSaveData(
        decompressFromBase64(localStorage.getItem("drawingData"))
      );
    }
  }, []);

  return (
    <Container>
      <Row>
        <Col
          sm={3}
          className='d-flex justify-content-center align-items-center'
        >
          {" "}
          Step 2 Create your NearKat!
        </Col>
        <Col
          className='d-flex justify-content-center align-items-center'
          sm={9}
        >
          <Container>
            <Row>
              <Form style={{ marginBottom: "20px" }}>
                <Form.Group>
                  <Form.Text>NearKat Name</Form.Text>
                  <Form.Control ref={nearKatName} />
                </Form.Group>
              </Form>
            </Row>
            <Row
              style={{ marginBottom: "5vh" }}
              className='d-flex justify-content-center align-items-center'
            >
              <HuePicker color={color} onChangeComplete={changeColor} />
            </Row>
            <Row>
              <Container>
                {console.log(color.hex)}
                <Row className='d-flex justify-content-center'>
                  <Col className='d-flex justify-content-center'>
                    <Button onClick={() => canvasRef.current.clear()}>
                      Clear
                    </Button>
                  </Col>
                  <Col className='d-flex justify-content-center'>
                    <DropdownButton id='dropdown-basic-button' title='Pen Size'>
                      {penSizes.map((x, i) => {
                        return (
                          <Dropdown.Item key={i} onClick={() => setPenSize(x)}>
                            {x}
                          </Dropdown.Item>
                        );
                      })}
                    </DropdownButton>
                  </Col>
                </Row>
              </Container>
            </Row>
            <Row className='d-flex justify-content-center'>
              <CanvasDraw
                style={{
                  width: "500px",
                  height: "500px",
                }}
                ref={canvasRef}
                imgSrc={DrawBack}
                brushColor={color.hex + ""}
                brushRadius={penSize}
              />
            </Row>
            <Row style={{ marginTop: "10%" }}>
              <Col className='d-flex justify-content-center'>
                <Button
                  onClick={async () => {
                    await localStorage.setItem(
                      "drawingData",
                      compressToBase64(canvasRef.current.getSaveData())
                    );

                    await localStorage.setItem(
                      "drawingName",
                      nearKatName.current.value
                    );

                    alert(
                      `Drawing saved! You're welcome to leave the page and continue this drawing later <3 `
                    );
                  }}
                >
                  Save
                </Button>
              </Col>
              <Col className='d-flex justify-content-center'>
                <Button
                  onClick={() => {
                    sendToBlockChain();
                  }}
                >
                  Mint
                </Button>
              </Col>
              <Col className='d-flex justify-content-center'>
                <Button onClick={() => canvasRef.current.undo()}>Undo</Button>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Row
        style={{ marginTop: "5vh", fontSize: "8vw" }}
        className='justify-content-center d-flex'
      >
        {localStorage.getItem("drawingName")
          ? localStorage.getItem("drawingName")
          : "No name set"}
      </Row>
    </Container>
  );
};

CanvasPage.propTypes = {};

export default CanvasPage;
