import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useLectures } from "@/hooks/use-lectures";
import { useProcessLecture } from "@/hooks/use-process-lecture";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clock,
  Sparkles,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
  ];
  return patterns.some((p) => p.test(url.trim()));
}

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  const {
    mutate: processLecture,
    isPending,
    error: mutationError,
  } = useProcessLecture();
  const { data: lectures = [], isLoading: lecturesLoading } = useLectures();

  const recentLectures = lectures.slice(0, 3);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (!url.trim()) {
      setValidationError("Please paste a YouTube lecture URL.");
      return;
    }
    if (!isValidYouTubeUrl(url)) {
      setValidationError(
        "That doesn't look like a valid YouTube URL. Try something like youtube.com/watch?v=...",
      );
      return;
    }

    processLecture(url.trim(), {
      onSuccess: (id: string) => {
        navigate({ to: "/lecture/$id", params: { id } });
      },
    });
  }

  const errorMessage =
    validationError ||
    (mutationError
      ? "Something went wrong processing that lecture. Please try again."
      : "");

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-card border-b border-border">
        {/* Decorative glow blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.2 268 / 0.7) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 right-0 w-[360px] h-[360px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.22 45 / 0.8) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-4 py-20 md:py-28 flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="gap-1.5 px-3 py-1 text-xs font-medium bg-accent/15 text-accent border-accent/30">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Study Companion
            </Badge>
          </motion.div>

          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-balance text-foreground"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            Turn any YouTube lecture into your{" "}
            <span className="text-accent">personal study guide</span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground max-w-xl text-balance leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            Paste any lecture URL and get an AI-generated summary, clickable
            transcript, key takeaways, and an interactive Q&amp;A — in seconds.
          </motion.p>

          {/* URL Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-xl mt-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-0">
                <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  data-ocid="home.url_input"
                  type="url"
                  placeholder="Paste YouTube lecture URL here..."
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setValidationError("");
                  }}
                  className="pl-10 h-12 text-sm bg-background border-input shadow-card focus-visible:ring-primary"
                  disabled={isPending}
                  aria-label="YouTube lecture URL"
                />
              </div>
              <Button
                data-ocid="home.submit_button"
                type="submit"
                disabled={isPending}
                className="h-12 px-6 gap-2 font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-elevated transition-smooth shrink-0"
              >
                {isPending ? (
                  <>
                    <span
                      className="w-4 h-4 rounded-full border-2 border-accent-foreground border-t-transparent animate-spin"
                      data-ocid="home.loading_state"
                    />
                    Processing…
                  </>
                ) : (
                  <>
                    Analyze Lecture
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {errorMessage && (
              <motion.p
                data-ocid="home.error_state"
                className="mt-3 flex items-start gap-2 text-sm text-destructive"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {errorMessage}
              </motion.p>
            )}
          </motion.form>

          {/* Feature pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.36 }}
          >
            {[
              "AI Summary",
              "Clickable Transcript",
              "Q&A Chat",
              "Download Notes",
            ].map((f) => (
              <span
                key={f}
                className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border"
              >
                {f}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Recent Lectures ── */}
      <section className="bg-background flex-1 py-14 px-4">
        <div className="mx-auto max-w-3xl">
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Recent Lectures
              </h2>
            </div>
            {recentLectures.length > 0 && (
              <Button
                data-ocid="home.history_link"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground gap-1"
                onClick={() => navigate({ to: "/history" })}
              >
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </motion.div>

          {lecturesLoading ? (
            <div
              className="flex flex-col gap-3"
              data-ocid="home.lectures.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 bg-card border-border shadow-card">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/3" />
                </Card>
              ))}
            </div>
          ) : recentLectures.length === 0 ? (
            <motion.div
              data-ocid="home.empty_state"
              className="flex flex-col items-center justify-center py-16 text-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-accent" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-lg">
                  No lectures yet
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Paste your first YouTube lecture URL above and start studying
                  smarter.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentLectures.map((lecture, index) => (
                <motion.div
                  key={lecture.id}
                  data-ocid={`home.lecture.item.${index + 1}`}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.07 }}
                >
                  <Card className="group bg-card border-border shadow-card hover:shadow-elevated hover:border-primary/30 transition-smooth overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center gap-4 p-4 text-left"
                      onClick={() =>
                        navigate({
                          to: "/lecture/$id",
                          params: { id: lecture.id },
                        })
                      }
                      aria-label={`Open lecture: ${lecture.title || "Untitled"}`}
                    >
                      {/* Thumbnail or fallback */}
                      <div className="shrink-0 w-16 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border">
                        {lecture.thumbnailUrl ? (
                          <img
                            src={lecture.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Youtube className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors duration-200">
                          {lecture.title || "Untitled Lecture"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {formatDate(lecture.createdAt)}
                        </p>
                      </div>

                      <ArrowRight className="shrink-0 w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-smooth" />
                    </button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
