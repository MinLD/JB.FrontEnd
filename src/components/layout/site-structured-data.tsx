import { homeStructuredData, serializeStructuredData } from "@/config/seo";
import type { Locale, TranslationDictionary } from "@/i18n/types";

export function SiteStructuredData({ locale, dictionary }: { locale: Locale; dictionary: TranslationDictionary }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(homeStructuredData(locale, dictionary)) }} />;
}
