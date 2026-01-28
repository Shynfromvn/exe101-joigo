import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hanoiBlogs } from "@/lib/blogs_temp";
import { useTours } from "@/contexts/TourContext";
import { t } from "@/lib/i18n";

const Blogs = () => {
  const { language } = useTours();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {t(language, "idx_travel_blog")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t(language, "idx_blog_desc")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hanoiBlogs.map((blog) => (
            <a 
              key={blog.slug}
              href={blog.externalUrl || `/blogs/${blog.slug}`}
              target={blog.externalUrl ? "_blank" : "_self"}
              rel={blog.externalUrl ? "noopener noreferrer" : undefined}
              className="group"
            >
              <Card className="h-full overflow-hidden hover:shadow-hover transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {t(
                      language,
                      `blog_${blog.slug.replace(/-/g, "_")}_title` as any
                    ) || blog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {t(
                      language,
                      `blog_${blog.slug.replace(/-/g, "_")}_excerpt` as any
                    ) || blog.excerpt}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {blog.location}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;
