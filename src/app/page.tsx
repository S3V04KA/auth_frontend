"use client";

import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { useState } from "react";
import useLocalStorage from "@/hooks/localStorageHook";

export default function Page() {
  const params = useSearchParams();
  const url = params.get("url") || null;

  const [isActiveLogin, setIsActiveLogin] = useState(false);
  const [isActivePassword, setIsActivePassword] = useState(false);

  const [textLogin, setTextLogin] = useState("");
  const [textPassword, setTextPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [token, setToken] = useLocalStorage("token", null);
  const [token_type, setTokenType] = useLocalStorage("token_type", null);

  const handleText = (
    text: string,
    setText: (text: string) => void,
    setIsActive: (isActive: boolean) => void
  ) => {
    setText(text);

    if (text !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const handleLogin = async () => {
    if (!textLogin || !textPassword) {
      setErrorMessage("Заполните все поля");
      return;
    }

    const response = await fetch("api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: textLogin,
        password: textPassword,
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
        <div className={styles.auth_menu}>
          <div className={styles.float_label}>
            <input
              className={styles.auth_menu_item}
              type="text"
              onChange={(e) =>
                handleText(e.target.value, setTextLogin, setIsActiveLogin)
              }
              value={textLogin}
            />
            <label
              htmlFor="text"
              className={isActiveLogin ? styles.Active : ""}
            >
              ЛОГИН
            </label>
          </div>
          <div className={styles.float_label}>
            <input
              className={styles.auth_menu_item}
              type="password"
              onChange={(e) =>
                handleText(e.target.value, setTextPassword, setIsActivePassword)
              }
              value={textPassword}
            />
            <label
              htmlFor="password"
              className={isActivePassword ? styles.Active : ""}
            >
              ПАРОЛЬ
            </label>
          </div>
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center", width: "100%" }}>
              {errorMessage}
            </p>
          )}
          <button onClick={handleLogin}>ЛОГИН</button>
        </div>
      </main>
    </div>
  );
}
