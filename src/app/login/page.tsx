"use client";

import { notFound, redirect, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { useState } from "react";

export default function Page() {
  const params = useSearchParams()
  const url = params.get("url") || null
  const logout = params.get("logout")

  const storageData = {
    token: window.localStorage.getItem("token"),
    token_type: window.localStorage.getItem("token_type"),
  }

  const { token, token_type } = {
    token: storageData.token ? storageData.token : '',
    token_type: storageData.token_type ? storageData.token_type : '',
  };

  const [isActiveLogin, setIsActiveLogin] = useState(false);
  const [isActivePassword, setIsActivePassword] = useState(false);

  const [textLogin, setTextLogin] = useState("");
  const [textPassword, setTextPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

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

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: textLogin, password: textPassword }),
    });

    const json = await response.json();

    if (response.ok && json.access_token && json.token_type) {
      window.location.href = url+`?token=${json.access_token}&token_type=${json.token_type}`;
    } else {
      setErrorMessage("Неверный логин или пароль");
    }
  };

  if (logout === 'true') {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("token_type");
    redirect("/login?url=/check");
  }

  if (!url) {
    return notFound();
  }

  if(token && token_type) {
    window.location.href = url+`?token=${token}&token_type=${token_type}`
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.auth_menu}>
          <div className={styles.float_label}>
            <input className={styles.auth_menu_item} type="text" onChange={(e) => handleText(e.target.value, setTextLogin, setIsActiveLogin)} value={textLogin}/>
            <label htmlFor="text" className={isActiveLogin ? styles.Active : ""}>ЛОГИН</label>
          </div>
          <div className={styles.float_label}>
            <input className={styles.auth_menu_item} type="password" onChange={(e) => handleText(e.target.value, setTextPassword, setIsActivePassword)} value={textPassword}/>
            <label htmlFor="password" className={isActivePassword ? styles.Active : ""}>ПАРОЛЬ</label>
          </div>
          {errorMessage && <p style={{color: 'red', textAlign: 'center', width: '100%'}}>{errorMessage}</p>}
          <button onClick={handleLogin}>ЛОГИН</button>
        </div>
      </main>
    </div>
  );
}
