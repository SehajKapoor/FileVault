// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
  LightMode,
} from "@chakra-ui/react";
// Assets
import BgSignUp from "assets/img/BgSignUp.png";
import React, { useState } from 'react';
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";

import axios from "axios";
import { ipofserver } from 'global';

function SignUp() {
  const bgForm = useColorModeValue("white", "navy.800");
  const titleColor = useColorModeValue("gray.700", "blue.500");
  const textColor = useColorModeValue("gray.700", "white");
  const colorIcons = useColorModeValue("gray.700", "white");
  const bgIcons = useColorModeValue("trasnparent", "navy.700");
  const bgIconsHover = useColorModeValue("gray.50", "whiteAlpha.100");

  const [inputField, setInputField] = useState({
    username: '',
    email: '',
    mobile: '',
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
      email: '',
      mobile: '',
      password: ''
    });
  }

  const submitButton = () => {
    // alert(inputField.password)
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (inputField.username == '' || inputField.email == '' || inputField.mobile == '' || inputField.password == '') {
      alert("Please enter all details !")
      clearInput()
    }
    else if(inputField.mobile.length != 10)
    {
      alert("Please enter valid mobile number !")
      clearInput()
    }
    else if(!filter.test(inputField.email))
    {
      alert("Please enter valid email !")
      clearInput()
    }
    else {
      axios.post(ipofserver + 'userRegister', {
        username: inputField.username,
        email: inputField.email,
        mobile: inputField.mobile,
        password: inputField.password
      })
        .then(function (response) {
          // alert(typeof(response.data))
          if (response.data == "success") {
            alert("User added successfully !")
            clearInput()
            window.location.href = '#/auth/signin'
          }
          else {
            alert("Something wrong !")
            clearInput()
          }
        })
        .catch(function (error) {
          return error;
        });
    }
  }

  return (
    <Flex
      direction='column'
      alignSelf='center'
      justifySelf='center'
      overflow='hidden'>
      <Box
        position='absolute'
        minH={{ base: "70vh", md: "50vh" }}
        maxH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        maxW={{ md: "calc(100vw - 50px)" }}
        left='0'
        right='0'
        bgRepeat='no-repeat'
        overflow='hidden'
        zIndex='-1'
        top='0'
        bgImage={BgSignUp}
        bgSize='cover'
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}
        borderRadius={{ base: "0px", md: "20px" }}>
        <Box w='100vw' h='100vh' bg='blue.500' opacity='0.8'></Box>
      </Box>
      <Flex
        direction='column'
        textAlign='center'
        justifyContent='center'
        align='center'
        mt='125px'
        mb='30px'>
        <Text fontSize='4xl' color='white' fontWeight='bold'>
          Welcome!
        </Text>
        <Text
          fontSize='20'
          color='white'
          fontWeight='normal'
          mt='10px'
          mb='26px'
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "333px" }}>
          {/* Use these awesome forms to login or create new account in your project
          for free. */}
          Please Register Itself !
        </Text>
      </Flex>
      <Flex alignItems='center' justifyContent='center' mb='60px' mt='20px'>
        <Flex
          direction='column'
          w='445px'
          background='transparent'
          borderRadius='15px'
          p='40px'
          mx={{ base: "100px" }}
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
            Register With
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
          <FormControl method="POST">
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Username
            </FormLabel>
            <Input
              variant='auth'
              fontSize='sm'
              ms='4px'
              type='text'
              placeholder='Your Username'
              mb='24px'
              size='lg'
              name="username" value={inputField.username}
              onChange={inputsHandler} minLength="10" required
            />
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Email
            </FormLabel>
            <Input
              variant='auth'
              fontSize='sm'
              ms='4px'
              type='email'
              placeholder='Your email address'
              mb='24px'
              size='lg'
              name="email" value={inputField.email}
              onChange={inputsHandler} required
            />
            <FormLabel ms='4px' fontSize='sm' fontWeight='normal'>
              Mobile
            </FormLabel>
            <Input
              variant='auth'
              fontSize='sm'
              ms='4px'
              type='number'
              placeholder='Your Mobile'
              mb='24px'
              size='lg'
              name="mobile" value={inputField.mobile}
              onChange={inputsHandler} maxLength="10" minLength="10" required
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
              SIGN UP
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
                Sign In
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
