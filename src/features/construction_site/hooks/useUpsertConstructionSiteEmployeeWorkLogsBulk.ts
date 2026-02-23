import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import type { UpsertConstructionSiteEmployeeWorkLogsBulkRequest } from "..";
import { ConstructionSiteApi } from "../api/construction-site.api";
import { constructionSitesKeys } from "../api/construction-site.keys";

export function useUpsertConstructionSiteEmployeeWorkLogsBulk() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: UpsertConstructionSiteEmployeeWorkLogsBulkRequest) =>
      ConstructionSiteApi.upsertEmployeeWorkLogsBulk(payload),

    onSuccess: (data: any, payload) => {
      payload.entries.forEach((entry) => {
        qc.invalidateQueries({
          queryKey: constructionSitesKeys.employeeWorkLogsDetail(
            entry.constructionSiteId,
            entry.employeeId
          ),
        });
      });

      qc.invalidateQueries({
        queryKey: constructionSitesKeys.employeeWorkLogs(),
      });
      qc.invalidateQueries({
        queryKey: [...constructionSitesKeys.employeeWorkLogs(), "preparation"],
      });

      enqueueSnackbar(data.messages?.[0] || data?.messages , {
        variant: "success",
      });
    },

    onError: (err: any) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
