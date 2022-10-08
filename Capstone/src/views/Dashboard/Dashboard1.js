import { ipofserver } from 'global';

import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BarChart } from '@rsuite/charts';

import {
  Box,
  Button,
  Flex,
  Grid,
  list,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import Card from "components/Card/Card.js";

export default function Dashboard() {

  useEffect(() => {

    axios.get(ipofserver + 'getChartData/' + localStorage.getItem('LoginUsername'))
      .then(res => {
        // var sampleData1 = [
        //   ['1 Time', 10000],
        //   ['2 Time', 20000],
        //   ['3 Time', 30000],
        // ];

        window.myGlobalVar = res.data[0]; 
        window.myGlobalVar1 = res.data[1]; 
        window.myGlobalVar2 = res.data[2]; 

      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <Flex flexDirection='column' pt={{ base: "120px", md: "75px" }} marginTop="50">
      <Grid
        templateColumns={{ sm: "1fr", lg: "2fr 2fr" }}
        templateRows={{ lg: "repeat(2, auto)" }}
        gap='20px'>
        <Card p='0px' maxW={{ sm: "320px", md: "100%" }}>
          <div style={{
            display: 'block', width: 700, paddingLeft: 30
          }}>
            <Text color='gray.400' marginTop="10" fontSize='sm' fontWeight='bold' mb='6px'>
            Uploaded Files
            </Text>
            <BarChart name="BarChart" data={window.myGlobalVar} />
          </div >
        </Card>
        <Card p='0px' maxW={{ sm: "320px", md: "100%" }}>
          <div style={{
            display: 'block', width: 700, paddingLeft: 30
          }}>
            <Text color='gray.400' marginTop="10" fontSize='sm' fontWeight='bold' mb='6px'>
            Shared Files
            </Text>
            <BarChart name="BarChart" data={window.myGlobalVar1} />
          </div >
        </Card>
        <Card p='0px' maxW={{ sm: "320px", md: "100%" }}>
          <div style={{
            display: 'block', width: 700, paddingLeft: 30
          }}>
            <Text color='gray.400' marginTop="10" fontSize='sm' fontWeight='bold' mb='6px'>
              Received files
            </Text>
            <BarChart name="BarChart" data={window.myGlobalVar2} />
          </div >
        </Card>
      </Grid>
    </Flex >
  );
}
