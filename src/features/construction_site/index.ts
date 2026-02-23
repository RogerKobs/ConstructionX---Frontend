export interface ConstructionSiteEmployee {
  id: number;
  firstName: string;
  lastName: string;
  jobPositionName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  assignmentWindows?: AssignEmployeeWindow[] | null;
}

export interface ConstructionSiteTool {
  responsibleEmployeeId: number | null | undefined;
  id: number;
  name?: string | null;
  model?: string | null;
  inventoryNumber?: string | null;
  serialNumber?: string | null;
  status?: string | null;
  condition?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  responsibleEmployeeName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  assignmentWindows?: AssignToolWindow[] | null;
  description?: string | null;
  category?: string | null;
}

export interface ConstructionSiteVehicle {
  responsibleEmployeeId: number | null | undefined;
  id: number;
  name?: string | null;
  registrationNumber?: string | null;
  vin?: string | null;
  vehicleType?: string | null;
  brand?: string | null;
  model?: string | null;
  yearOfManufacturing?: number | null;
  horsePower?: number | null;
  weight?: number | null;
  averageConsumption?: number | null;
  status?: string | null;
  condition?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  responsibleEmployeeName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  assignmentWindows?: AssignVehicleWindow[] | null;
  description?: string | null;
}

export interface ConstructionSiteCondo {
  id: number;
  address?: string | null;
  capacity?: number | null;
  currentlyOccupied?: number | null;
  leaseStartDate?: string | null;
  leaseEndDate?: string | null;
  pricePerDay?: number | null;
  pricePerMonth?: number | null;
  currency?: string | null;
  notes?: string | null;
  responsibleEmployeeId?: number | null;
  responsibleEmployeeName?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface ConstructionSite {
  id: number;
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description: string | null;
  siteManagerId: number | null;
  createdDate: string;
  siteManagerName: string;
  status: number;
  constructionSiteEmployees: ConstructionSiteEmployee[];
  constructionSiteTools: ConstructionSiteTool[];
  constructionSiteVehicles: ConstructionSiteVehicle[];
  constructionSiteCondos: ConstructionSiteCondo[];
}

export interface NewConstructionSiteRequest {
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description?: string | null;
  status: number;
  siteManagerId: number | null;
}

export interface UpdateConstructionSiteRequest {
  id: number;
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description?: string | null;
  siteManagerId: number | null;
}

export interface AssignEmployeeWindow {
  dateFrom: string;
  dateTo: string;
}

export interface AssignEmployeeItem {
  employeeId: number;
  assignmentWindows: AssignEmployeeWindow[];
}

export interface AssignEmployeesRequest {
  constructionSiteId: number;
  employees: AssignEmployeeItem[];
}

export interface AssignToolWindow {
  dateFrom: string;
  dateTo: string;
  responsibleEmployeeId: number;
}

export interface AssignToolItem {
  toolId: number;
  assignmentWindows: AssignToolWindow[];
}

export interface AssignToolsRequest {
  constructionSiteId: number;
  tools: AssignToolItem[];
}

export interface AssignVehicleWindow {
  dateFrom: string;
  dateTo: string;
  responsibleEmployeeId: number;
}

export interface AssignVehicleItem {
  vehicleId: number;
  assignmentWindows: AssignVehicleWindow[];
}

export interface AssignVehiclesRequest {
  constructionSiteId: number;
  vehicles: AssignVehicleItem[];
}

export type { PagedResult } from "../../shared/types/api";

export interface GetConstructionSitesQuery {
  startDate?: string;
  plannedEndDate?: string;
  status?: number;
  location?: string;
  siteManagerId?: number;
  employeeId?: number;
  toolId?: number;
  vehicleId?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface ChangeConstructionSiteStatusRequest {
  id: number;
  status: number;
}

export interface ConstructionSiteFormValues {
  name: string;
  location: string;
  startDate: string;
  plannedEndDate: string;
  description?: string | null;
  siteManagerId: number | null;
  status?: number;
}

export interface AssignCondoItem {
  condoId: number;
  dateFrom: string;
  dateTo: string;
  responsibleEmployeeId: number;
}

export interface AssignCondosRequest {
  constructionSiteId: number;
  condos: AssignCondoItem[];
}

export interface ConstructionSiteEmployeeWorkLogDay {
  workDate: string;
  startTime: string;
  endTime: string;
}

export interface UpsertConstructionSiteEmployeeWorkLogsRequest {
  constructionSiteId: number;
  employeeId: number;
  workLogs: ConstructionSiteEmployeeWorkLogDay[];
}

export interface GetConstructionSiteEmployeeWorkLogsQuery {
  constructionSiteId: number;
  employeeId: number;
}

export interface ConstructionSiteEmployeeWorkLog {
  constructionSiteId: number;
  employeeId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  totalWorkMinutes?: number | null;
  hours?: number | null;
  minutes?: number | null;
  seconds?: number | null;

  employeeName?: string | null;
  constructionSiteName?: string | null;
}

export interface GetConstructionSiteEmployeeWorkLogsAllQuery {
  dateFrom?: string;
  dateTo?: string;
  constructionSiteId?: number;
  employeeId?: number;
  page?: number;
  pageSize?: number;
}
export interface UpsertConstructionSiteEmployeeWorkLogsBulkRequest {
  entries: UpsertConstructionSiteEmployeeWorkLogsRequest[];
}

export interface GetWorkLogPreparationQuery {
  dateFrom: string;
  dateTo: string;
}

export interface WorkLogPreparationAssignmentWindow {
  dateFrom: string;
  dateTo?: string | null;
}

export interface WorkLogPreparationExistingWorkLog {
  id: number;
  constructionSiteEmployeeId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  totalWorkMinutes?: number | null;
  hours?: number | null;
  minutes?: number | null;
  seconds?: number | null;
}

export interface WorkLogPreparationEmployee {
  employeeId: number;
  firstName: string;
  lastName: string;
  jobPositionName?: string | null;
  eligibleDateFrom: string;
  eligibleDateTo: string;
  assignmentWindows: WorkLogPreparationAssignmentWindow[];
  existingWorkLogs: WorkLogPreparationExistingWorkLog[];
}

export interface WorkLogPreparationSite {
  constructionSiteId: number;
  constructionSiteName: string;
  location: string;
  employees: WorkLogPreparationEmployee[];
}
