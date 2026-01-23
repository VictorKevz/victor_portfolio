import type { BlogPost } from "@/lib/wordpress/types";
import { decodeHtmlEntities } from "@/lib/utils/html";

interface BlogHeroSectionProps {
  post: BlogPost;
}

export default function BlogHeroSection({ post }: BlogHeroSectionProps) {
  if (!post) {
    return null;
  }

  const title = decodeHtmlEntities(post.title?.rendered || "");
  const ingress = post.acf?.blog_post?.header?.post_ingress || "";

  if (!title) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-hero leading-tight mb-6">
          {title}
        </h1>
        {ingress && (
          <p className="text-lg sm:text-xl text-(--text-body) leading-relaxed">
            {ingress}
          </p>
        )}
      </div>
    </section>
  );
}
