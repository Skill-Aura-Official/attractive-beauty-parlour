import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";

// Placeholder blog posts (will be fetched from database in future)
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Bridal Makeup Trends for 2025",
    excerpt: "Discover the hottest bridal makeup trends that will make you look stunning on your special day. From dewy skin to bold eyes, we've got you covered.",
    category: "Bridal",
    author: "Attractive Beauty Parlour",
    date: "January 20, 2025",
    slug: "bridal-makeup-trends-2025",
    featured: true,
  },
  {
    id: 2,
    title: "How to Care for Your Hair in Winter",
    excerpt: "Winter can be harsh on your hair. Learn essential tips and tricks to keep your locks healthy, shiny, and hydrated during the cold months.",
    category: "Hair Care",
    author: "Attractive Beauty Parlour",
    date: "January 15, 2025",
    slug: "winter-hair-care-tips",
    featured: false,
  },
  {
    id: 3,
    title: "The Ultimate Guide to Pre-Bridal Skincare",
    excerpt: "Start your skincare journey months before your wedding. This comprehensive guide covers everything you need for glowing bridal skin.",
    category: "Skincare",
    author: "Attractive Beauty Parlour",
    date: "January 10, 2025",
    slug: "pre-bridal-skincare-guide",
    featured: false,
  },
  {
    id: 4,
    title: "Kids Haircut Tips: Making It Fun!",
    excerpt: "Haircuts don't have to be stressful for kids. Learn how we make the experience enjoyable and tips for at-home maintenance.",
    category: "Kids",
    author: "Attractive Beauty Parlour",
    date: "January 5, 2025",
    slug: "kids-haircut-tips",
    featured: false,
  },
  {
    id: 5,
    title: "Nail Art Trends to Try This Season",
    excerpt: "From minimalist designs to bold statements, explore the latest nail art trends that are taking the beauty world by storm.",
    category: "Nails",
    author: "Attractive Beauty Parlour",
    date: "December 28, 2024",
    slug: "nail-art-trends",
    featured: false,
  },
  {
    id: 6,
    title: "Why Regular Facials Are Essential",
    excerpt: "Discover the science behind facials and why incorporating them into your skincare routine can transform your skin health.",
    category: "Skincare",
    author: "Attractive Beauty Parlour",
    date: "December 20, 2024",
    slug: "importance-of-regular-facials",
    featured: false,
  },
];

const categories = ["All", "Bridal", "Hair Care", "Skincare", "Nails", "Kids"];

const Blog = () => {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-charcoal-dark to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-primary font-body text-sm uppercase tracking-[0.3em] mb-4"
          >
            Beauty Insights
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6"
          >
            Our <span className="text-gradient-gold">Blog</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Tips, trends, and inspiration from the world of beauty
          </motion.p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-background border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                  category === "All"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="luxury-card lg:flex gap-8 overflow-hidden"
            >
              <div className="lg:w-1/2 aspect-[16/10] lg:aspect-auto bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-6xl">✨</span>
              </div>
              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <span className="text-primary text-xs uppercase tracking-widest mb-3">
                  Featured • {featuredPost.category}
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {featuredPost.date}
                  </span>
                </div>
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
                >
                  Read Article
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="section-padding bg-charcoal-light">
        <div className="container mx-auto px-4">
          <SectionHeading
            subtitle="Latest Posts"
            title="Beauty Tips & Trends"
            description="Expert advice and inspiration for your beauty journey"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="luxury-card group"
              >
                <div className="aspect-[16/10] mb-5 bg-gradient-to-br from-primary/10 to-accent/10 rounded-md flex items-center justify-center">
                  <span className="text-4xl opacity-50">📝</span>
                </div>
                <span className="text-primary text-xs uppercase tracking-widest mb-2 block">
                  {post.category}
                </span>
                <h3 className="font-display text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all duration-300"
                  >
                    Read
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
              Stay <span className="text-gradient-gold">Updated</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Follow us on social media for daily beauty tips, behind-the-scenes content, 
              and exclusive offers!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:shadow-gold transition-all duration-300"
            >
              Connect With Us
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
