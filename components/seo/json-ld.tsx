import { EXAM } from "@/lib/exam-outline";
import { absoluteUrl } from "@/lib/seo";
import { AUTHOR, CONTENT_LICENSE_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

function Script({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be inline; "<" is escaped so content can't close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const author = { "@type": "Person", ...AUTHOR };

export function breadcrumbList(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** Site-wide: WebSite with a SearchAction, and the free course it offers. */
export function SiteJsonLd() {
  return (
    <>
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          alternateName: ["Learn AI-200", "AI-200 Study Guide"],
          url: SITE_URL,
          description: SITE_DESCRIPTION,
          inLanguage: "en",
          publisher: author,
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <Script
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: `${EXAM.code} study guide: ${EXAM.title}`,
          description: SITE_DESCRIPTION,
          url: SITE_URL,
          provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          isAccessibleForFree: true,
          inLanguage: "en",
          about: { "@type": "Thing", name: EXAM.certification, sameAs: EXAM.certificationUrl },
          hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT20H" },
          offers: { "@type": "Offer", price: 0, priceCurrency: "USD", category: "Free" },
        }}
      />
    </>
  );
}

export function TopicJsonLd({
  title,
  description,
  path,
  areaTitle,
  lastReviewed,
}: {
  title: string;
  description?: string;
  path: string;
  areaTitle?: string;
  lastReviewed?: string;
}) {
  return (
    <Script
        data={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: title,
          description,
          url: absoluteUrl(path),
          inLanguage: "en",
          isAccessibleForFree: true,
          learningResourceType: "Study notes",
          educationalLevel: "Intermediate",
          teaches: areaTitle,
          dateModified: lastReviewed,
          author,
          license: CONTENT_LICENSE_URL,
          isPartOf: { "@type": "Course", name: `${EXAM.code} study guide`, url: SITE_URL },
          educationalAlignment: {
            "@type": "AlignmentObject",
            alignmentType: "educationalSubject",
            targetName: EXAM.certification,
            targetUrl: EXAM.certificationUrl,
          },
        }}
      />
  );
}

export function QuizJsonLd({
  name,
  path,
  questions,
  about,
}: {
  name: string;
  path: string;
  about: string;
  questions: { question: string; options: string[]; correct: number[]; explanation: string }[];
}) {
  return (
    <Script
      data={{
        "@context": "https://schema.org",
        "@type": "Quiz",
        name,
        url: absoluteUrl(path),
        about: { "@type": "Thing", name: about },
        educationalAlignment: {
          "@type": "AlignmentObject",
          alignmentType: "assesses",
          targetName: EXAM.certification,
          targetUrl: EXAM.certificationUrl,
        },
        isAccessibleForFree: true,
        hasPart: questions.map((q) => ({
          "@type": "Question",
          eduQuestionType: q.correct.length > 1 ? "Checkbox" : "Multiple choice",
          text: q.question,
          suggestedAnswer: q.options
            .map((text, i) => ({ text, i }))
            .filter(({ i }) => !q.correct.includes(i))
            .map(({ text }) => ({ "@type": "Answer", text })),
          acceptedAnswer: q.correct.map((i) => ({
            "@type": "Answer",
            text: q.options[i],
            answerExplanation: { "@type": "Comment", text: q.explanation },
          })),
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ crumbs }: { crumbs: { name: string; path: string }[] }) {
  return <Script data={breadcrumbList(crumbs)} />;
}
