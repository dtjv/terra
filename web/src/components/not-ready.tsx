import { Icon, VStack, Flex, Heading, Text, Button } from '@chakra-ui/react'
import { FaTools } from 'react-icons/fa'
import NextLink from 'next/link'

export const NotReadyYet = () => (
  <Flex direction="column" h="100%" align="center" justify="center">
    <Flex
      align="center"
      justify="center"
      borderRadius="full"
      bg="teal.100"
      color="purple.700"
      p={12}
      mb={2}
    >
      <Icon as={FaTools} boxSize={16} />
    </Flex>
    <VStack spacing={2}>
      <Heading>This page isn't ready yet</Heading>
      <Text color="gray.500">
        Check back later to see what we built for you.
      </Text>
    </VStack>
    <Flex mt={8}>
      <NextLink href="/admin" passHref>
        <Button as="a" variant="outline" colorScheme="teal">
          Go back to Dashboard
        </Button>
      </NextLink>
    </Flex>
  </Flex>
)
