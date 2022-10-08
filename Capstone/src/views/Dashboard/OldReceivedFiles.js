// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Input,
  Spacer,
  Checkbox,
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

import fileDownload from 'js-file-download'

import Modal from 'react-bootstrap/Modal';

function ReceivedFiles() {
  // Chakra color mode
  const iconBlue = useColorModeValue("blue.500", "blue.500");
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("#dee2e6", "transparent");
  const { colorMode } = useColorMode();

  // console.log(colorMode);

  // ----------------------------------OnLoad-------------------------------------------------------------


  const [userData, setUserData] = useState([])

  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    axios.get(ipofserver + 'receiveFiles/' + localStorage.getItem('LoginUsername'))
      .then(res => {
        // alert(res.data);
        // if (res.data == '') {
        //   alert("There is no file uploader !");
        // }
        // else {
          setUserData(res.data)
        // }
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  // ----------------------------------------Model Load-------------------------------------------------------

  // axios.get(ipofserver+"static/DownloadedFile/Watermaked.pdf", {
  //   responseType: 'blob',
  // })
  // .then((res) => {
  //   fileDownload(res.data, "test-download.pdf")
  // })
  // ------------------------------------Share file--------------------------------------------------------

  const submitButton = (event, id, param, param1) => {

    localStorage.setItem('fileid', id);
    localStorage.setItem('filename', param);
    localStorage.setItem('uploader', param1);
    setModalShow(true)
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
          Received files
        </Text>
      </Flex>
      <Grid templateRows='1fr'>
        <Box>

          {/* <Button variant="primary" onClick={handleShow}>
            Launch demo modal
          </Button> */}


          <MyVerticallyCenteredModal
            show={modalShow}
            onHide={() => setModalShow(false)}
          />

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
                    <Avatar
                      src={data[1].split('.')[1] == 'pdf'
                        ? require("assets/img/pdf.jpg")
                        : require("assets/img/img.jpg")}
                      // src={require("assets/img/img.jpg")}
                      w='230px'
                      h='230px'
                      borderRadius='15px' />
                    <Flex
                      direction='column'
                      m='14px'
                      justify='center'
                      textAlign='center'
                      align='center'
                      w='100%'>
                      <HSeparator />
                    </Flex>
                    <Text fontSize='20' color={textColor} fontWeight='bold'>
                      {data[1]}
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
                        w='270%'
                        h='45'
                        mb='10px' onClick={event => submitButton(event, data[0], data[1], data[2])}>
                        Download
                      </Button>
                    </Grid>
                  </Flex>
                </CardBody>
              </Card>

            })}

          </Grid>

        </Box>

      </Grid>
    </Flex>
  );
}

function MyVerticallyCenteredModal(props) {

  const [checkedOne, setCheckedOne] = React.useState(false);

  const handleChangeOne = () => {
    setCheckedOne(!checkedOne);
  };

  const downloadButton = () => {
    if (checkedOne.toString() == "false") {
      alert("Please accept to Terms and Conditions !")
    }
    else {
      props.onHide();
      setCheckedOne(false);
      axios.post(ipofserver + 'downloadFile', {
        fileid: localStorage.getItem('fileid'),
        filename: localStorage.getItem('filename'),
        uploader: localStorage.getItem('uploader')
      })
        .then(function (response) {
          // alert(response.data)

          if (response.data == "PDF") {
            axios.get(ipofserver+"static/DownloadedFile/Watermaked.pdf", {
              responseType: 'blob',
            })
              .then((res) => {
                fileDownload(res.data, localStorage.getItem('filename'))
              })

            axios.get(ipofserver+"static/DownloadedFile/resized.jpg", {
              responseType: 'blob',
            })
              .then((res) => {
                fileDownload(res.data, "resized.jpg")
              })
          }
          else if (response.data == "Image") {
            axios.get(ipofserver+"static/DownloadedFile/reconstructedImage.jpg", {
              responseType: 'blob',
            })
              .then((res) => {
                fileDownload(res.data, localStorage.getItem('filename'))
              })

            axios.get(ipofserver+"static/DownloadedFile/resized.jpg", {
              responseType: 'blob',
            })
              .then((res) => {
                fileDownload(res.data, "resized.jpg")
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

  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Term and conditions
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <h6>Content of term and condition</h6> */}
        <p>
          For you to legally enforce your website, application, or business’s rules of use, users must first agree to your terms and conditions. Terms and conditions, also known as terms of service or terms of use, are a legal agreement between you and your users that outlines the rules of use for your website, app, or business.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Checkbox
          label="Value 1"
          value={checkedOne}
          onChange={handleChangeOne} />
        <p>Agree to Terms and Conditions</p>
        <Button
          fontSize='15'
          variant='dark'
          fontWeight='bold' onClick={props.onHide}>Close</Button>
        <Button
          fontSize='15'
          variant='dark'
          fontWeight='bold' onClick={downloadButton}>Download</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReceivedFiles;
