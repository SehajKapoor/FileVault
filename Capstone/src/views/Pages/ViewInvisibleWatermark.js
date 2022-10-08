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

import fileDownload from 'js-file-download'

function ViewInvisibleWatermark() {
  // Chakra color mode

  const bgForm = useColorModeValue("white", "navy.800");

  const [selectedFile, setSelectedFile] = useState();

  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {

    setSelectedFile(event.target.files[0]);

    setIsFilePicked(true);

  };


  const handleSubmission = () => {

    if (selectedFile == '') {
      alert("Please select file !")
    }
    else {

      const formData = new FormData();

      formData.append('File', selectedFile);

      axios.post(ipofserver + 'ViewVisibleWatermark', formData)
        .then(function (response) {
          // alert(typeof (response.data))
          
          if (response.data == "PDF") {
  
            axios.get(ipofserver+"static/DownloadedFile/resized.jpg", {
              responseType: 'blob',
            })
              .then((res) => {
                fileDownload(res.data, "resized.jpg")
              })
          }
          else if (response.data == "Image") {
  
            axios.get(ipofserver+"static/DownloadedFile/resized.jpg", {
              responseType: 'blob',
            })
              .then((res) => {
                fileDownload(res.data, "resized.jpg")
              })
          }
          else {
            alert("You uploaded wrong file!")
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
      marginTop="10"
      overflow='hidden'>
      <Flex
        direction='column'
        textAlign='center'
        justifyContent='center'
        align='center'
        mt='75px'
        mb='10px'>
        <Text fontSize='4xl' color='white' fontWeight='bold'>
        Checking and Extracting Invisible Watermark
        </Text>
      </Flex>
      <Flex alignItems='center' justifyContent='center' mb='60px' mt='15' >
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
              Select Watermark File
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

export default ViewInvisibleWatermark;
