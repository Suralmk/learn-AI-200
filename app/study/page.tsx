import { getStudyTopics } from "@/lib/content";
import StudyClient from "./study-client";

export default function StudyPage() {
  const topics = getStudyTopics();
  return <StudyClient topics={topics} />;
}
