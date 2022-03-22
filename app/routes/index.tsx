import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Link } from "remix";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();

  return (
    <Flex
      as="main"
      position="relative"
      minHeight="100vh"
      backgroundColor="gray.50"
      alignItems={{ base: "stretch", sm: "center" }}
      justifyContent={{ base: "flex-start", sm: "center" }}
    >
      <Box position="relative" width="100%" paddingBottom={16} paddingTop={8}>
        <Box marginX="auto" maxWidth="7xl" paddingX={{ base: 6, lg: 8 }}>
          <Box
            position="relative"
            boxShadow="xl"
            overflow={{ base: "visible", sm: "hidden" }}
            borderRadius="2xl"
          >
            <Box width="100%" position="absolute" inset="0 0 0 0">
              <Image
                height="100%"
                width="100%"
                objectFit="cover"
                src="https://user-images.githubusercontent.com/44916285/159194824-2bdfed7c-24ab-4b98-b9fc-dc2001f1bf7c.jpeg"
                alt="Blink-182 on Big Day Out festival"
              />
              <Box
                position="absolute"
                inset="0 0 0 0"
                bg="rgba(255, 25, 12, 0.5)"
                mixBlendMode="multiply"
              />
            </Box>
            <Box
              position="relative"
              paddingX={{ base: 4, sm: 6, lg: 8 }}
              paddingTop={{ base: 16, sm: 24, lg: 32 }}
              paddingBottom={{ base: 8, lg: 14 }}
            >
              <Heading
                as="h1"
                textAlign="center"
                fontSize={{ base: "6xl", sm: "8xl", lg: "9xl" }}
                fontWeight="extrabold"
                letterSpacing="-0.025em"
                textTransform="uppercase"
                color="red.600"
                lineHeight="1"
                dropShadow="md"
              >
                Pop Punk Stack
              </Heading>
              <Text
                as="p"
                marginX="auto"
                marginTop={6}
                maxWidth={{ base: "lg", sm: "3xl" }}
                textAlign="center"
                fontWeight="semibold"
                fontSize="xl"
                color="white"
              >
                Check the README.md file for instructions on how to get this
                project deployed.
              </Text>
              <Box
                marginX="auto"
                marginTop="10"
                maxWidth={{ base: "sm", sm: "none" }}
                display={{ base: "none", sm: "flex" }}
                justifyContent={{ base: "none", sm: "center" }}
              >
                {user ? (
                  <Flex
                    as={Link}
                    to="/notes"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="md"
                    backgroundColor="white"
                    paddingX={{ base: 4, md: 8 }}
                    paddingY={3}
                    fontWeight="semibold"
                    color="red.700"
                    dropShadow="sm"
                    _hover={{
                      backgroundColor: "red.50",
                    }}
                  >
                    View Notes for {user.email}
                  </Flex>
                ) : (
                  <Box
                    marginY={{ base: 4, sm: 0 }}
                    marginX="auto"
                    display={{ base: "block", sm: "inline-grid" }}
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={5}
                  >
                    <Flex
                      as={Link}
                      to="/join"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                      backgroundColor="white"
                      paddingX={{ base: 4, md: 8 }}
                      paddingY={3}
                      fontWeight="semibold"
                      color="red.700"
                      dropShadow="sm"
                      _hover={{
                        backgroundColor: "red.50",
                      }}
                    >
                      Sign up
                    </Flex>
                    <Flex
                      as={Link}
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                      backgroundColor="red.500"
                      paddingX={{ base: 4, md: 8 }}
                      paddingY={3}
                      fontWeight="semibold"
                      color="white"
                      dropShadow="sm"
                      _hover={{
                        backgroundColor: "red.600",
                      }}
                      to="/login"
                    >
                      Log In
                    </Flex>
                  </Box>
                )}
              </Box>
              <a href="https://remix.run">
                <Image
                  src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                  alt="Remix"
                  marginX="auto"
                  marginTop={16}
                  width="100%"
                  maxWidth={{ base: "12rem", md: "16rem" }}
                />
              </a>
            </Box>
          </Box>
        </Box>
        <Box
          marginX="auto"
          maxWidth="7xl"
          paddingY={2}
          paddingX={{ sm: 6, lg: 8 }}
        >
          <Flex marginTop={6} flexWrap="wrap" justifyContent="center" gap={8}>
            {[
              {
                src: "https://user-images.githubusercontent.com/44916285/159195394-ab3caed7-dc3e-4b8f-9908-06f308fc5cfe.png",
                alt: "vercel",
                href: "https://vercel.com",
              },
              {
                src: "https://user-images.githubusercontent.com/44916285/159195073-aad47ad9-1dcb-4a06-88f3-0f069f10c436.png",
                alt: "mysql",
                href: "https://www.mysql.com/",
              },
              {
                src: "https://user-images.githubusercontent.com/44916285/159195347-eff04fe9-9a62-42af-a04a-b7fdd09084b6.png",
                alt: "planetscale",
                href: "https://planetscale.com/",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg",
                alt: "Prisma",
                href: "https://prisma.io",
              },
              {
                src: "https://user-images.githubusercontent.com/44916285/159196769-a7f669a2-4a25-4cc3-9a0b-bccc71bbd651.png",
                alt: "chakra-ui",
                href: "https://chakra-ui.com/",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
                alt: "Cypress",
                href: "https://www.cypress.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
                alt: "MSW",
                href: "https://mswjs.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
                alt: "Vitest",
                href: "https://vitest.dev",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
                alt: "Testing Library",
                href: "https://testing-library.com",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
                alt: "Prettier",
                href: "https://prettier.io",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
                alt: "ESLint",
                href: "https://eslint.org",
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
                alt: "TypeScript",
                href: "https://typescriptlang.org",
              },
            ].map((img) => (
              <Flex
                as="a"
                key={img.href}
                href={img.href}
                height={16}
                width={40}
                justifyContent="center"
                padding={1}
                filter="grayscale(100%)"
                transition="all 0.2s ease-in-out"
                _hover={{
                  filter: "grayscale(0%)",
                }}
                _focus={{
                  filter: "grayscale(0%)",
                }}
              >
                <Image alt={img.alt} src={img.src} />
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
