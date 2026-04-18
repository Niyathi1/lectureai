import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteLecture } from "@/hooks/use-delete-lecture";
import { useLectures } from "@/hooks/use-lectures";
import type { LectureRecord } from "@/types/lecture";
import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Calendar, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(createdAt: bigint): string {
  const ms = Number(createdAt) / 1_000_000;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(ms));
}

function LectureCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full aspect-video" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-9" />
      </CardFooter>
    </Card>
  );
}

interface LectureCardProps {
  lecture: LectureRecord;
  index: number;
  onDeleteClick: (lecture: LectureRecord) => void;
}

function LectureCard({ lecture, index, onDeleteClick }: LectureCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="overflow-hidden group transition-smooth hover:shadow-elevated hover:-translate-y-0.5 border-border"
      data-ocid={`history.item.${index}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {lecture.thumbnailUrl ? (
          <img
            src={lecture.thumbnailUrl}
            alt={lecture.title}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-card">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
        )}
        {/* Date badge overlay */}
        <div className="absolute top-2 right-2">
          <Badge
            variant="secondary"
            className="text-xs bg-background/90 backdrop-blur-sm border border-border/50"
          >
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(lecture.createdAt)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <h3
          className="font-display font-semibold text-foreground line-clamp-2 leading-snug min-w-0"
          title={lecture.title}
        >
          {lecture.title || "Untitled Lecture"}
        </h3>

        {/* Stats */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="text-xs text-muted-foreground gap-1"
          >
            <BookOpen className="w-3 h-3" />
            {lecture.transcript.length} segments
          </Badge>
          <Badge
            variant="outline"
            className="text-xs text-muted-foreground gap-1"
          >
            <MessageSquare className="w-3 h-3" />
            {lecture.qa.length} questions
          </Badge>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
          onClick={() =>
            void navigate({ to: "/lecture/$id", params: { id: lecture.id } })
          }
          data-ocid={`history.view_button.${index}`}
        >
          View Lecture
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="w-9 h-9 text-destructive border-border hover:bg-destructive/10 hover:border-destructive/40 transition-smooth"
          onClick={() => onDeleteClick(lecture)}
          aria-label="Delete lecture"
          data-ocid={`history.delete_button.${index}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 px-4 text-center"
      data-ocid="history.empty_state"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-3xl gradient-primary flex items-center justify-center shadow-elevated mx-auto">
          <BookOpen className="w-14 h-14 text-primary-foreground" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
          <Plus className="w-5 h-5 text-accent" />
        </div>
      </div>

      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
        No lectures yet
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm text-balance">
        Paste a YouTube lecture link on the home page and let LectureAI turn it
        into smart study notes.
      </p>

      <Link to="/" data-ocid="history.go_home_button">
        <Button
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 transition-smooth shadow-card"
        >
          <Plus className="w-4 h-4" />
          Add your first lecture
        </Button>
      </Link>
    </div>
  );
}

export default function History() {
  const { data: lectures = [], isLoading } = useLectures();
  const { mutate: deleteLecture, isPending: isDeleting } = useDeleteLecture();
  const [confirmLecture, setConfirmLecture] = useState<LectureRecord | null>(
    null,
  );

  const sorted = [...lectures].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  function handleDeleteConfirm() {
    if (!confirmLecture) return;
    deleteLecture(confirmLecture.id, {
      onSuccess: () => {
        toast.success("Lecture deleted", {
          description: `"${confirmLecture.title}" has been removed.`,
        });
        setConfirmLecture(null);
      },
      onError: () => {
        toast.error("Failed to delete lecture", {
          description: "Please try again.",
        });
      },
    });
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8" data-ocid="history.page">
        <h1 className="text-3xl font-display font-bold text-foreground mb-1">
          Your Lecture History
        </h1>
        <p className="text-muted-foreground">
          {isLoading
            ? "Loading your lectures…"
            : sorted.length === 0
              ? "No lectures yet — start by pasting a YouTube link"
              : `${sorted.length} lecture${sorted.length === 1 ? "" : "s"} processed`}
        </p>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="history.loading_state"
        >
          {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((key) => (
            <LectureCardSkeleton key={key} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && sorted.length === 0 && <EmptyState />}

      {/* Lecture grid */}
      {!isLoading && sorted.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="history.list"
        >
          {sorted.map((lecture, index) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              index={index + 1}
              onDeleteClick={setConfirmLecture}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={confirmLecture !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmLecture(null);
        }}
      >
        <DialogContent data-ocid="history.dialog">
          <DialogHeader>
            <DialogTitle>Delete lecture?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                &ldquo;{confirmLecture?.title ?? "this lecture"}&rdquo;
              </span>{" "}
              and all its notes and Q&amp;A. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmLecture(null)}
              disabled={isDeleting}
              data-ocid="history.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              data-ocid="history.confirm_button"
            >
              {isDeleting ? "Deleting…" : "Delete lecture"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
