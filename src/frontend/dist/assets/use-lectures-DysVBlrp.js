import "./index-BTVshwip.js";
import { u as useActor, f as useQuery, c as createActor } from "./backend-BHrVAsNJ.js";
function useLectures() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["lectures"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLectures();
    },
    enabled: !!actor && !isFetching
  });
}
export {
  useLectures as u
};
