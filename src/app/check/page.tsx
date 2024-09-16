"use client";

import { notFound, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

type Data = {
  username: string;
  email: string;
  fullname: string;
  id: number;
  created_at: string;
}

export default function Page() {
  const params = useSearchParams();
  const pdata = {
    token: params.get("token"),
    token_type: params.get("token_type"),
  };

  const storageData = {
    token: window.localStorage.getItem("token"),
    token_type: window.localStorage.getItem("token_type"),
  }

  const { token, token_type } = {
    token: pdata.token ? pdata.token : storageData.token ? storageData.token : '',
    token_type: pdata.token_type ? pdata.token_type : storageData.token_type ? storageData.token_type : '',
  };

  const [data, setData] = useState<Data|null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();
      console.log(json);
      setData(json);
    }
    
    if (token !== '' && token_type !== '') {
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("token_type", token_type);
      fetchData();
    }
  }, [token, token_type]);

  if (!token || !token_type) {
    return notFound();
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div>Загрузка...</div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        Username: {data.username}
        <br />
        Email: {data.email}
        <br />
        Fullname: {data.fullname}
        <br />
        ID: {data.id}
        <br />
        Created at: {data.created_at}
      </main>
    </div>
  );
}
