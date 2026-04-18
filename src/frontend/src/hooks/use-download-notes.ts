import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";

export function useDownloadNotes(
  lectureId: string | undefined,
  enabled = false,
) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<string | null>({
    queryKey: ["notes", lectureId],
    queryFn: async () => {
      if (!actor || !lectureId) return null;
      const lecture = await actor.getLecture(lectureId);
      if (!lecture) return null;
      const { title, summary, tableOfContents, takeaways, transcript } =
        lecture;
      const lines: string[] = [
        `# ${title}`,
        "",
        "## Summary",
        summary,
        "",
        "## Key Takeaways",
        ...takeaways.map((t) => `- ${t}`),
        "",
        "## Table of Contents",
        ...tableOfContents.map(
          (c) => `### ${c.title} (${Number(c.timestamp)}s)\n${c.summary}`,
        ),
        "",
        "## Transcript",
        ...transcript.map((seg) => `[${Number(seg.timestamp)}s] ${seg.text}`),
      ];
      return lines.join("\n");
    },
    enabled: !!actor && !isFetching && !!lectureId && enabled,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
