import { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, Snackbar, TextField } from "@mui/material";
import axios, { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = zod.object({
  content: zod
    .string()
    // :: Remove whitespaces
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(zod.string().min(1, { message: "This field is required" })),
});
type FormData = zod.infer<typeof schema>;

function App() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (values: FormData) => {
    setError("");
    setSuccess(false);
    console.log("value: ", values.content);

    try {
      await axios.post(
        "http://localhost:4000/content",
        {
          content: values.content,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(true);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Content"
          helperText={errors.content?.message}
          error={!!errors.content}
          multiline
          {...register("content")}
        />
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
