"use client";

export default function DateDisplay() {
  const date = new Date();

  const navigator = typeof window !== "undefined" ? window.navigator : null;

  return (
    <p>
      {date.toLocaleDateString(navigator ? navigator.language : "de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  );
}
