import type { Metadata } from "next";
import FrasesClient from "./FrasesClient";

export const metadata: Metadata = {
  title: "Frase Activadora del Día",
  description: "Una frase para encender tu mente antes de competir. Nueva frase cada día.",
};

export default function FrasesPage() {
  return <FrasesClient />;
}
