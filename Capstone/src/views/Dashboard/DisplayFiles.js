// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Input,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { HSeparator } from "components/Separator/Separator";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ipofserver } from 'global';

import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import fileDownload from 'js-file-download'

// import PDFViewer from 'pdf-viewer-reactjs'

function DisplayFiles() {
  // Chakra color mode
  const iconBlue = useColorModeValue("blue.500", "blue.500");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("#dee2e6", "transparent");
  const { colorMode } = useColorMode();

  // console.log(colorMode);

  // ----------------------------------OnLoad-------------------------------------------------------------

  const [userData, setUserData] = useState([])

  const [inputField, setInputField] = useState({
    id: '',
    condition: '',
  })

  const inputsHandler = (e) => {
    const { name, value } = e.target;
    setInputField((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function clearInput() {
    setInputField({
      id: '',
      condition: ''
    });
  }

  useEffect(() => {
    axios.get(ipofserver + 'loadFiles/' + localStorage.getItem('LoginUsername'))
      .then(res => {
        setUserData(res.data)
      })
      .catch(err => {
        console.log(err);
      })

    // axios.get(ipofserver + 'loadallusers')
    //   // .then(res => res.json())
    //   .then(data => {
    //     // alert(data.data)
    //     setHospitals(data.data);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })
  }, [])

  // ----------------------------------------Model Load-------------------------------------------------------

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClick = (event, id, param, param1) => {
    // alert(param + " " + param1);
    localStorage.setItem('fileid', id);
    localStorage.setItem('filename', param);
    localStorage.setItem('uploader', param1);
    handleShow()
  };

  // ------------------------------------Share file--------------------------------------------------------

  const submitButton = () => {
    // alert(localStorage.getItem('fileid') + " " + localStorage.getItem('filename') + " " + localStorage.getItem('uploader') + " " + inputField.id+" "+inputField.condition)

    if (inputField.id == '' || inputField.condition == '') {
      alert("Please select receiver name !")
    }
    else {
      handleClose()      
      clearInput()
      axios.post(ipofserver + 'shareFile', {
        fileid: localStorage.getItem('fileid'),
        filename: localStorage.getItem('filename'),
        uploader: localStorage.getItem('uploader'),
        receiver: inputField.id,
        condition: inputField.condition
      })
        .then(function (response) {

          if (response.data == "success") {
            alert("File shared sucessfully !")
          }
          else {
            alert("Receiver id is invalid !")
          }
        })
        .catch(function (error) {
          return error;
        });
    }
  }

  const downloadButton = (event, id, param, param1) => {

    // axios.get(ipofserver+"static/DownloadedFile/Watermaked.pdf", {
    //   responseType: 'blob',
    // })
    // .then((res) => {
    //   fileDownload(res.data, "test-download.pdf")
    // })

    axios.post(ipofserver + 'downloadFile1', {
      fileid: id,
      filename: param,
      uploader: param1
    })
      .then(function (response) {
        // alert(response.data)
        if (response.data == "PDF") {
          axios.get(ipofserver+"static/DownloadedFile/Watermaked.pdf", {
            responseType: 'blob',
          })
            .then((res) => {
              fileDownload(res.data, param)
            })

          // axios.get(ipofserver+"static/DownloadedFile/resized.jpg", {
          //   responseType: 'blob',
          // })
          //   .then((res) => {
          //     fileDownload(res.data, "resized.jpg")
          //   })
        }
        else if (response.data == "Image") {
          axios.get(ipofserver+"static/DownloadedFile/reconstructedImage.jpg", {
            responseType: 'blob',
          })
            .then((res) => {
              fileDownload(res.data, param)
            })

          // axios.get(ipofserver+"static/DownloadedFile/resized.jpg", {
          //   responseType: 'blob',
          // })
          //   .then((res) => {
          //     fileDownload(res.data, "resized.jpg")
          //   })
        }
        
        else if (response.data == "visibleimage") {
          axios.get(ipofserver+"static/DownloadedFile/Watermaked.jpg", {
            responseType: 'blob',
          })
            .then((res) => {
              fileDownload(res.data, param)
            })
        }
        
        else if (response.data == "visiblepdf") {
          axios.get(ipofserver+"static/DownloadedFile/Watermaked.pdf", {
            responseType: 'blob',
          })
            .then((res) => {
              fileDownload(res.data, param)
            })
        }
        else {
          alert("File not downloaded !")
        }
      })
      .catch(function (error) {
        return error;
      });
  }

  // -----------------------------------------------------------------------------------------------

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px" }}>
      <Flex
        direction='column'
        textAlign='center'
        justifyContent='center'
        align='center'
        mt='10px'>
        <Text fontSize='4xl' color='white' fontWeight='bold'>
          Uploaded files
        </Text>
      </Flex>
      <Grid templateRows='1fr'>
        <Box>

          {/* <Button variant="primary" onClick={handleShow}>
            Launch demo modal
          </Button> */}

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>File sharing</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>File name</Form.Label>
                  <Form.Control
                    type="text"
                    value={localStorage.getItem('filename')}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Uploader</Form.Label>
                  <Form.Control
                    type="text"
                    value={localStorage.getItem('uploader')}
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Enter receiver id</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter id of receiver"
                    name="id" value={inputField.id}
                    onChange={inputsHandler} required
                    autoFocus
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Enter Conditions</Form.Label>
                  <Form.Control as="textarea" rows={3} 
                    name="condition" value={inputField.condition}
                    onChange={inputsHandler} required/>
                </Form.Group>
                {/* <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Example textarea</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group> */}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                fontSize='15'
                variant='dark'
                fontWeight='bold'
                onClick={handleClose}>
                Close
              </Button>
              <Button
                fontSize='15'
                variant='dark'
                fontWeight='bold'
                onClick={submitButton}>
                Share file
              </Button>
            </Modal.Footer>
          </Modal>

          <Grid
            templateColumns={{
              sm: "1fr",
              md: "1fr 1fr 1fr",
              xl: "1fr 1fr 1fr 1fr",
            }}
            templateRows={{ sm: "auto auto auto", md: "1fr auto", xl: "1fr" }}
            gap='26px'
            marginTop="25px">
            {userData.map((data, id) => {

              return <Card p='16px' display='flex' align='center' justify='center'>
                <CardBody>
                  <Flex direction='column' align='center' w='100%' py='14px'>
                    {data[1].split('.')[1] == 'pdf' ? (
                      <div style={{ "height": "230px", "margin": "" }}>
                        <iframe src={ipofserver+"" + data[7]} style={{ "height": "230px","width":"260px","borderRadius":"15px"}} />
                      </div>
                    ) : (
                      <Avatar
                        src={ipofserver+"" + data[7]}
                        w='260px'
                        h='230px'
                        borderRadius='15px' />
                    )}
                    {/* <Avatar
                      src={data[1].split('.')[1] == 'pdf'
                        ? require("assets/img/pdf.jpg")
                        : require("assets/img/img.jpg")}
                      // src={require("assets/img/img.jpg")}
                      w='230px'
                      h='230px'
                      borderRadius='15px' /> */}
                    <Flex
                      direction='column'
                      m='14px'
                      justify='center'
                      textAlign='center'
                      align='center'
                      w='100%'>
                      <HSeparator />
                    </Flex>
                    <Text fontSize='18' color={textColor} fontWeight='bold'>
                      {"File Name : " + data[1]}
                    </Text>
                    <Text fontSize='14' color={textColor} fontWeight='bold'>
                      {"Watermark Type : " + data[6]}
                    </Text>
                    <Text fontSize='14' color={textColor} fontWeight='bold'>
                      {"Date of upload : " + data[5]}
                    </Text>
                    <Grid
                      templateColumns={{
                        sm: "1fr",
                        md: "1fr 1fr",
                        // xl: "1fr 1fr 1fr 1fr",
                      }}
                      gap='75px'
                      marginTop="5">
                      <Button
                        fontSize='15'
                        variant='dark'
                        fontWeight='bold'
                        w='120%'
                        h='45'
                        mb='10px' onClick={event => downloadButton(event, data[0], data[1], data[2])}>
                        Download
                      </Button>
                      <Button
                        fontSize='15'
                        variant='dark'
                        fontWeight='bold'
                        w='120%'
                        h='45'
                        mb='10px' onClick={event => handleClick(event, data[0], data[1], data[2])}>
                        Share
                      </Button>
                    </Grid>
                  </Flex>
                </CardBody>
              </Card>

            })}
            {/* <Card p='16px' display='flex' align='center' justify='center'>
              <CardBody>
                <Flex
                  direction='column'
                  align='center'
                  justify='center'
                  w='100%'
                  py='14px'>
                  <IconBox as='box' h={"60px"} w={"60px"} bg={iconBlue}>
                    <Icon h={"24px"} w={"24px"} color='white' as={FaPaypal} />
                  </IconBox>
                  <Flex
                    direction='column'
                    m='14px'
                    justify='center'
                    textAlign='center'
                    align='center'
                    w='100%'>
                    <Text fontSize='md' color={textColor} fontWeight='bold'>
                      Paypal
                    </Text>
                    <Text
                      mb='24px'
                      fontSize='xs'
                      color='gray.400'
                      fontWeight='semibold'>
                      Freelance Payment
                    </Text>
                    <HSeparator />
                  </Flex>
                  <Text fontSize='lg' color={textColor} fontWeight='bold'>
                    $455.00
                  </Text>
                </Flex>
              </CardBody>
            </Card> */}

          </Grid>

        </Box>

      </Grid>
    </Flex>
  );
}

export default DisplayFiles;
