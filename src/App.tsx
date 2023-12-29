import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Snackbar,
  TextField,
} from "@mui/material";
import axios, { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = zod.object({
  content: zod.string().refine((value) => value.trim().length > 0, {
    message: "This field is required",
  }),
});
type FormData = zod.infer<typeof schema>;

function App() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    handleSubmit,
    setError,
    reset,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (values: FormData) => {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error(error);
      let message = "There was an error";
      if (isAxiosError(error)) {
        message = error?.response
          ? error.response.data.message
          : "There was an error";
      }

      setError("root", {
        message,
      });
      setLoading(false);
    }
  };
  return (
    <Container>
      <Box paddingTop="60px">
        <h1>Clip Client</h1>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column">
          <FormControl sx={{ m: 2 }}>
            <TextField
              label="Content"
              helperText={errors.content?.message}
              error={!!errors.content}
              multiline
              {...register("content")}
            />
          </FormControl>
          <FormControl sx={{ m: 2 }}>
            <Button
              type="submit"
              disabled={loading}
              variant={loading ? "outlined" : "contained"}
              size="large"
            >
              Submit
            </Button>
          </FormControl>
        </Box>
      </form>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Content sent to your phone successfully!"
      />
      <Snackbar
        open={!!errors.root}
        autoHideDuration={6000}
        onClose={() => clearErrors("root")}
        message={errors.root?.message}
      />
    </Container>
  );
}

export default App;
