import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "./config/axios";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { H1, Small } from "./components/ui/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Textarea } from "./components/ui/textarea";

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
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">CLIP Client</CardTitle>
            <CardDescription>
              Share content between your devices seamlessly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  Text/Link
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  Files
                </TabsTrigger>
              </TabsList>
              <TabsContent value="text">
                <Textarea
                  placeholder="Enter text or paste a link to share..."
                  className="min-h-[120px] mb-4"
                  {...register("content")}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default App;
