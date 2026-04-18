import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAskQuestion } from "@/hooks/use-ask-question";
import { useDeleteLecture } from "@/hooks/use-delete-lecture";
import { useDownloadNotes } from "@/hooks/use-download-notes";
import { useLecture } from "@/hooks/use-lecture";
import { cn, formatTimestamp } from "@/lib/utils";
import type { QA, TranscriptSegment } from "@/types/lecture";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookMarked,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Hash,
  HelpCircle,
  List,
  Loader2,
  MessageCircle,
  Search,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

/* ─────────────────────────── helpers ─────────────────────────── */

function TimestampBadge({
  seconds,
  onClick,
  className,
}: {
  seconds: number;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-semibold",
        "bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 transition-smooth",
        onClick ? "cursor-pointer" : "cursor-default",
        className,
      )}
    >
      <Clock className="w-2.5 h-2.5" />
      {formatTimestamp(seconds)}
    </button>
  );
}

/* ─────────────────────────── skeletons ─────────────────────────── */

function LectureSkeleton() {
  return (
    <div
      className="flex flex-col lg:flex-row gap-4 h-full"
      data-ocid="lecture.loading_state"
    >
      <div className="lg:w-[45%] flex flex-col gap-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
      <div className="lg:w-[55%] flex flex-col gap-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

/* ─────────────────────────── transcript panel ─────────────────────────── */

function TranscriptPanel({
  segments,
  activeSegmentIdx,
  onSegmentClick,
  segmentRefs,
}: {
  segments: TranscriptSegment[];
  activeSegmentIdx: number | null;
  onSegmentClick: (idx: number) => void;
  segmentRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return segments.map((s, i) => ({ s, i }));
    const q = search.toLowerCase();
    return segments
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => s.text.toLowerCase().includes(q));
  }, [segments, search]);

  return (
    <Card
      className="flex flex-col h-full border-border shadow-card"
      data-ocid="transcript.panel"
    >
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="flex items-center gap-2 text-base font-display">
          <FileText className="w-4 h-4 text-accent" />
          Transcript
          <Badge variant="secondary" className="ml-auto text-xs font-mono">
            {segments.length} segments
          </Badge>
        </CardTitle>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search transcript…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm h-9"
            data-ocid="transcript.search_input"
          />
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 pb-4 space-y-1">
          {filtered.length === 0 && (
            <div
              className="text-center py-12 text-muted-foreground text-sm"
              data-ocid="transcript.empty_state"
            >
              No segments match your search.
            </div>
          )}
          {filtered.map(({ s, i }, listIdx) => (
            <button
              key={i}
              ref={(el) => {
                segmentRefs.current[i] = el;
              }}
              type="button"
              onClick={() => onSegmentClick(i)}
              data-ocid={`transcript.item.${listIdx + 1}`}
              className={cn(
                "w-full flex gap-3 p-2.5 rounded-lg transition-smooth group text-left",
                activeSegmentIdx === i
                  ? "bg-accent/12 ring-1 ring-accent/30"
                  : "hover:bg-muted/60",
              )}
            >
              <TimestampBadge
                seconds={Number(s.timestamp)}
                className="shrink-0 mt-0.5"
              />
              <p className="text-sm leading-relaxed text-foreground/90 group-hover:text-foreground min-w-0 break-words">
                {s.text}
              </p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

/* ─────────────────────────── summary panel ─────────────────────────── */

function SummaryPanel({
  title,
  thumbnailUrl,
  summary,
  takeaways,
  toc,
  onChapterClick,
}: {
  title: string;
  thumbnailUrl: string;
  summary: string;
  takeaways: string[];
  toc: { title: string; timestamp: bigint; summary: string }[];
  onChapterClick: (seconds: number) => void;
}) {
  return (
    <Card className="border-border shadow-card" data-ocid="summary.panel">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-display">
          <Sparkles className="w-4 h-4 text-accent" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {thumbnailUrl && (
          <div className="rounded-lg overflow-hidden aspect-video w-full bg-muted">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div>
          <h2 className="font-display font-semibold text-lg text-foreground leading-snug text-balance">
            {title}
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-foreground/85">{summary}</p>

        {takeaways.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              Key Takeaways
            </h3>
            <ul className="space-y-2" data-ocid="summary.takeaways_list">
              {takeaways.map((t, i) => (
                <li
                  key={t.slice(0, 40)}
                  className="flex gap-2.5 text-sm"
                  data-ocid={`summary.takeaway.${i + 1}`}
                >
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-foreground/85 leading-relaxed">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {toc.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <List className="w-3.5 h-3.5 text-accent" />
              Table of Contents
            </h3>
            <ul className="space-y-1.5" data-ocid="summary.toc_list">
              {toc.map((chapter, i) => (
                <li key={chapter.title} data-ocid={`summary.chapter.${i + 1}`}>
                  <button
                    type="button"
                    onClick={() => onChapterClick(Number(chapter.timestamp))}
                    className="w-full flex items-start gap-2.5 p-2 rounded-md text-sm hover:bg-muted/60 transition-smooth group text-left"
                  >
                    <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 group-hover:text-accent transition-smooth" />
                    <span className="flex-1 text-foreground/85 group-hover:text-foreground transition-smooth leading-snug">
                      {chapter.title}
                    </span>
                    <TimestampBadge seconds={Number(chapter.timestamp)} />
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-smooth" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─────────────────────────── Q&A panel ─────────────────────────── */

function QAPanel({
  lectureId,
  qaHistory,
  onTimestampClick,
}: {
  lectureId: string;
  qaHistory: QA[];
  onTimestampClick: (seconds: number) => void;
}) {
  const [question, setQuestion] = useState("");
  const { mutate, isPending } = useAskQuestion();
  const qaEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(() => {
    const q = question.trim();
    if (!q || isPending) return;
    mutate(
      { lectureId, question: q },
      {
        onSuccess: () => {
          setQuestion("");
          setTimeout(
            () => qaEndRef.current?.scrollIntoView({ behavior: "smooth" }),
            200,
          );
        },
        onError: () => {
          toast.error("Failed to get an answer. Please try again.");
        },
      },
    );
  }, [question, isPending, mutate, lectureId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const sorted = useMemo(
    () =>
      [...qaHistory].sort((a, b) => Number(a.createdAt) - Number(b.createdAt)),
    [qaHistory],
  );

  return (
    <Card className="border-border shadow-card" data-ocid="qa.panel">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-display">
          <MessageCircle className="w-4 h-4 text-accent" />
          Ask AI
          <Badge variant="secondary" className="ml-auto text-xs font-mono">
            {sorted.length} questions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* History */}
        {sorted.length > 0 && (
          <ScrollArea className="max-h-72 pr-1">
            <div className="space-y-4" data-ocid="qa.history_list">
              {sorted.map((qa, i) => (
                <div
                  key={qa.id}
                  className="space-y-2"
                  data-ocid={`qa.item.${i + 1}`}
                >
                  {/* Question */}
                  <div className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <HelpCircle className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      {qa.question}
                    </p>
                  </div>
                  {/* Answer */}
                  <div className="ml-8 p-3 rounded-lg bg-accent/8 border border-accent/20">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3 h-3 text-accent" />
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                        AI Answer
                      </span>
                      {qa.timestamp !== null && (
                        <TimestampBadge
                          seconds={Number(qa.timestamp)}
                          onClick={() => onTimestampClick(Number(qa.timestamp))}
                          className="ml-auto"
                        />
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap">
                      {qa.answer}
                    </p>
                  </div>
                  {i < sorted.length - 1 && <Separator />}
                </div>
              ))}
              <div ref={qaEndRef} />
            </div>
          </ScrollArea>
        )}

        {sorted.length === 0 && (
          <div
            className="flex flex-col items-center gap-2 py-6 text-center"
            data-ocid="qa.empty_state"
          >
            <BookMarked className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No questions yet. Ask anything about this lecture!
            </p>
          </div>
        )}

        {/* Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Ask a question about this lecture… (Ctrl+Enter to submit)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="resize-none text-sm"
            data-ocid="qa.textarea"
          />
          <Button
            onClick={handleSubmit}
            disabled={!question.trim() || isPending}
            className="w-full gap-2"
            data-ocid="qa.submit_button"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Thinking…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Ask AI
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─────────────────────────── download bar ─────────────────────────── */

function DownloadBar({ lectureId }: { lectureId: string }) {
  const [enabled, setEnabled] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<"txt" | "md" | null>(null);
  const { data, isFetching } = useDownloadNotes(lectureId, enabled);

  useEffect(() => {
    if (!data || !pendingFormat) return;
    const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lecture-notes.${pendingFormat === "md" ? "md" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(
      `Notes downloaded as .${pendingFormat === "md" ? "md" : "txt"}`,
    );
    setPendingFormat(null);
    setEnabled(false);
  }, [data, pendingFormat]);

  const handleDownload = (format: "txt" | "md") => {
    setPendingFormat(format);
    setEnabled(true);
  };

  const handlePdfDownload = () => {
    toast.info(
      "PDF export — open your browser's print dialog and choose 'Save as PDF'.",
    );
    window.print();
  };

  return (
    <div
      className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border shadow-card"
      data-ocid="download.bar"
    >
      <Download className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-sm font-medium text-muted-foreground mr-1">
        Download Notes:
      </span>
      <div className="flex gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-8"
          onClick={handlePdfDownload}
          data-ocid="download.pdf_button"
        >
          <FileText className="w-3 h-3" />
          PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-8"
          disabled={isFetching && pendingFormat === "txt"}
          onClick={() => handleDownload("txt")}
          data-ocid="download.txt_button"
        >
          {isFetching && pendingFormat === "txt" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <FileText className="w-3 h-3" />
          )}
          TXT
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-8"
          disabled={isFetching && pendingFormat === "md"}
          onClick={() => handleDownload("md")}
          data-ocid="download.md_button"
        >
          {isFetching && pendingFormat === "md" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Hash className="w-3 h-3" />
          )}
          Markdown
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────── delete button ─────────────────────────── */

function DeleteButton({ lectureId }: { lectureId: string }) {
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending } = useDeleteLecture();
  const navigate = useNavigate();

  const handleDelete = () => {
    mutate(lectureId, {
      onSuccess: () => {
        toast.success("Lecture deleted.");
        void navigate({ to: "/" });
      },
      onError: () => {
        toast.error("Failed to delete lecture.");
        setConfirming(false);
      },
    });
  };

  if (confirming) {
    return (
      <div
        className="flex items-center gap-2"
        data-ocid="delete.confirm_dialog"
      >
        <span className="text-sm text-destructive font-medium">
          Delete this lecture?
        </span>
        <Button
          variant="destructive"
          size="sm"
          className="h-8 gap-1.5"
          onClick={handleDelete}
          disabled={isPending}
          data-ocid="delete.confirm_button"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
          Yes, delete
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setConfirming(false)}
          data-ocid="delete.cancel_button"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
      onClick={() => setConfirming(true)}
      data-ocid="delete.open_modal_button"
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Delete</span>
    </Button>
  );
}

/* ─────────────────────────── main page ─────────────────────────── */

export default function Lecture() {
  const { id } = useParams({ from: "/lecture/$id" });
  const { data: lecture, isLoading, error } = useLecture(id);

  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeSegmentIdx, setActiveSegmentIdx] = useState<number | null>(null);

  const scrollToSegment = useCallback(
    (seconds: number) => {
      if (!lecture) return;
      const segments = lecture.transcript;
      let closest = 0;
      let minDiff = Number.POSITIVE_INFINITY;
      for (let i = 0; i < segments.length; i++) {
        const diff = Math.abs(Number(segments[i].timestamp) - seconds);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      }
      setActiveSegmentIdx(closest);
      segmentRefs.current[closest]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    [lecture],
  );

  /* ── loading ── */
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LectureSkeleton />
      </div>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <div
        className="container mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center"
        data-ocid="lecture.error_state"
      >
        <AlertTriangle className="w-10 h-10 text-destructive" />
        <h2 className="text-xl font-display font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          {error instanceof Error
            ? error.message
            : "Unable to load the lecture."}
        </p>
      </div>
    );
  }

  /* ── not found ── */
  if (!lecture) {
    return (
      <div
        className="container mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center"
        data-ocid="lecture.empty_state"
      >
        <BookMarked className="w-10 h-10 text-muted-foreground/40" />
        <h2 className="text-xl font-display font-semibold text-foreground">
          Lecture not found
        </h2>
        <p className="text-muted-foreground text-sm">
          This lecture may have been deleted or doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-6 space-y-4"
      data-ocid="lecture.page"
    >
      {/* Page header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <BookMarked className="w-5 h-5 text-accent shrink-0" />
          <h1
            className="font-display font-semibold text-foreground truncate text-lg"
            title={lecture.title}
          >
            {lecture.title}
          </h1>
        </div>
        <DeleteButton lectureId={id} />
      </div>

      {/* Download bar */}
      <DownloadBar lectureId={id} />

      {/* Two-column content */}
      <div className="flex flex-col lg:flex-row gap-4 min-h-[70vh]">
        {/* Left: transcript */}
        <div className="lg:w-[45%] flex flex-col min-h-[500px] lg:min-h-0 lg:sticky lg:top-20 lg:max-h-[calc(100vh-8rem)]">
          <TranscriptPanel
            segments={lecture.transcript as TranscriptSegment[]}
            activeSegmentIdx={activeSegmentIdx}
            onSegmentClick={setActiveSegmentIdx}
            segmentRefs={segmentRefs}
          />
        </div>

        {/* Right: summary + Q&A */}
        <div className="lg:w-[55%] space-y-4">
          <SummaryPanel
            title={lecture.title}
            thumbnailUrl={lecture.thumbnailUrl}
            summary={lecture.summary}
            takeaways={lecture.takeaways}
            toc={lecture.tableOfContents}
            onChapterClick={scrollToSegment}
          />
          <QAPanel
            lectureId={id}
            qaHistory={lecture.qa as QA[]}
            onTimestampClick={scrollToSegment}
          />
        </div>
      </div>
    </div>
  );
}
