"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "./actions";
import styles from "./page.module.css";

const initialState: ContactState = { status: "idle", message: "" };

/** Sends straight from the page (see actions.ts). On success the form
 *  clears and says thanks; on a failure what was typed stays put. */
export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const values = state.status === "error" ? state.values : undefined;

  return (
    <form className={styles.form} action={formAction}>
      <label>
        <span>Name</span>
        <input type="text" name="name" autoComplete="name" required maxLength={200} defaultValue={values?.name} />
      </label>
      <label>
        <span>Email</span>
        <input type="email" name="email" autoComplete="email" required defaultValue={values?.email} />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows={6} required maxLength={5000} defaultValue={values?.message} />
      </label>
      {/* Left empty by people (it's hidden); bots fill it in. */}
      <label className={styles.trap} aria-hidden="true">
        <span>Website</span>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className={styles.formFooter}>
        <button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </button>
        <p
          className={`${styles.formStatus} ${state.status === "error" ? styles.formError : ""}`}
          role="status"
          aria-live="polite"
        >
          {pending ? "" : state.message}
        </p>
      </div>
    </form>
  );
}
