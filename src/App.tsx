import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "./config/axios";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { H1 } from "./components/ui/typography";

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

    try {
      await axiosInstance.post("/content", {
        content: values.content,
      });

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
    <div className="container mx-auto mt-8 ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="h-96 flex flex-col justify-center">
          <H1>Clip Client</H1>
          <Input type="text" placeholder="Content" />
          <Button type="submit" className="w-full mt-4" size="lg">
            Send Content
          </Button>
        </div>
      </form>
    </div>
  );
}

export default App;
