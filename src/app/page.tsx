"use client";

import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { FormEvent, useState } from "react";
import useLocalStorage from "@/hooks/localStorageHook";
import { InputField } from "@/components/input_field";

export default function Page() {
  const params = useSearchParams();
  const url = params.get("url") || null;

  const [errorMessage, setErrorMessage] = useState("");

  const [token, setToken] = useLocalStorage("token", null);
  const [token_type, setTokenType] = useLocalStorage("token_type", null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    if (!formData.get('login') || !formData.get('password')) {
      setErrorMessage("Заполните все поля");
      return;
    }

    const response = await fetch("api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.get('login'),
        password: formData.get('password'),
      }),
    });

    const json = await response.json();

    if (json.access_token && json.token_type) {
      setToken(json.access_token);
      setTokenType(json.token_type);

      if (url) {
        window.location.href = `${url}?token=${token}&token_type=${token_type}`;
      } else {
        window.location.pathname = "/me";
      }
    } else {
      setErrorMessage("Неверный логин или пароль");
    }
  };

  if (token && token_type) {
    const fetchData = async () => {
      const response = await fetch("/api/authz", {
        method: "GET",
        headers: {
          "authorization": `${token_type} ${token}`,
        }
      })

      if (response.status === 200) {
        if (url) {
          window.location.href = `${url}?token=${token}&token_type=${token_type}`;
        } else {
          window.location.pathname = "/me";
        }
      }
      else {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `${token_type} ${token}`,
          },
        });
        setToken(null);
        setTokenType(null);
        window.location.pathname = "/";
      }
    }
    fetchData();
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <form className={styles.auth_menu} onSubmit={handleLogin}>
          <InputField type={"text"} placeholder={"Логин"} name={"login"} />
          <InputField type="password" placeholder="Пароль" name="password" />
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center", width: "100%" }}>
              {errorMessage}
            </p>
          )}
          <button type="submit">ЛОГИН</button>
        </form>
      </main>
    </div>
  );
}
