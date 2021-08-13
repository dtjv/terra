import {
  Text,
  Grid,
  GridItem,
  SimpleGrid,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Box,
  Spacer,
  Flex,
  Select,
  HStack,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import {
  AddIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'

const Top = () => {
  return (
    <Box
      py={4}
      px={16}
      mx="auto"
      maxW="6xl"
      bg={useColorModeValue('whiteAlpha.700', 'gray.800')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'whiteAlpha.400')}
    >
      <Flex>
        <Flex>
          <HStack spacing={4}>
            <Flex>
              <IconButton
                variant="ghost"
                fontSize="1.5rem"
                aria-label="Previous Day"
                icon={<ChevronLeftIcon />}
              />
              <IconButton
                variant="ghost"
                fontSize="1.5rem"
                aria-label="Next Day"
                icon={<ChevronRightIcon />}
              />
            </Flex>
            <Heading as="h3" size="md">
              August 13, 2021{' '}
            </Heading>
          </HStack>
        </Flex>
        <Spacer />
        <Box>
          <Select placeholder="Day" variant="outline">
            <option value="week">Week</option>
          </Select>
        </Box>
      </Flex>
    </Box>
  )
}

const Toolbar = () => {
  return (
    <Box py={8}>
      <HStack spacing={6}>
        <Button
          px={6}
          fontWeight="normal"
          leftIcon={<AddIcon />}
          colorScheme="teal"
          variant="solid"
        >
          Create
        </Button>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.400" />}
          />
          <Input
            type="text"
            placeholder="Search"
            bg={useColorModeValue('whiteAlpha.900', 'gray.600')}
            focusBorderColor="teal.500"
            _placeholder={{
              color: useColorModeValue('gray.400', 'whiteAlpha.700'),
            }}
          />
        </InputGroup>
      </HStack>
    </Box>
  )
}

const RowWithLine = () => {
  return (
    <>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      >
        <Flex h="100%">
          <Spacer />
          <Box
            w="20px"
            borderBottomWidth="1px"
            borderColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
          ></Box>
        </Flex>
      </GridItem>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      ></GridItem>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      ></GridItem>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      ></GridItem>
    </>
  )
}

const RowWithTime = ({ time }: { time: string }) => {
  return (
    <>
      <GridItem
        position="relative"
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      >
        <Box
          position="absolute"
          bg="inherit"
          top="-.6rem"
          right="1rem"
          w="100%"
        >
          <Flex height="auto" direction="column" align="flex-end" mr="10px">
            <Text fontSize="sm" fontWeight="medium">
              {time}
            </Text>
          </Flex>
        </Box>
      </GridItem>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      ></GridItem>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      ></GridItem>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      ></GridItem>
    </>
  )
}

const RowWithNone = () => {
  return (
    <>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      ></GridItem>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      ></GridItem>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      ></GridItem>
      <GridItem
        borderRightWidth="1px"
        borderRightColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
      ></GridItem>
    </>
  )
}

const Schedule = () => {
  return (
    <Box>
      <SimpleGrid
        templateColumns="80px repeat(3, minmax(100px, 1fr))"
        rows={2}
        spacing={0}
      >
        <Box height="40px"></Box>
        <Flex height="40px" align="center" justify="center">
          <Text fontSize="md" fontWeight="semibold">
            Truck 102
          </Text>
        </Flex>
        <Flex height="40px" align="center" justify="center">
          <Text fontSize="md" fontWeight="semibold">
            Truck 103
          </Text>
        </Flex>
        <Flex height="40px" align="center" justify="center">
          <Text fontSize="md" fontWeight="semibold">
            Truck 302
          </Text>
        </Flex>
        <Flex
          height="20px"
          borderRightWidth="1px"
          borderColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
        >
          <Spacer />
          <Box
            w="20px"
            borderBottomWidth="1px"
            borderColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
          ></Box>
        </Flex>
        <Box
          height="20px"
          borderRightWidth="1px"
          borderBottomWidth="1px"
          borderColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
        ></Box>
        <Box
          height="20px"
          borderRightWidth="1px"
          borderBottomWidth="1px"
          borderColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
        ></Box>
        <Box
          height="20px"
          borderRightWidth="1px"
          borderBottomWidth="1px"
          borderColor={useColorModeValue('gray.300', 'whiteAlpha.400')}
        ></Box>
      </SimpleGrid>
      <Box
        sx={{
          overscrollBehavior: 'contain',
        }}
        overflowY="auto"
        h="calc(100vh - 15rem)"
      >
        <Grid
          templateRows="repeat(16, minmax(35px, 1fr))"
          templateColumns="80px repeat(3, minmax(100px, 1fr))"
        >
          <RowWithNone />
          <RowWithLine />
          <RowWithTime time="8 AM" />
          <RowWithLine />
          <RowWithTime time="9 AM" />
          <RowWithLine />
          <RowWithTime time="10 AM" />
          <RowWithLine />
          <RowWithTime time="11 AM" />
          <RowWithLine />
          <RowWithTime time="12 PM" />
          <RowWithLine />
          <RowWithTime time="1 PM" />
          <RowWithLine />
          <RowWithTime time="2 PM" />
          <RowWithNone />
        </Grid>
      </Box>
    </Box>
  )
}

export const Demo = () => {
  return (
    <Box h="100%" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Top />
      <Box px={16} mx="auto" maxW="6xl">
        <Toolbar />
        <Schedule />
      </Box>
    </Box>
  )
}
