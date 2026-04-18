import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";

export function useProcessLecture() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<string, Error, string>({
    mutationFn: async (url) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.processLecture(url);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok.id;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });
}
