import { motion } from "framer-motion";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading = ({
  subtitle,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-block text-primary font-body text-sm uppercase tracking-[0.3em] mb-4"
        >
          {subtitle}
        </motion.span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
        {title}
      </h2>
      {align === "center" && <div className="divider-gold mb-6" />}
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};
