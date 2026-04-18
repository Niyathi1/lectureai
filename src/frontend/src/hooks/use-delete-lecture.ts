import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";

export function useDeleteLecture() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteLecture(id);
    },
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ["lectures"] });
      void queryClient.removeQueries({ queryKey: ["lecture", id] });
    },
  });
}
