import * as React from "react";
import { Form, json, redirect, useActionData } from "remix";
import type { ActionFunction } from "remix";
import Alert from "@reach/alert";

import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { Box, Button, Text, Textarea, Input } from "@chakra-ui/react";

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json<ActionData>(
      { errors: { body: "Body is required" } },
      { status: 400 }
    );
  }

  const note = await createNote({ title, body, userId });

  return redirect(`/notes/${note.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <Box>
        <Text
          as="label"
          display="flex"
          width="100%"
          flexDirection="column"
          gap={1}
        >
          <Text>Title: </Text>
          <Input
            ref={titleRef}
            name="title"
            flex="1"
            borderRadius="md"
            borderWidth={2}
            borderColor="blue.500"
            paddingX={3}
            fontSize="lg"
            lineHeight={2}
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </Text>
        {actionData?.errors?.title && (
          <Box as={Alert} paddingTop={1} color="red.700" id="title=error">
            {actionData.errors.title}
          </Box>
        )}
      </Box>

      <Box>
        <Text
          as="label"
          display="flex"
          width="100%"
          flexDirection="column"
          gap={1}
        >
          <Text>Body: </Text>
          <Textarea
            ref={bodyRef}
            name="body"
            rows={8}
            flex="1"
            width="100%"
            borderRadius="md"
            borderWidth={2}
            borderColor="blue.500"
            paddingX={3}
            fontSize="lg"
            lineHeight={2}
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? "body-error" : undefined
            }
          />
        </Text>
        {actionData?.errors?.body && (
          <Box as={Alert} paddingTop={1} color="red.700" id="title=error">
            {actionData.errors.body}
          </Box>
        )}
      </Box>

      <Box textAlign="right">
        <Button
          type="submit"
          borderRadius="base"
          bg="blue.500"
          paddingY={2}
          paddingX={4}
          textColor="white"
          _hover={{ bg: "blue.600" }}
          _focus={{ bg: "blue.400" }}
        >
          Save
        </Button>
      </Box>
    </Form>
  );
}
