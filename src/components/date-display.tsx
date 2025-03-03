"use client";

export default function DateDisplay() {
  const date = new Date();

  return (
    <p>
      {date.toLocaleDateString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
  );
}
