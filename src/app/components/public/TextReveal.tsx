import { motion } from "motion/react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  variant?: "words" | "chars" | "slide-up";
  style?: React.CSSProperties;
}

export function TextReveal({ text, className = "", delay = 0, variant = "words", style }: TextRevealProps) {
  if (variant === "slide-up") {
    return (
      <span className="overflow-hidden inline-block" style={style}>
        <motion.span
          className={`inline-block ${className}`}
          initial={{ y: "100%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
        >
          {text}
        </motion.span>
      </span>
    );
  }

  const items = variant === "words" ? text.split(" ") : text.split("");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: variant === "words" ? 0.05 : 0.015,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.span
      className="inline-block"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      style={{ display: "inline-block", ...style }}
    >
      {items.map((item, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.2em] last:mr-0">
          <motion.span
            className={`inline-block ${className}`}
            variants={itemVariants}
          >
            {item === "" ? "\u00A0" : item}
          </motion.span>
        </span>

      ))}
    </motion.span>
  );
}
