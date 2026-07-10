import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ClipboardList, GraduationCap } from "lucide-react";
import azureLogo from "@/app/asset/Microsoft_Azure-Logo.wine.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DOMAINS } from "@/lib/domains";
import { getStudyTopics } from "@/lib/content";
import { getAllQuestions } from "@/lib/questions";

export default function HomePage() {
  const topics = getStudyTopics();
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
            Mock exam
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
                {topics.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Topics with Python, az CLI, and concepts
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
              <CardTitle className="text-base">Mock exam</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-primary">20</p>
              <p className="text-sm text-muted-foreground">
                Random questions across all domains
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
