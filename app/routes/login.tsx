import * as React from "react";
import type { ActionFunction, LoaderFunction, MetaFunction } from "remix";
import {
  Form,
  json,
  Link,
  useActionData,
  redirect,
  useSearchParams,
} from "remix";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { validateEmail } from "~/utils";
import { Box, Button, Checkbox, Flex, Input, Text } from "@chakra-ui/react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");

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

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/notes",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/notes";
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
    <Flex minHeight="100vh" flexDir="column" justify="center">
      <Box marginX="auto" width="100%" maxWidth="md" paddingX={8}>
        <Flex as={Form} method="post" flexDirection="column" gap={6}>
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
              htmlFor="password"
              as="label"
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
            Log in
          </Button>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <Checkbox
                id="remember"
                name="remember"
                type="checkbox"
                height={4}
                width={4}
                borderRadius="base"
                borderColor="gray.300"
                color="blue.600"
              />
              <Text
                as="label"
                htmlFor="remember"
                marginLeft={2}
                display="block"
                fontSize="sm"
                color="gray.900"
              >
                Remember me
              </Text>
            </Flex>
            <Box textAlign="center" fontSize="sm" color="gray.500">
              Don't have an account?{" "}
              <Box
                as={Link}
                color="blue.500"
                textDecoration="underline"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
