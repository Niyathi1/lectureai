import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";

interface AskQuestionArgs {
  lectureId: string;
  question: string;
  timestamp?: bigint;
}

export function useAskQuestion() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<string, Error, AskQuestionArgs>({
    mutationFn: async ({ lectureId, question, timestamp }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.askQuestion(
        lectureId,
        question,
        timestamp ?? null,
      );
      if ("ok" in result) return result.ok;
      throw new Error(result.err);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["lecture", variables.lectureId],
      });
    },
  });
}
