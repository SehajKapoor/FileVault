// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Icon,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets

import React, { useState } from 'react';
import axios from "axios";
import { ipofserver } from 'global';

import Form from 'react-bootstrap/Form';

function upload() {
  // Chakra color mode

  const bgForm = useColorModeValue("white", "navy.800");

  const [selectedFile, setSelectedFile] = useState();

  const [isFilePicked, setIsFilePicked] = useState(false);

  const [selectedHospital, setSelectedHospital] = useState('');

  const [inputField, setInputField] = useState({
    filename: ''
  })

  const inputsHandler = (e) => {
    const { name, value } = e.target;
    setInputField((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const changeHandler = (event) => {

    setSelectedFile(event.target.files[0]);

    setIsFilePicked(true);

  };


  const handleSubmission = () => {

    if (selectedHospital == '' || inputField.filename == '') {
      alert("Please select file !")
    }
    else {

      const formData = new FormData();

      formData.append('File', selectedFile);
      formData.append('watermarkedtype', selectedHospital);
      formData.append('filename', inputField.filename);
      formData.append('Username', localStorage.getItem('LoginUsername'));

      axios.post(ipofserver + 'uploadFile', formData)
        .then(function (response) {
          // alert(typeof (response.data))
          if (response.data == "success") {
            alert("File Uploaded !")
          }
          else {
            alert("Something wrong !")
          }
        })
        .catch(function (error) {
          return error;
        });

    }
  };

  return (
    <Flex
      direction='column'
      alignSelf='center'
      justifySelf='center'
      overflow='hidden'>
      <Flex
        direction='column'
        textAlign='center'
        justifyContent='center'
        align='center'
        mt='75px'
        mb='10px'>
        <Text fontSize='4xl' color='white' fontWeight='bold'>
          Upload file
        </Text>
      </Flex>
      <Flex alignItems='center' justifyContent='center' mb='60px' mt='20px' >
        <Flex
          direction='column'
          w='750px'
          background='transparent'
          borderRadius='15px'
          p='40px'
          mx={{ base: "100px" }}
          bg={bgForm}
          boxShadow={useColorModeValue(
            "0px 5px 14px rgba(0, 0, 0, 0.05)",
            "unset"
          )}>
          <FormControl method="POST">
            <FormLabel ms='4px' fontSize='18' fontWeight='normal'>
              Select file
            </FormLabel>
            <Input
              variant='auth'
              fontSize='sm'
              ms='4px'
              type='file'
              paddingTop='2.5'
              mb='24px'
              size='lg'
              name="file" onChange={changeHandler}
            />
            <FormLabel ms='4px' fontSize='18' fontWeight='normal'>
              Watermaked type
            </FormLabel>
            <Form.Select onChange={e => setSelectedHospital(e.target.value)}>
              <option value="">Select type</option>
              <option value="Visible">Visible</option>
              <option value="Invisible">Invisible</option>
              <option value="Both">Both</option>
            </Form.Select>
            <FormLabel ms='4px' fontSize='18' fontWeight='normal' mt='7'>
              File name
            </FormLabel>
            <Input
              variant='auth'
              fontSize='sm'
              ms='4px'
              type='text'
              mb='24px'
              placeholder='File name'
              size='lg'
              name="filename" value={inputField.filename}
              onChange={inputsHandler}
            />
            {/* <FormControl display='flex' alignItems='center' mb='24px'>
              <Switch id='remember-login' colorScheme='blue' me='10px' />
              <FormLabel htmlFor='remember-login' mb='0' fontWeight='normal'>
                Remember me
              </FormLabel>
            </FormControl> */}
            <Button
              fontSize='15'
              variant='dark'
              fontWeight='bold'
              w='100%'
              h='45'
              mb='10px'
              onClick={handleSubmission}>
              Upload file
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default upload;
