// Chakra imports
import {
  Flex,
  list,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import TablesTableRow from "components/Tables/TablesTableRow1";
import { tablesProjectData, tablesTableData } from "variables/general1";
import { ipofserver } from 'global';

import React, { useEffect, useState } from 'react';
import axios from "axios";

function Tables() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // ----------------------------------OnLoad-------------------------------------------------------------


  const [NoneData, setNoneData] = useState([])
  const [AcceptedData, setAcceptedData] = useState([])
  const [RejectedData, setRejectedData] = useState([])

  useEffect(() => {
    axios.get(ipofserver + 'receiveFiles/' + localStorage.getItem('LoginUsername'))
      .then(res => {
        // alert(res.data.length);

        var list1 = []
        var list2 = []
        var list3 = []

        for (var i = 0; i < res.data.length; i++) {
          var curlist = res.data[i]
          if (curlist[11] == "None") {
            list1.push(curlist)
          }
          else if (curlist[11] == "Accepted") {
            list2.push(curlist)
          }
          else {
            list3.push(curlist)
          }          
        }
        
        setNoneData(list1)
        setAcceptedData(list2)
        setRejectedData(list3)

      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  // ----------------------------------OnLoad-------------------------------------------------------------

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }} marginTop="50">
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Not responded files
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400" >
                <Th pl="0px" borderColor={borderColor} color="gray.400" >File info</Th>
                <Th borderColor={borderColor} color="gray.400" >Sender</Th>
                <Th borderColor={borderColor} color="gray.400" >Received date</Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {NoneData.map((data1, id) => {
                return (
                  <TablesTableRow
                    name={data1[1]}
                    logo={ipofserver + data1[9]}
                    email={data1[8]}
                    subdomain={data1[2]}
                    domain={data1[3]}
                    date={data1[7]}
                    alldata={[data1[0], data1[1], data1[3], data1[10]]}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Accepted files
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400" >
                <Th pl="0px" borderColor={borderColor} color="gray.400" >File info</Th>
                <Th borderColor={borderColor} color="gray.400" >Sender</Th>
                <Th borderColor={borderColor} color="gray.400" >Received date</Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {AcceptedData.map((data2, id) => {
                return (
                  <TablesTableRow
                    name={data2[1]}
                    logo={ipofserver + data2[9]}
                    email={data2[8]}
                    subdomain={data2[2]}
                    domain={data2[3]}
                    date={data2[7]}
                    alldata={[data2[0], data2[1], data2[3], data2[10]]}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Rejected files
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400" >
                <Th pl="0px" borderColor={borderColor} color="gray.400" >File info</Th>
                <Th borderColor={borderColor} color="gray.400" >Sender</Th>
                <Th borderColor={borderColor} color="gray.400" >Received date</Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {RejectedData.map((data3, id) => {
                return (
                  <TablesTableRow
                    name={data3[1]}
                    logo={ipofserver + data3[9]}
                    email={data3[8]}
                    subdomain={data3[2]}
                    domain={data3[3]}
                    date={data3[7]}
                    alldata={[data3[0], data3[1], data3[3], data3[10]]}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
      {/* <Card
        my="22px"
        overflowX={{ sm: "scroll", xl: "hidden" }}
        pb="0px"
      >
        <CardHeader p="6px 0px 22px 0px">
          <Flex direction="column">
            <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
              Projects Table
            </Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px">
                <Th pl="0px" color="gray.400" borderColor={borderColor}>
                  Companies
                </Th>
                <Th color="gray.400" borderColor={borderColor}>Budget</Th>
                <Th color="gray.400" borderColor={borderColor}>Status</Th>
                <Th color="gray.400" borderColor={borderColor}>Completion</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {tablesProjectData.map((row, index, arr) => {
                return (
                  <TablesProjectRow
                    name={row.name}
                    logo={row.logo}
                    status={row.status}
                    budget={row.budget}
                    progression={row.progression}
                    isLast={index === arr.length - 1 ? true : false}
                    key={index}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card> */}
    </Flex>
  );
}

export default Tables;
