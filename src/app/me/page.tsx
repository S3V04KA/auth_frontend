"use client";

import styles from "../page.module.css";
import { FormEvent, useEffect, useState } from "react";
import useLocalStorage from "@/hooks/localStorageHook";
import { InputField } from "@/components/input_field";

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
  const [openModal, setOpenModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = () => {
    const fetchData = async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token_type} ${token}`,
        },
      });
      setToken(null);
      setTokenType(null);
      window.location.pathname = "/";
      return response;
    };
    fetchData();
  };

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleChangePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!formData.get("old_password") || !formData.get("new_password")) {
      setErrorMessage("Заполните все поля");
      return;
    }

    const fetchData = async () => {
      const res = await fetch("/api/users/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": `${token_type} ${token}`,
        },
        body: `{"old_password": "${formData.get("old_password")}", "new_password": "${formData.get("new_password")}"}`
      });

      const json = await res.json();

      if (!res.ok || res.status === 422) {
        setErrorMessage("Введите верные данные");
        return;
      }

      if (json || res.ok) {
        setErrorMessage("");
        handleOpenModal();
        return;
      }

      setErrorMessage("");
      handleOpenModal();
    };
    fetchData();
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token_type} ${token}`,
        },
      });
      const json = await response.json();

      if (response.ok && !json.detail) {
        setData(json);
      } else {
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
          {openModal ? (
            <>
              <div className={styles.auth_menu_item}>СМЕНИТЬ ПАРОЛЬ</div>
              <form
                className={styles.auth_menu}
                onSubmit={handleChangePassword}
              >
                <InputField
                  name="old_password"
                  placeholder="Старый пароль"
                  type="password"
                />
                <InputField
                  name="new_password"
                  placeholder="Новый пароль"
                  type="password"
                />
                {errorMessage && (
                  <p
                    style={{ color: "red", textAlign: "center", width: "100%" }}
                  >
                    {errorMessage}
                  </p>
                )}
                <button type="submit">СМЕНИТЬ</button>
              </form>
              <button onClick={handleOpenModal}>НАЗАД</button>
            </>
          ) : (
            <>
              <div
                className={styles.auth_menu_item}
              >{`username: ${data.username}`}</div>
              <div
                className={styles.auth_menu_item}
              >{`email: ${data.email}`}</div>
              <div
                className={styles.auth_menu_item}
              >{`fullname: ${data.fullname}`}</div>
              <div
                className={styles.auth_menu_item}
              >{`created_at: ${data.created_at}`}</div>
              <div
                className={styles.auth_menu_item}
              >{`updated_at: ${data.updated_at}`}</div>
              <div
                className={styles.auth_menu_item}
              >{`role: ${data.role.name}`}</div>
              <div className={styles.auth_menu_item}>{`id: ${data.id}`}</div>
              <button onClick={handleOpenModal}>СМЕНИТЬ ПАРОЛЬ</button>
              <button onClick={handleLogout}>ВЫХОД</button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
