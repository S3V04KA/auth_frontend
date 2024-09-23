'use client'

import { useState } from "react";
import styles from "@/app/page.module.css";

export const InputField = (props: {
  type: "text" | "password" | "email";
  placeholder: string;
  name: string;
}) => {
  const [data, setData] = useState("");
  const [isActive, setIsActive] = useState(false);

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

  return (
    <div className={styles.float_label}>
      <input
        className={styles.auth_menu_item}
        type={props.type}
        name={props.name}
        onChange={(e) =>
          handleText(e.target.value, setData, setIsActive)
        }
        value={data}
      />
      <label htmlFor="text" className={isActive ? styles.Active : ""}>
        {props.placeholder}
      </label>
    </div>
  );
};
