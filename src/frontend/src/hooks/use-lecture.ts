import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { LectureRecord } from "../backend.d";

export function useLecture(id: string | undefined) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<LectureRecord | null>({
    queryKey: ["lecture", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getLecture(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
