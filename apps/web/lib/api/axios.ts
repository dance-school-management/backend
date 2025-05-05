import axios from "axios";
import { useUserStore } from "@/lib/store";
import { redirect, RedirectType } from "next/navigation";

export const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        useUserStore.getState().setUser(null);
        redirect('/login', RedirectType.replace);
      }
    }
    return Promise.reject(error);
  }
);