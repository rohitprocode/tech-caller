"use client";

import { useActionState, useMemo, useState } from "react";
import type { Category } from "@/types/database";
import { createCategory, updateCategory } from "@/lib/actions/resources";
import { slugify } from "@/lib/utils";
import { Field, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

const initialState = { ok: false, message: "" };

export function CategoryForm({ category }: { category?: Category }) {
  const action = category ? updateCategory : createCategory;
  const [state, formAction] = useActionState(action, initialState);
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const suggestedSlug = useMemo(() => slugify(name), [name]);

  return (
    <form action={formAction} className="grid gap-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <Field label="Name">
        <Input
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (!slug || slug === suggestedSlug) setSlug(slugify(event.target.value));
          }}
          required
        />
      </Field>
      <Field label="Slug">
        <Input name="slug" value={slug || suggestedSlug} onChange={(event) => setSlug(event.target.value)} required />
      </Field>
      <Field label="Description">
        <Textarea name="description" defaultValue={category?.description || ""} />
      </Field>
      {state.message ? <p className="rounded-md border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{state.message}</p> : null}
      <SubmitButton>{category ? "Save Category" : "Create Category"}</SubmitButton>
    </form>
  );
}
