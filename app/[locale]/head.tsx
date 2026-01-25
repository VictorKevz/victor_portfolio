import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { generateAuthorSchema } from "@/lib/structured-data/author";
import { generateOrganizationSchema } from "@/lib/structured-data/organization";

export default async function Head({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return null;
  }

  const authorSchema = generateAuthorSchema(locale as Locale);
  const organizationSchema = generateOrganizationSchema(locale as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(authorSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </>
  );
}
