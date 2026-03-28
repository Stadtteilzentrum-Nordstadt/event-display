"use client";

export default function DateDisplay(props: { referenceDateISO?: string }) {
  const date = props.referenceDateISO
    ? new Date(props.referenceDateISO)
    : new Date();

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
