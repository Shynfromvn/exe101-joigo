import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogBySlug } from "@/lib/blogs_temp";
import { Button } from "@/components/ui/button";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { language } = useTours();
  const blog = slug ? getBlogBySlug(slug) : undefined;

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-10">
          <p className="text-muted-foreground">
            {t(language, "blog_not_found")}
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              {t(language, "td_go_back")}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link to="/blogs" className="text-sm text-primary hover:underline">
              {t(language, "blog_back_to_list")}
            </Link>
          </div>
          <h1 className="text-3xl font-bold leading-tight">
            {t(language, `blog_${blog.slug.replace(/-/g, "_")}_title` as any) ||
              blog.title}
          </h1>
          <p className="text-muted-foreground mt-1">{blog.location}</p>
          <div className="mt-6 rounded-xl overflow-hidden shadow-sm">
            <img
              src={blog.image}
              alt={
                t(
                  language,
                  `blog_${blog.slug.replace(/-/g, "_")}_title` as any
                ) || blog.title
              }
              className="w-full h-auto object-cover"
            />
          </div>
          <article className="prose prose-neutral max-w-none dark:prose-invert mt-6">
            <p>
              {t(
                language,
                `blog_${blog.slug.replace(/-/g, "_")}_content` as any
              ) || blog.content}
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
