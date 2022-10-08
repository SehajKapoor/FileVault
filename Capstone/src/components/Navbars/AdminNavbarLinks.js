// Chakra Icons
import { BellIcon } from "@chakra-ui/icons";
// Chakra Imports
import {
  Box, Button,
  Flex,
  Menu,
  MenuButton,
  Avatar,
  MenuItem,
  MenuList, Stack, Text, useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
// Assets
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";

import titilename1 from "../../assets/img/name1.jpeg";
import titilename2 from "../../assets/img/name2.jpeg";
import titilename3 from "../../assets/img/name3.jpeg";
import titilename4 from "../../assets/img/name4.jpeg";
// Custom Icons
import { ArgonLogoDark, ArgonLogoLight, ChakraLogoDark, ChakraLogoLight, ProfileIcon, SettingsIcon } from "components/Icons/Icons";
// Custom Components
import { ItemContent } from "components/Menu/ItemContent1";
import { SearchBar } from "components/Navbars/SearchBar/SearchBar";
import { SidebarResponsive } from "components/Sidebar/Sidebar";

import React, { useEffect, useState } from 'react';
import axios from "axios";
import { ipofserver } from 'global';
import { NavLink } from "react-router-dom";
import routes from "routes.js";

export default function HeaderLinks(props) {
  const {
    variant,
    children,
    fixed,
    scrolled,
    secondary,
    onOpen,
    ...rest
  } = props;

  const { colorMode } = useColorMode();

  // Chakra Color Mode
  let navbarIcon =
    fixed && scrolled
      ? useColorModeValue("gray.700", "gray.200")
      : useColorModeValue("white", "gray.200");
  let menuBg = useColorModeValue("white", "navy.800");
  if (secondary) {
    navbarIcon = "white";
  }

  const [userData1, setUserData1] = useState([])

  useEffect(() => {
    axios.get(ipofserver + 'getAllnotification/' + localStorage.getItem('LoginUsername'))
      .then(res => {
        setUserData1(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems='center'
      flexDirection='row'>
      <SearchBar me='18px' />
      {/* <NavLink to='/admin/dashboard'>
        <Button
          ms='0px'
          px='0px'
          me={{ sm: "2px", md: "16px" }}
          color={navbarIcon}
          variant='no-effects'>
          <Text display={{ sm: "none", md: "flex" }}>Dashboard</Text>
        </Button>
      </NavLink>
      <NavLink to='/admin/DisplayFiles'>
        <Button
          ms='0px'
          px='0px'
          me={{ sm: "2px", md: "16px" }}
          color={navbarIcon}
          variant='no-effects'>
          <Text display={{ sm: "none", md: "flex" }}>My files</Text>
        </Button>
      </NavLink>
      <NavLink to='/admin/upload'>
        <Button
          ms='0px'
          px='0px'
          me={{ sm: "2px", md: "16px" }}
          color={navbarIcon}
          variant='no-effects'>
          <Text display={{ sm: "none", md: "flex" }}>Upload File</Text>
        </Button>
      </NavLink>
      <NavLink to='/admin/ReceivedFiles'>
        <Button
          ms='0px'
          px='0px'
          me={{ sm: "2px", md: "16px" }}
          color={navbarIcon}
          variant='no-effects'>
          <Text display={{ sm: "none", md: "flex" }}>Received files</Text>
        </Button>
      </NavLink>
      <NavLink to='/auth/logout'>
        <Button
          ms='0px'
          px='0px'
          me={{ sm: "2px", md: "16px" }}
          color={navbarIcon}
          variant='no-effects'>
          <Text display={{ sm: "none", md: "flex" }} >Logout</Text>
        </Button>
      </NavLink> */}
      {/* <NavLink to='/auth/logout'>
        <Button
          ms='0px'
          px='0px'
          me={{ sm: "2px", md: "16px" }}
          color={navbarIcon}
          variant='no-effects'
          rightIcon={
            document.documentElement.dir ? (
              ""
            ) : (
              <ProfileIcon color={navbarIcon} w='22px' h='22px' me='0px' />
            )
          }
          leftIcon={
            document.documentElement.dir ? (
              <ProfileIcon color={navbarIcon} w='22px' h='22px' me='0px' />
            ) : (
              ""
            )
          }>
          <Text display={{ sm: "none", md: "flex" }}>Logout</Text>
        </Button>
      </NavLink> */}
      <SidebarResponsive
        hamburgerColor={"white"}
        logo={
          <Stack direction='row' spacing='12px' align='center' justify='center'>
            {/* {colorMode === "dark" ? (
              <ArgonLogoLight w='74px' h='27px' />
            ) : (
              <ArgonLogoDark w='74px' h='27px' />
            )}
            <Box
              w='1px'
              h='20px'
              bg={colorMode === "dark" ? "white" : "gray.700"}
            />
            {colorMode === "dark" ? (
              <ChakraLogoLight w='82px' h='21px' />
            ) : (
              <ChakraLogoDark w='82px' h='21px' />
            )} */}
            <Avatar src={titilename1} w="100%" h="100%" borderRadius="12px" />
          </Stack>
        }
        colorMode={colorMode}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />
      <SettingsIcon
        cursor='pointer'
        ms={{ base: "16px", xl: "0px" }}
        me='16px'
        onClick={props.onOpen}
        color={navbarIcon}
        w='18px'
        h='18px'
      />
      <Menu>
        <MenuButton>
          <BellIcon color={navbarIcon} w='18px' h='18px' />
        </MenuButton>
        <MenuList p='16px 8px' bg={menuBg}>
          <Flex flexDirection='column'>
            {userData1.map((data, id) => {
              return <MenuItem borderRadius='8px' mb='10px'>
                <ItemContent
                  time={"Your conditions are " + data[11]}
                  info={data[3]}
                  boldInfo='New Message from user'
                  aName="sdfsdf"
                  aSrc={ipofserver + data[9]}
                />
              </MenuItem>

            })}
            {/* <MenuItem borderRadius='8px' mb='10px'>
              <ItemContent
                time='2 days ago'
                info='by Josh Henry'
                boldInfo='New Album'
                aName='Josh Henry'
                aSrc={avatar2}
              />
            </MenuItem>
            <MenuItem borderRadius='8px'>
              <ItemContent
                time='3 days ago'
                info='Payment succesfully completed!'
                boldInfo=''
                aName='Kara'
                aSrc={avatar3}
              />
            </MenuItem> */}
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}