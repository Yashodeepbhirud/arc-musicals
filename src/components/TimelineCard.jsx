/* TIMELINE CARD COMPONENT */
import { motion } from "framer-motion";
export default function TimelineCard({ year, title, description, side }) {
  return (
    <div
      className={`
        relative flex items-start gap-6 
        ${side === "left" ? "justify-start text-left" : "justify-end text-right"}
      `}
    >
      {/* YEAR */}
      <div className="text-arcgold text-xl font-bold">{year}</div>

      {/* CARD */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-md shadow-xl">
        <h4 className="text-xl font-semibold text-white">{title}</h4>
        <p className="text-arc-muted mt-2">{description}</p>
      </div>
    </div>
  );
}
