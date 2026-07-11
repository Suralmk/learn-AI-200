import {
  getLearningPaths,
  getAllFilterTags,
  getAllAreas,
} from "@/lib/content";
import StudyClient from "./study-client";

export default function StudyPage() {
  const paths = getLearningPaths();
  const filterTags = getAllFilterTags();
  const areas = getAllAreas();

  return (
    <StudyClient paths={paths} filterTags={filterTags} areas={areas} />
  );
}
