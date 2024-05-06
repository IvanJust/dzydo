import axios from "axios";
import toast from "react-hot-toast";

export default function createAxiosClientAuth({
  options,
  // platform
}) {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config) => {
      // config.data['platform'] = platform
      return config;
    },
    (error) => {
      toast.error("Произошла ошибка авторизации. " + error.message)
      return Promise.reject(error);
    }
  );
  return client;
}