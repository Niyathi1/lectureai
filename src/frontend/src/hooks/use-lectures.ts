import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { LectureRecord } from "../backend.d";

export function useLectures() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<LectureRecord[]>({
    queryKey: ["lectures"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLectures();
    },
    enabled: !!actor && !isFetching,
  });
}
