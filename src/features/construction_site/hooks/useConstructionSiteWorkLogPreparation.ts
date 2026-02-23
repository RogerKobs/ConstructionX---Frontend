import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GetWorkLogPreparationQuery, WorkLogPreparationSite } from "..";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { constructionSitesKeys } from "../api/construction-site.keys";

type UseConstructionSiteWorkLogPreparationArgs = Partial<GetWorkLogPreparationQuery> & {
  enabled?: boolean;
};

export function useConstructionSiteWorkLogPreparation(
  args: UseConstructionSiteWorkLogPreparationArgs,
) {
  const queryParams = useMemo<GetWorkLogPreparationQuery | null>(() => {
    if (!args.dateFrom || !args.dateTo) {
      return null;
    }

    return {
      dateFrom: args.dateFrom,
      dateTo: args.dateTo,
    };
  }, [args.dateFrom, args.dateTo]);

  const enabled = Boolean(args.enabled ?? true) && queryParams !== null;

  return useQuery<WorkLogPreparationSite[], Error>({
    enabled,
    queryKey: constructionSitesKeys.workLogPreparation(
      queryParams ?? { dateFrom: "", dateTo: "" },
    ),
    queryFn: () => ConstructionSiteApi.getWorkLogPreparation(queryParams!),
    staleTime: 60_000,
  });
}
