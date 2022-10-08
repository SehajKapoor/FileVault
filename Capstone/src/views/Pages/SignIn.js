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
import signInImage from "assets/img/signInImage.png";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";

import React, { useState } from 'react';
import axios from "axios";
import { ipofserver } from 'global';

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");
  const colorIcons = useColorModeValue("gray.700", "white");
  const bgIcons = useColorModeValue("trasnparent", "navy.700");
  const bgIconsHover = useColorModeValue("gray.50", "whiteAlpha.100");

  const [inputField, setInputField] = useState({
    username: '',
    password: ''
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
      username: '',
      password: ''
    });
  }

  function setData(sessionname){
    localStorage.setItem('LoginUsername', sessionname);
  }

  const submitButton = () => {
    // alert(inputField.password)
    if (inputField.username == '' || inputField.password == '') {
      alert("Please enter all details !")
      clearInput()
    }
    else {
      axios.post(ipofserver + 'userLogin', {
        username: inputField.username,
        password: inputField.password
      })
        .then(function (response) {

          if (response.data == "success") { 
            setData(inputField.username)         
            window.location.href = '/argon-dashboard-chakra#/admin/DisplayFiles'
          }
          else {
            alert("Invalid username and password !")
            clearInput()
          }
        })
        .catch(function (error) {
          return error;
        });
    }
  }

  return (
    <Flex position='relative' mb='40px'>
      <Flex
        minH={{ md: "1000px" }}
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w='100%'
        maxW='1044px'
        mx='auto'
        justifyContent='space-between'
        mb='30px'
        pt={{ md: "0px" }}>
        <Flex
          w='100%'
          h='100%'
          alignItems='center'
          justifyContent='center'
          mb='60px'
          mt={{ base: "50px", md: "20px" }}>
          <Flex
            zIndex='2'
            direction='column'
            w='445px'
            background='transparent'
            borderRadius='15px'
            p='40px'
            mx={{ base: "100px" }}
            m={{ base: "20px", md: "auto" }}
            bg={bgForm}
            boxShadow={useColorModeValue(
              "0px 5px 14px rgba(0, 0, 0, 0.05)",
              "unset"
            )}>
            <Text
              fontSize='xl'
              color={textColor}
              fontWeight='bold'
              textAlign='center'
              mb='22px'>
              Login With
            </Text>
            <HStack spacing='15px' justify='center' mb='22px'>
              <Flex
                justify='center'
                align='center'
                w='75px'
                h='75px'
                borderRadius='8px'
                border={useColorModeValue("1px solid", "0px")}
                borderColor='gray.200'
                cursor='pointer'
                transition='all .25s ease'
                bg={bgIcons}
                _hover={{ bg: bgIconsHover }}>
                <Link href='#'>
                  <Icon as={FaFacebook} color={colorIcons} w='30px' h='30px' />
                </Link>
              </Flex>
              <Flex
                justify='center'
                align='center'
                w='75px'
                h='75px'
                borderRadius='8px'
                border={useColorModeValue("1px solid", "0px")}
                borderColor='gray.200'
                cursor='pointer'
                transition='all .25s ease'
                bg={bgIcons}
                _hover={{ bg: bgIconsHover }}>
                <Link href='#'>
                  <Icon
                    as={FaApple}
                    color={colorIcons}
                    w='30px'
                    h='30px'
                    _hover={{ filter: "brightness(120%)" }}
                  />
                </Link>
              </Flex>
              <Flex
                justify='center'
                align='center'
                w='75px'
                h='75px'
                borderRadius='8px'
                border={useColorModeValue("1px solid", "0px")}
                borderColor='gray.200'
                cursor='pointer'
                transition='all .25s ease'
                bg={bgIcons}
                _hover={{ bg: bgIconsHover }}>
                <Link href='#'>
                  <Icon
                    as={FaGoogle}
                    color={colorIcons}
                    w='30px'
                    h='30px'
                    _hover={{ filter: "brightness(120%)" }}
                  />
                </Link>
              </Flex>
            </HStack>
            <Text
              fontSize='lg'
              color='gray.400'
              fontWeight='bold'
              textAlign='center'
              mb='22px'>
              or
            </Text>
            <FormControl onSubmit={(e) => this.submit(e, this.state.username)} method="POST">
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Username
              </FormLabel>
              <Input
                variant='auth'
                fontSize='sm'
                ms='4px'
                type='text'
                placeholder='Your username'
                mb='24px'
                size='lg'
                name="username" value={inputField.username}
                onChange={inputsHandler} required
              />
              <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
                Password
              </FormLabel>
              <Input
                variant='auth'
                fontSize='sm'
                ms='4px'
                type='password'
                placeholder='Your password'
                mb='24px'
                size='lg'
                name="password" value={inputField.password}
                onChange={inputsHandler} required
              />
              <FormControl display='flex' alignItems='center' mb='24px'>
                <Switch id='remember-login' colorScheme='blue' me='10px' />
                <FormLabel htmlFor='remember-login' mb='0' fontWeight='normal'>
                  Remember me
                </FormLabel>
              </FormControl>
              <Button
                fontSize='15'
                variant='dark'
                fontWeight='bold'
                w='100%'
                h='45'
                mb='24px'
                onClick={submitButton}>
                SIGN IN
              </Button>
            </FormControl>
            <Flex
              flexDirection='column'
              justifyContent='center'
              alignItems='center'
              maxW='100%'
              mt='0px'>
              <Text color={textColor} fontWeight='medium'>
                Already have an account?
                <Link
                  color={titleColor}
                  as='span'
                  ms='5px'
                  href='#'
                  fontWeight='bold'>
                  Sign Up
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          overflowX='hidden'
          h='100%'
          w='100%'
          left='0px'
          position='absolute'
          bgImage={signInImage}>
          <Box
            w='100%'
            h='100%'
            bgSize='cover'
            bg='blue.500'
            opacity='0.8'></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
