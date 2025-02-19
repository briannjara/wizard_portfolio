"use client";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { Toaster, toast } from "sonner";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { scale: 0 },
  show: { scale: 1 },
};

export default function Form() {
  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const sendEmail = (params) => {
    const toastId = toast.loading("🔮 Casting your message spell...", {
      style: {
        background: "rgba(18, 18, 36, 0.9)", // Dark enchanted theme
        color: "#FFD700", // Golden glow text
        border: "2px solid #7D5BA6", // Wizard purple border
        boxShadow: "0px 0px 12px #FFD700",
        fontFamily: "Cinzel, serif",
      },
    });

    emailjs
      .send(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        params,
        process.env.NEXT_PUBLIC_PUBLIC_KEY
      )
      .then(
        () => {
          toast.success("✨ Your message was successfully sent!", {
            id: toastId,
            style: {
              background: "#2A1A5E", // Deep wizard purple
              color: "#FFD700", // Golden text
              border: "2px solid #A77BCF",
              boxShadow: "0px 0px 15px #A77BCF",
              fontFamily: "Cinzel, serif",
            },
          });
          reset();
        },
        (error) => {
          toast.error("❌ Spell failed! Try again later.", {
            id: toastId,
            style: {
              background: "#440F2F", // Dark red error background
              color: "#FFD700",
              border: "2px solid #E63946",
              boxShadow: "0px 0px 12px #E63946",
              fontFamily: "Cinzel, serif",
            },
          });
        }
      );
  };

  const onSubmit = (data) => {
    if (data.message.length < 50) {
      toast.error("📜 Your scroll must have at least 50 runes!", {
        style: {
          background: "#1B1A35", // Dark arcane background
          color: "#FFD700",
          border: "2px solid #5E3A89",
          boxShadow: "0px 0px 10px #5E3A89",
          fontFamily: "Cinzel, serif",
        },
      });
      return;
    }

    const templateParams = {
      to_name: "Brian Njaramba",
      from_name: data.name,
      reply_to: data.email,
      message: data.message,
    };

    sendEmail(templateParams);
  };

  return (
    <>
      <Toaster position="top-right" richColors={true} />
      <motion.form
        ref={formRef}
        variants={container}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full flex flex-col items-center justify-center space-y-4"
      >
        <motion.input
          variants={item}
          type="text"
          placeholder="Name"
          {...register("name", {
            required: "This field is required!",
            minLength: {
              value: 3,
              message: "Name should be at least 3 characters long.",
            },
          })}
          className="w-full p-2 rounded-md shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 custom-bg"
        />
        {errors.name && (
          <span className="inline-block self-start text-purple-400">{errors.name.message}</span>
        )}

        <motion.input
          variants={item}
          type="email"
          placeholder="Email"
          {...register("email", { required: "This field is required!" })}
          className="w-full p-2 rounded-md shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 custom-bg"
        />
        {errors.email && (
          <span className="inline-block self-start text-purple-400">{errors.email.message}</span>
        )}

        <motion.textarea
          variants={item}
          placeholder="Message"
          {...register("message", {
            required: "This field is required!",
            minLength: {
              value: 50,
              message: "Message should be at least 50 characters long.",
            },
            maxLength: {
              value: 500,
              message: "Message should be less than 500 characters.",
            },
          })}
          className="w-full p-2 rounded-md shadow-lg text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 custom-bg"
        />
        {errors.message && (
          <span className="inline-block self-start text-purple-400">{errors.message.message}</span>
        )}

<motion.input
          variants={item}
          value="Cast your message!"
          className="px-10 py-4 rounded-md shadow-lg bg-background border border-accent/30 border-solid
          hover:shadow-glass-sm backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer capitalize"
          type="submit"
        />
      </motion.form>
    </>
  );
}
