import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export function JsonLd() {
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: [
      "Learn AI-200",
      "AI-200 Study Notes",
      "Azure AI Cloud Developer Study Guide",
    ],
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: "Surafel Melaku",
      url: "https://sura.work",
    },
  };

  const course = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Microsoft AI-200: Developing AI Cloud Solutions on Azure",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    provider: {
      "@type": "Person",
      name: "Surafel Melaku",
      url: "https://sura.work",
    },
    educationalCredentialAwarded:
      "Azure AI Cloud Developer Associate (AI-200) preparation",
    teaches: [
      "Azure Container Apps",
      "Azure Kubernetes Service",
      "Vector databases for AI",
      "Azure Service Bus and Event Grid",
      "Azure Key Vault and observability",
      "Azure SDK and Azure CLI",
    ],
    about: {
      "@type": "Thing",
      name: "Microsoft Certified: Azure AI Cloud Developer Associate",
      sameAs:
        "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(course) }}
      />
    </>
  );
}
