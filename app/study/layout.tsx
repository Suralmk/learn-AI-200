import { Sidebar } from "@/components/shell/sidebar";
import { buildStudyNav } from "@/lib/nav";

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  const nav = buildStudyNav();
  return (
    <div className="mx-auto max-w-[90rem] lg:flex">
      <Sidebar nav={nav} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
