'use server';

import { Resend } from 'resend';
import { site } from '../content/projects';

export type ContactState = {
  status: 'idle' | 'sent' | 'error';
  message: string;
  /** What was typed, so a failed send doesn't wipe the form. */
  values?: { name: string; email: string; message: string };
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sends the contact form through Resend to `site.email`, with the
 *  visitor's address as reply-to so answering is just hitting Reply.
 *
 *  Needs two environment variables (see .env.example):
 *  RESEND_API_KEY, and CONTACT_FROM: a sender on a domain verified in
 *  Resend, e.g. "ESA Portfolio <contact@esa-audio.se>". */
export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get('name') ?? '').trim(),
    email: String(formData.get('email') ?? '').trim(),
    message: String(formData.get('message') ?? '').trim(),
  };

  // Hidden field people never see; bots fill it in. Pretend it worked.
  if (String(formData.get('website') ?? '') !== '') {
    return { status: 'sent', message: 'Thanks! Your message is on its way.' };
  }

  if (!values.name || !values.message || values.name.length > 200 || values.message.length > 5000) {
    return { status: 'error', message: 'Please fill in your name and a message.', values };
  }
  if (!EMAIL.test(values.email) || values.email.length > 320) {
    return { status: 'error', message: 'That email address doesn’t look right.', values };
  }

  // Hosts keep pasted quotes and stray spaces as part of the value, so
  // tidy both before using them.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM?.trim().replace(/^["']|["']$/g, '');
  if (!apiKey || !from) {
    console.error('Contact form: RESEND_API_KEY or CONTACT_FROM is not set.');
    return { status: 'error', message: failedMessage('not configured'), values };
  }

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to: site.email,
    replyTo: values.email,
    subject: `Portfolio enquiry from ${values.name}`,
    text: `${values.message}\n\n—\nFrom: ${values.name}\nEmail: ${values.email}`,
  });

  if (error) {
    console.error('Contact form: Resend error', error);
    return { status: 'error', message: failedMessage(error.name), values };
  }
  return { status: 'sent', message: 'Thanks! Your message is on its way.' };
}

/** `reason` is a short code (Resend's error name, or "not configured"), so
 *  a failure on the live site says why without opening the server logs. */
function failedMessage(reason: string) {
  return `Sorry, that didn’t send (${reason}). Please try again, or email ${site.email} directly.`;
}
