import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IToastType } from "..";

export default function Toast({message, type = IToastType.INFO }) {

  useEffect(() => {
    if (message) {
      toast[type](message); // tipos: info, success, error, warning
    }
  }, [message, type]);

  return <ToastContainer position="bottom-right" autoClose={3000} />;
}