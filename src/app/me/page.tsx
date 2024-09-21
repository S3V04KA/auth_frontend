"use client";

import styles from "../page.module.css";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/localStorageHook";

type Data = {
  created_at: string;
  email: string;
  fullname: string;
  id: number;
  role: {
    id: number;
    name: string;
  };
  updated_at: string;
  username: string;
};

export default function Page() {
  const [token, setToken] = useLocalStorage("token", null);
  const [token_type, setTokenType] = useLocalStorage("token_type", null);

  const [data, setData] = useState<Data | null>(null);

  const handleLoout = () => {
    const fetchData = async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `${token_type} ${token}`,
        },
      });
      setToken(null);
      setTokenType(null);
      window.location.pathname = "/";
      return response;
    }
    fetchData();
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": `${token_type} ${token}`,
        },
      });
      const json = await response.json();
      
      if(response.ok && !json.detail) {
        setData(json);
      }
      else {
        window.location.pathname = "/";
      }
    }
    fetchData();
  }, [token, token_type]);

  if (!data) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.auth_menu}>Загрузка...</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.auth_menu}>
          <div className={styles.auth_menu_item}>{`username: ${data.username}`}</div>
          <div className={styles.auth_menu_item}>{`email: ${data.email}`}</div>
          <div className={styles.auth_menu_item}>{`fullname: ${data.fullname}`}</div>
          <div className={styles.auth_menu_item}>{`created_at: ${data.created_at}`}</div>
          <div className={styles.auth_menu_item}>{`updated_at: ${data.updated_at}`}</div>
          <div className={styles.auth_menu_item}>{`role: ${data.role.name}`}</div>
          <div className={styles.auth_menu_item}>{`id: ${data.id}`}</div>
          <button onClick={handleLoout}>ВЫХОД</button>
        </div>
      </main>
    </div>
  );
}
