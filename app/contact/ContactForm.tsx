"use client";

import type { FormEvent } from "react";
import { site } from "../content/projects";
import styles from "./page.module.css";

export default function ContactForm() {
  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form className={styles.form} onSubmit={sendMessage}>
      <label>
        <span>Name</span>
        <input type="text" name="name" autoComplete="name" required />
      </label>
      <label>
        <span>Email</span>
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows={6} required />
      </label>
      <button type="submit">Open email draft</button>
    </form>
  );
}
