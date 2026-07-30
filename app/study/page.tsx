import type { Metadata } from "next";
import {
  getLearningPaths,
  getStudyGuides,
  getAllFilterTags,
  getAllAreas,
} from "@/lib/content";
import StudyClient from "./study-client";

export const metadata: Metadata = {
  title: "AI-200 Study Notes & Learning Paths",
  description:
    "Free Microsoft AI-200 study notes and learning paths for the Azure AI Cloud Developer Associate exam — containers, vector databases, Azure services, security, and more.",
  alternates: { canonical: "/study" },
};

export default function StudyPage() {
  const paths = getLearningPaths();
  const guides = getStudyGuides();
  const filterTags = getAllFilterTags();
  const areas = getAllAreas();

  return (
    <StudyClient
      paths={paths}
      guides={guides}
      filterTags={filterTags}
      areas={areas}
    />
  );
}
