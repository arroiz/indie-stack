import { Form, json, useLoaderData, Outlet, Link, NavLink } from "remix";
import type { LoaderFunction } from "remix";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getNoteListItems } from "~/models/note.server";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";

type LoaderData = {
  noteListItems: Awaited<ReturnType<typeof getNoteListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json<LoaderData>({ noteListItems });
};

export default function NotesPage() {
  const data = useLoaderData<LoaderData>();
  const user = useUser();

  return (
    <Flex height="100%" minHeight="100vh" flexDirection="column">
      <Flex
        as="header"
        alignItems="center"
        justifyContent="space-between"
        bg="gray.700"
        padding={4}
        color="white"
      >
        <Heading as="h1" fontSize="3xl" fontWeight="bold">
          <Box as={Link} to=".">
            Notes
          </Box>
        </Heading>
        <Text>{user.email}</Text>
        <Box as={Form} action="/logout" method="post">
          <Button
            type="submit"
            borderRadius="base"
            bg="gray.600"
            paddingY={2}
            paddingX={4}
            color="blue.100"
            _hover={{ bg: "blue.500" }}
            _active={{ bg: "blue.600" }}
          >
            Logout
          </Button>
        </Box>
      </Flex>

      <Flex as="main" flex="1" height="100%" bg="white">
        <Flex flexDirection="column" width={80} bg="gray.50">
          <Box
            as={Link}
            to="new"
            display="block"
            padding={4}
            fontSize="xl"
            color="blue.500"
          >
            + New Note
          </Box>

          <Divider />

          {data.noteListItems.length === 0 ? (
            <Text padding={4}>No notes yet</Text>
          ) : (
            <ol>
              {data.noteListItems.map((note) => (
                <li key={note.id}>
                  <ChakraLink
                    as={NavLink}
                    display="block"
                    padding={4}
                    fontSize="xl"
                    _activeLink={{ backgroundColor: "white" }}
                    to={note.id}
                  >
                    📝 {note.title}
                  </ChakraLink>
                </li>
              ))}
            </ol>
          )}
        </Flex>

        <Flex flex="1" padding={6}>
          <Outlet />
        </Flex>
      </Flex>
    </Flex>
  );
}
