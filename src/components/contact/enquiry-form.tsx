"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { enquiryTypes, findEnquiryType } from "@/content/enquiries";

export function EnquiryForm({ initialType, email }: { initialType?: string; email: string }) {
  const [type, setType] = useState(findEnquiryType(initialType)?.id || "");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const selected = findEnquiryType(type);

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get("name") || "").trim();
    const replyTo = String(fields.get("email") || "").trim();
    const detail = String(fields.get("detail") || "").trim();
    const message = String(fields.get("message") || "").trim();
    if (!name || !message) {
      setStatus("Please add your name and a short message.");
      return;
    }
    const body = [
      "Hi Tech Caller,",
      message,
      detail ? selected.detailLabel.replace(" (optional)", "") + ": " + detail : "",
      "From: " + name + "\nReply to: " + replyTo
    ].filter(Boolean).join("\n\n");
    setDraft(body);
    setStatus("Your draft is ready. Send it from your email app to finish. You can also copy the message below.");
    window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Tech Caller: " + selected.label) + "&body=" + encodeURIComponent(body);
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("Message copied. Paste it into an email to " + email + ".");
    } catch {
      setStatus("Select the message below and copy it into your email.");
    }
  }

  return (
    <form className="enquiry-form" onSubmit={prepareEmail}>
      <Field label="What can we help you with?">
        <Select name="type" value={type} onChange={(event) => {
          setType(event.target.value);
          setDraft("");
          setStatus("");
        }} required>
          <option value="" disabled>Select an enquiry type</option>
          {enquiryTypes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </Select>
      </Field>
      {selected && (
        <div className="enquiry-fields">
          <div className="form-pair">
            <Field label="Your name"><Input name="name" autoComplete="name" required maxLength={80} /></Field>
            <Field label="Your email"><Input name="email" type="email" autoComplete="email" required maxLength={150} /></Field>
          </div>
          {selected.detailLabel && (
            <Field label={selected.detailLabel}>
              <Input key={selected.id} name="detail" type={selected.id === "video-help" || selected.id === "collaboration" ? "url" : "text"}
                required={selected.id === "video-help"} maxLength={300}
                placeholder={selected.id === "video-help" || selected.id === "collaboration" ? "https://" : undefined} />
            </Field>
          )}
          <Field label={selected.prompt}>
            <Textarea name="message" required maxLength={1200} rows={5} placeholder={selected.placeholder} onChange={() => { setDraft(""); setStatus(""); }} />
          </Field>
          <div className="form-actions">
            <Button type="submit" className="contact-submit"><Mail size={17} aria-hidden /> Continue to email <ArrowUpRight size={16} aria-hidden /></Button>
            <p>You can review your message before sending.</p>
          </div>
        </div>
      )}
      <div aria-live="polite" role="status">{status && <p className="form-status"><Check size={17} aria-hidden />{status}</p>}</div>
      {draft && (
        <div className="email-preview">
          <div><strong>Email draft</strong><Button type="button" variant="secondary" onClick={copyDraft}><Copy size={15} aria-hidden />Copy message</Button></div>
          <pre>{draft}</pre>
        </div>
      )}
    </form>
  );
}
