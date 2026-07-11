import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ClipboardList, GraduationCap } from "lucide-react";
import azureLogo from "@/app/asset/Microsoft_Azure-Logo.wine.png";
import ai200Badge from "@/app/asset/ai_200_badge.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DOMAINS } from "@/lib/domains";
import { SkillFocusSection } from "@/components/skill-focus-section";
import { EXAMS } from "@/lib/exams";
import { getLearningPaths } from "@/lib/content";
import { getAllQuestions } from "@/lib/questions";

export default function HomePage() {
  const paths = getLearningPaths();
  const questions = getAllQuestions();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-4">
          <Image
            src={azureLogo}
            alt="Microsoft Azure"
            className="h-8 w-auto dark:brightness-110"
            priority
          />
        </div>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="mb-3 text-3xl font-semibold tracking-tight">
              Learn AI-200
            </h1>
            <p className="mb-2 max-w-2xl text-muted-foreground">
              Prepare for{" "}
              <strong className="text-foreground">
                Microsoft AI-200: Developing AI Cloud Solutions on Azure
              </strong>{" "}
              — the Azure AI Cloud Developer Associate certification. Study guides
              with code samples, practice questions, and a mock exam.
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              For developers building back-end AI solutions with Python, containers,
              vector databases, and Azure services.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button render={<Link href="/study" />}>
                <BookOpen data-icon="inline-start" />
                Study materials
              </Button>
              <Button variant="outline" render={<Link href="/questions" />}>
                <ClipboardList data-icon="inline-start" />
                Practice questions
              </Button>
              <Button variant="outline" render={<Link href="/exam" />}>
                <GraduationCap data-icon="inline-start" />
                Practice exams
              </Button>
            </div>
            <p className="mt-4 text-sm">
              <a
                href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Official AI-200 study guide →
              </a>
            </p>
          </div>
          <Image
            src={ai200Badge}
            alt="Microsoft Certified Azure AI Cloud Developer Associate badge"
            className="mx-auto h-auto w-40 shrink-0 sm:mx-0 sm:w-44"
            priority
          />
        </div>
      </section>

      <section className="mb-12">
        <SkillFocusSection />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Exam domains</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DOMAINS.map((domain) => (
            <Card key={domain.id}>
              <CardHeader>
                <CardTitle className="text-base">{domain.title}</CardTitle>
                <CardDescription>{domain.weight} of exam</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {domain.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">What&apos;s included</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Study guides</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-primary">
                {paths.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Official Microsoft Learn learning paths
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-primary">
                {questions.length}
              </p>
              <p className="text-sm text-muted-foreground">
                MCQ and scenario-style with explanations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Practice exams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-primary">
                {EXAMS.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Topic-focused exams plus full mock test
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
