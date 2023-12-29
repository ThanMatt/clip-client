import { ChangeEvent, useState } from "react";
import { Box, Button, Container, Snackbar, TextField } from "@mui/material";
import axios, { isAxiosError } from "axios";

function App() {
  const [value, setValue] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setError("");
    setSuccess(false);
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
      console.error(error);
      if (isAxiosError(error)) {
        setError(
          error?.response ? error.response.data.message : "There was an error"
        );
      } else {
        setError("There was an error");
      }
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
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Content sent to your phone successfully!"
      />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        message={error}
      />
    </Container>
  );
}

export default App;
