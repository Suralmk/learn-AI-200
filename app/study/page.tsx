import {
  getLearningPaths,
  getStudyGuides,
  getAllFilterTags,
  getAllAreas,
} from "@/lib/content";
import StudyClient from "./study-client";

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
