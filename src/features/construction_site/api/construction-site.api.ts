import type {
  AssignCondosRequest,
  AssignEmployeesRequest,
  AssignToolsRequest,
  AssignVehiclesRequest,
  ChangeConstructionSiteStatusRequest,
  ConstructionSite,
  GetConstructionSitesQuery,
  NewConstructionSiteRequest,
  PagedResult,
  UpdateConstructionSiteRequest,
  UpsertConstructionSiteEmployeeWorkLogsRequest,
  GetConstructionSiteEmployeeWorkLogsQuery,
  GetConstructionSiteEmployeeWorkLogsAllQuery,
  ConstructionSiteEmployeeWorkLog,
  ConstructionSiteEmployeeWorkLogDay,
  UpsertConstructionSiteEmployeeWorkLogsBulkRequest,
  GetWorkLogPreparationQuery,
  WorkLogPreparationSite,
} from "..";
import { authFetch, authFetchBlob } from "../../../lib/authFetch";
import type { ApiEnvelope } from "../../administration/tenants";

const base = "/api/ConstructionSite";

export const ConstructionSiteApi = {
  add: async (payload: NewConstructionSiteRequest) => {
    return authFetch<ApiEnvelope<ConstructionSite>>(`${base}/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (payload: UpdateConstructionSiteRequest) => {
    return authFetch<ApiEnvelope<ConstructionSite>>(`${base}/update`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (constructionSiteId: number) => {
    return authFetch<ApiEnvelope<string>>(`${base}/${constructionSiteId}`, {
      method: "DELETE",
    });
  },

  getById: async (constructionSiteId: number): Promise<ConstructionSite> => {
    const res = await authFetch<ApiEnvelope<ConstructionSite>>(
      `${base}/${constructionSiteId}`
    );
    return res.data;
  },

  getAll: async (
    query?: GetConstructionSitesQuery
  ): Promise<PagedResult<ConstructionSite>> => {
    const params = new URLSearchParams();

    if (query?.startDate) params.append("StartDate", query.startDate);
    if (query?.plannedEndDate)
      params.append("PlannedEndDate", query.plannedEndDate);
    if (query?.status !== undefined)
      params.append("Status", String(query.status));

    if (query?.location) params.append("Location", query.location);
    if (query?.siteManagerId !== undefined)
      params.append("SiteManagerId", String(query.siteManagerId));
    if (query?.employeeId !== undefined)
      params.append("EmployeeId", String(query.employeeId));
    if (query?.toolId !== undefined)
      params.append("ToolId", String(query.toolId));
    if (query?.vehicleId !== undefined)
      params.append("VehicleId", String(query.vehicleId));

    if (query?.sortBy) params.append("SortBy", query.sortBy);
    if (query?.sortDirection)
      params.append("SortDirection", query.sortDirection);

    params.append("Page", String(query?.page ?? 1));
    params.append("PageSize", String(query?.pageSize ?? 20));

    const qs = params.toString();
    const url = qs ? `${base}/get-all?${qs}` : `${base}/get-all`;

    const res = await authFetch<ApiEnvelope<PagedResult<ConstructionSite>>>(
      url
    );

    return res.data;
  },

  assignEmployees: async (payload: AssignEmployeesRequest) => {
    return authFetch<ApiEnvelope<number[]>>(`${base}/assign-employees`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  assignTools: async (payload: AssignToolsRequest) => {
    return authFetch<ApiEnvelope<number[]>>(`${base}/assign-tools`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  assignVehicles: async (payload: AssignVehiclesRequest) => {
    return authFetch<ApiEnvelope<number[]>>(`${base}/assign-vehicles`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  assignCondos: async (payload: AssignCondosRequest) => {
    return authFetch<ApiEnvelope<number[]>>(`${base}/assign-condos`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  changeStatus: async (payload: ChangeConstructionSiteStatusRequest) => {
    return authFetch<ApiEnvelope<string>>(`${base}/status`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  upsertEmployeeWorkLogs: async (
    payload: UpsertConstructionSiteEmployeeWorkLogsRequest
  ) => {
    return authFetch<ApiEnvelope<string>>(`${base}/employee-work-logs`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  upsertEmployeeWorkLogsBulk: async (
    payload: UpsertConstructionSiteEmployeeWorkLogsBulkRequest
  ) => {
    return authFetch<ApiEnvelope<string>>(`${base}/employee-work-logs/bulk`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  getEmployeeWorkLogs: async (
    query: GetConstructionSiteEmployeeWorkLogsQuery
  ): Promise<ConstructionSiteEmployeeWorkLogDay[]> => {
    const params = new URLSearchParams();
    params.append("ConstructionSiteId", String(query.constructionSiteId));
    params.append("EmployeeId", String(query.employeeId));

    const res = await authFetch<
      ApiEnvelope<ConstructionSiteEmployeeWorkLogDay[]>
    >(`${base}/employee-work-logs?${params.toString()}`);

    return res.data;
  },
  getAllEmployeeWorkLogs: async (
    query?: GetConstructionSiteEmployeeWorkLogsAllQuery
  ): Promise<PagedResult<ConstructionSiteEmployeeWorkLog>> => {
    const params = new URLSearchParams();

    if (query?.dateFrom) params.append("DateFrom", query.dateFrom);
    if (query?.dateTo) params.append("DateTo", query.dateTo);
    if (query?.constructionSiteId !== undefined)
      params.append("ConstructionSiteId", String(query.constructionSiteId));
    if (query?.employeeId !== undefined)
      params.append("EmployeeId", String(query.employeeId));

    params.append("Page", String(query?.page ?? 1));
    params.append("PageSize", String(query?.pageSize ?? 20));

    const qs = params.toString();
    const url = qs
      ? `${base}/employee-work-logs/all?${qs}`
      : `${base}/employee-work-logs/all`;

    const res = await authFetch<
      ApiEnvelope<PagedResult<ConstructionSiteEmployeeWorkLog>>
    >(url);

    return res.data;
  },
  getWorkLogPreparation: async (
    query: GetWorkLogPreparationQuery
  ): Promise<WorkLogPreparationSite[]> => {
    const params = new URLSearchParams();
    params.append("DateFrom", query.dateFrom);
    params.append("DateTo", query.dateTo);

    const res = await authFetch<ApiEnvelope<WorkLogPreparationSite[]>>(
      `${base}/employee-work-logs/preparation?${params.toString()}`
    );

    return res.data;
  },

  export: async () => {
    return authFetchBlob(`${base}/export`, { method: "GET" });
  },

  import: async (file: File) => {
    const formData = new FormData();
    formData.append("UploadFile", file);
    return authFetchBlob(`${base}/import`, {
      method: "POST",
      body: formData,
    });
  },
};
