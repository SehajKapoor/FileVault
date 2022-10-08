import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Checkbox,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { ipofserver } from 'global';
import fileDownload from 'js-file-download'

import Tabless from '../../views/Dashboard/ReceivedFiles.js';

function TablesTableRow(props) {
  const { logo, name, email, subdomain, domain, status, date, isLast, alldata } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [modalShow, setModalShow] = React.useState(false);

  const submitButton = (event, id, param, param1, param2) => {

    localStorage.setItem('fileid', id);
    localStorage.setItem('filename', param);
    localStorage.setItem('uploader', param1);
    // localStorage.setItem('allcondition', param2);
    window.allcondition = param2;
    // alert(param2)
    setModalShow(true)
  }


  return (

    <Tr>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <Td
        minWidth={{ sm: "250px" }}
        pl="0px"
        borderColor={borderColor}
        borderBottom={isLast ? "none" : null}
      >
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          {logo.slice(-3) == 'pdf' ? (
            <iframe src={logo} style={{ "height": "70px", "width": "70px", "borderRadius": "12px", "marginRight": "18px" }} />
          ) : (
            <Avatar src={logo} w="70px" h="70px" borderRadius="12px" me="18px" />
          )}
          {/* <Avatar src={logo} w="50px" borderRadius="12px" me="18px" /> */}
          <Flex direction="column">
            <Text
              fontSize="md"
              color={titleColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {name}
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              {email}
            </Text>
          </Flex>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {domain}
          </Text>
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            {subdomain}
          </Text>
        </Flex>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {date}
        </Text>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Button
          fontSize='15'
          variant='dark'
          fontWeight='bold'
          w='75%'
          h='45' onClick={event => submitButton(event, alldata[0], alldata[1], alldata[2], alldata[3])}>
          Download
        </Button>
      </Td>
    </Tr>
  );
}



function MyVerticallyCenteredModal(props) {

  const [checkedOne, setCheckedOne] = React.useState(false);

  const handleChangeOne = () => {
    setCheckedOne(!checkedOne);
  };

  // const [conditionData, setconditionData] = useState(window.myGlobalVar)
  
  const closebtn = () => {
    props.onHide();
  }

  const downloadButton = () => {
    if (checkedOne.toString() == "false") {
      alert("Please accept to Terms and Conditions !")
      axios.post(ipofserver + 'changeStatus', {
        fileid: localStorage.getItem('fileid'),
        filename: localStorage.getItem('filename'),
        uploader: localStorage.getItem('uploader'),
        status: "Rejected"
      })
        .then(function (response) {
          window.location.reload(false);
          // window.location.href = '/argon-dashboard-chakra#/admin/ReceivedFiles'
        })
        .catch(function (error) {
          return error;
        });
    }
    else {
      props.onHide();
      setCheckedOne(false);
      axios.post(ipofserver + 'downloadFile', {
        fileid: localStorage.getItem('fileid'),
        filename: localStorage.getItem('filename'),
        uploader: localStorage.getItem('uploader'),
        status: "Accepted"
      })
        .then(function (response) {
          // alert(response.data)

          if (response.data == "PDF") {
            axios.get(ipofserver + "static/DownloadedFile/Watermaked.pdf", {
              responseType: 'blob',
            })
              .then((res) => {
                fileDownload(res.data, localStorage.getItem('filename'))
                window.location.reload(false);
              })

            // axios.get(ipofserver + "static/DownloadedFile/resized.jpg", {
            //   responseType: 'blob',
            // })
            //   .then((res) => {
            //     fileDownload(res.data, "resized.jpg")

            //   })
          }
          else if (response.data == "Image") {
            axios.get(ipofserver + "static/DownloadedFile/reconstructedImage.jpg", {
              responseType: 'blob',
            })
              .then((res) => {
                fileDownload(res.data, localStorage.getItem('filename'))
                window.location.reload(false);
              })

            // axios.get(ipofserver + "static/DownloadedFile/resized.jpg", {
            //   responseType: 'blob',
            // })
            //   .then((res) => {
            //     fileDownload(res.data, "resized.jpg")

            //   })
          }

          else if (response.data == "visibleimage") {
            axios.get(ipofserver + "static/DownloadedFile/Watermaked.jpg", {
              responseType: 'blob',
            })
              .then((res) => {
                fileDownload(res.data, localStorage.getItem('filename'))
                window.location.reload(false);
              })
          }

          else if (response.data == "visiblepdf") {
            axios.get(ipofserver + "static/DownloadedFile/Watermaked.pdf", {
              responseType: 'blob',
            })
              .then((res) => {
                fileDownload(res.data, localStorage.getItem('filename'))
                window.location.reload(false);
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
          For you to legally enforce your website, application, or business’s rules of use, users must first agree to your terms and conditions. Terms and conditions, also known as terms of service or terms of use, are a legal agreement.
        </p>
        <p>{window.allcondition}</p>
        {/* {conditionData.map((data1, id) => {
          return (
            <p> {id + 1 + ") " + data1}</p>
          );
        })} */}
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
          fontWeight='bold' onClick={closebtn}>Close</Button>
        <Button
          fontSize='15'
          variant='dark'
          fontWeight='bold' onClick={downloadButton}>Download</Button>
      </Modal.Footer>
    </Modal>

  );  
}

export default TablesTableRow;
