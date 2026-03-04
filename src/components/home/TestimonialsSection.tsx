import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { SectionHeading } from "../ui/section-heading";
import { useTestimonials } from "@/hooks/useTestimonials";

const fallbackTestimonials = [
  {
    id: "1",
    client_name: "Priya Sharma",
    review_text: "Absolutely loved my bridal makeup! The team at Attractive Beauty Parlour made me feel like a queen on my special day. The attention to detail was impeccable.",
    rating: 5,
    image_url: null,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    client_name: "Anita Reddy",
    review_text: "Best salon in the city! The ambiance is so luxurious and the staff is incredibly skilled. I've been coming here for over a year now and wouldn't go anywhere else.",
    rating: 5,
    image_url: null,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    client_name: "Meera Patel",
    review_text: "My daughter loves coming here for her haircuts. They are so patient with kids and make the experience fun. The kids' section is adorable!",
    rating: 5,
    image_url: null,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    client_name: "Kavitha Nair",
    review_text: "The facial treatments here are divine. My skin has never looked better. The products they use are top-notch and the results speak for themselves.",
    rating: 5,
    image_url: null,
    is_visible: true,
    created_at: "",
    updated_at: "",
  },
];

export const TestimonialsSection = () => {
  const { data: dbTestimonials } = useTestimonials();
  const testimonials = dbTestimonials && dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;
  const [current, setCurrent] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-padding bg-charcoal-light relative overflow-hidden">
      <div className="absolute top-10 left-10 opacity-5">
        <Quote size={200} className="text-primary" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          subtitle="Client Love"
          title="What Our Clients Say"
          description="Real stories from real clients who experienced the Attractive difference"
        />

        <div className="max-w-4xl mx-auto mt-16 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-8">
                {[...Array(testimonials[current]?.rating || 5)].map((_, i) => (
                  <Star key={i} size={20} className="text-primary fill-primary" />
                ))}
              </div>

              <blockquote className="font-elegant text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed mb-8 italic">
                "{testimonials[current]?.review_text}"
              </blockquote>

              <div>
                <p className="font-display text-xl text-primary mb-1">
                  {testimonials[current]?.client_name}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === current ? "w-8 bg-primary" : "bg-primary/30 hover:bg-primary/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
