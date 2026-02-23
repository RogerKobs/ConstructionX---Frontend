export const constructionSitesKeys = {
  all: ["construction-sites"] as const,
  list: () => [...constructionSitesKeys.all, "list"] as const,
  detail: (id: number) => [...constructionSitesKeys.all, "detail", id] as const,
  employeeWorkLogs: () =>
    [...constructionSitesKeys.all, "employee-work-logs"] as const,
  employeeWorkLogsDetail: (constructionSiteId: number, employeeId: number) =>
    [
      ...constructionSitesKeys.employeeWorkLogs(),
      "detail",
      constructionSiteId,
      employeeId,
    ] as const,
  employeeWorkLogsAll: (filters?: {
    dateFrom?: string;
    dateTo?: string;
    constructionSiteId?: number;
    employeeId?: number;
    page?: number;
    pageSize?: number;
  }) =>
    [
      ...constructionSitesKeys.employeeWorkLogs(),
      "all",
      filters ?? {},
    ] as const,
  workLogPreparation: (filters: { dateFrom: string; dateTo: string }) =>
    [...constructionSitesKeys.employeeWorkLogs(), "preparation", filters] as const,
};
