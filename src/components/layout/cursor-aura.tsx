"use client";

import { useEffect, useState } from "react";

export function CursorAura() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer || reducedMotion) {
      return;
    }

    const root = document.documentElement;
    let frame = 0;

    root.style.setProperty("--cursor-x", "50vw");
    root.style.setProperty("--cursor-y", "50vh");

    function move(event: PointerEvent) {
      setVisible(true);

      if (frame) {
        cancelAnimationFrame(frame);
      }

      frame = requestAnimationFrame(() => {
        root.style.setProperty("--cursor-x", `${event.clientX}px`);
        root.style.setProperty("--cursor-y", `${event.clientY}px`);
      });
    }

    function show() {
      setVisible(true);
    }

    function hide() {
      setVisible(false);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerenter", show);
    window.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    show();

    return () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerenter", show);
      window.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  return (
    <div className={visible ? "cursor-aura is-visible" : "cursor-aura"} aria-hidden>
      <span className="cursor-aura-ring" />
      <span className="cursor-aura-dot" />
    </div>
  );
}
