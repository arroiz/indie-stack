import { Divider, Heading, Text, Box, Button } from "@chakra-ui/react";
import type { LoaderFunction, ActionFunction } from "remix";
import { redirect } from "remix";
import { json, useLoaderData, useCatch, Form } from "remix";
import invariant from "tiny-invariant";
import type { Note } from "~/models/note.server";
import { deleteNote } from "~/models/note.server";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  note: Note;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ note });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <Box>
      <Heading as="h3" fontSize="2xl" fontWeight="bold">
        {data.note.title}
      </Heading>
      <Text as="p" paddingY={6}>
        {data.note.body}
      </Text>
      <Divider marginY={4} />
      <Form method="post">
        <Button
          type="submit"
          borderRadius="base"
          backgroundColor="blue.500"
          paddingY={2}
          paddingX={4}
          color="white"
          _hover={{ backgroundColor: "blue.600" }}
          _focus={{ backgroundColor: "blue.400" }}
        >
          Delete
        </Button>
      </Form>
    </Box>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
