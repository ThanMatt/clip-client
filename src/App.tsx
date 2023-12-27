import { ChangeEvent, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import axios from "axios";

function App() {
  const [value, setValue] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("value: ", value);

    try {
      await axios.post(
        "http://localhost:4000/content",
        {
          content: value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(true);
      setValue("");
    } catch (error) {
      setSuccess(false);
      console.error(error);
    }
  };
  return (
    <Container>
      <Box paddingTop="60px">
        <h1>Clip Client</h1>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField label="Content" onChange={handleChange} multiline />
        <Button type="submit">Submit</Button>
      </form>
      {success && <p>Content sent to your phone successfully!</p>}
    </Container>
  );
}

export default App;
