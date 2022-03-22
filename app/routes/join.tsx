import * as React from "react";
import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import {
  Form,
  Link,
  redirect,
  useSearchParams,
  json,
  useActionData,
} from "remix";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { validateEmail } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Flex
      minHeight="100vh"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box marginX="auto" width="100%" maxWidth="md" paddingX={8}>
        <Flex as={Form} flexDirection="column" method="post" gap={6}>
          <Box>
            <Text
              as="label"
              htmlFor="email"
              display="block"
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
            >
              Email address
            </Text>
            <Box marginTop={1}>
              <Input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                width="100%"
                borderRadius="base"
                borderWidth="1px"
                borderColor="gray.500"
                paddingX={2}
                paddingY={1}
                fontSize="lg"
              />
              {actionData?.errors?.email && (
                <Box paddingTop={1} color="red.700" id="email-error">
                  {actionData.errors.email}
                </Box>
              )}
            </Box>
          </Box>

          <Box>
            <Text
              as="label"
              htmlFor="password"
              display="block"
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
            >
              Password
            </Text>
            <Box marginTop={1}>
              <Input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                width="100%"
                borderRadius="base"
                borderWidth="1px"
                borderColor="gray.500"
                paddingX={2}
                paddingY={1}
                fontSize="lg"
              />
              {actionData?.errors?.password && (
                <Box paddingTop={1} color="red.700" id="password-error">
                  {actionData.errors.password}
                </Box>
              )}
            </Box>
          </Box>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button
            type="submit"
            width="100%"
            borderRadius="base"
            backgroundColor="blue.500"
            paddingX={4}
            paddingY={2}
            color="white"
            _hover={{ backgroundColor: "blue.600" }}
            _focus={{ backgroundColor: "blue.600" }}
          >
            Create Account
          </Button>
          <Flex alignItems="center" justifyContent="center">
            <Box textAlign="center" fontSize="sm" color="gray.500">
              Already have an account?{" "}
              <Box
                as={Link}
                color="blue.500"
                textDecoration="underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
