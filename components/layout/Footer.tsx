import { siteConfig } from "@/config/site.config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-(--border)">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-subtle text-sm text-center">
          © {currentYear} {siteConfig.author.name}
        </p>
      </div>
    </footer>
  );
}
