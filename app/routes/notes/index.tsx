import { Link } from "remix";
import { Box } from "@chakra-ui/react";

export default function NoteIndexPage() {
  return (
    <p>
      No note selected. Select a note on the left, or{" "}
      <Box as={Link} to="new" color="blue.500" textDecoration="underline">
        create a new note.
      </Box>
    </p>
  );
}
