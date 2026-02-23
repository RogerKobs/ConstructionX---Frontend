import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useUpsertConstructionSiteEmployeeWorkLogsBulk } from "../../construction_site/hooks/useUpsertConstructionSiteEmployeeWorkLogsBulk";
import { useCurrentEmployeeContext } from "../../auth/hooks/useCurrentEmployeeContext";
import { useConstructionSiteWorkLogPreparation } from "../../construction_site/hooks/useConstructionSiteWorkLogPreparation";
import { format, parse, isAfter } from "date-fns";
import WorkHoursStepperDialog from "./WorkHoursStepperDialog";

const STEP_SELECT_PERIOD = 0;
const STEP_SELECT_SITE = 1;
const STEP_SELECT_EMPLOYEE_TIME = 2;

type Props = {
  open: boolean;
  onClose: () => void;
  defaultDate?: Date;
};

export default function WorkHoursCreateDialog({
  open,
  onClose,
  defaultDate,
}: Props) {
  const { t, i18n } = useTranslation();
  const { mutateAsync: upsertBulk, isPending } =
    useUpsertConstructionSiteEmployeeWorkLogsBulk();
  const { isAdmin, employeeId } = useCurrentEmployeeContext();

  const [activeStep, setActiveStep] = useState(0);
  const [constructionSiteId, setConstructionSiteId] = useState<number | "">("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | "">("");
  const [dateFrom, setDateFrom] = useState<Date | null>(
    defaultDate ?? new Date(),
  );
  const [dateTo, setDateTo] = useState<Date | null>(defaultDate ?? new Date());

  const [workDate, setWorkDate] = useState<Date | null>(
    defaultDate ?? new Date(),
  );

  const [startTime, setStartTime] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(8, 0, 0, 0);
    return d;
  });
  const [endTime, setEndTime] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(16, 0, 0, 0);
    return d;
  });

  const dateFromIso = useMemo(
    () => (dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined),
    [dateFrom],
  );
  const dateToIso = useMemo(
    () => (dateTo ? format(dateTo, "yyyy-MM-dd") : undefined),
    [dateTo],
  );

  const {
    data: preparationData = [],
    isLoading: preparationLoading,
    isError: preparationError,
    error: preparationQueryError,
    refetch: refetchPreparation,
  } = useConstructionSiteWorkLogPreparation({
    dateFrom: dateFromIso,
    dateTo: dateToIso,
    enabled: open && Boolean(dateFromIso && dateToIso),
  });

  const filteredPreparation = useMemo(() => {
    if (isAdmin) {
      return preparationData;
    }
    if (!employeeId) {
      return [];
    }

    return preparationData
      .map((site) => ({
        ...site,
        employees: site.employees.filter(
          (employee) => employee.employeeId === employeeId,
        ),
      }))
      .filter((site) => site.employees.length > 0);
  }, [isAdmin, employeeId, preparationData]);

  const selectedSite = useMemo(
    () =>
      typeof constructionSiteId === "number"
        ? filteredPreparation.find(
            (site) => site.constructionSiteId === constructionSiteId,
          )
        : undefined,
    [constructionSiteId, filteredPreparation],
  );

  const availableEmployees = selectedSite?.employees ?? [];
  const selectedEmployee = useMemo(
    () =>
      typeof selectedEmployeeId === "number"
        ? availableEmployees.find(
            (employee) => employee.employeeId === selectedEmployeeId,
          )
        : undefined,
    [availableEmployees, selectedEmployeeId],
  );

  const minWorkDate = useMemo(
    () =>
      selectedEmployee ? new Date(selectedEmployee.eligibleDateFrom) : null,
    [selectedEmployee],
  );
  const maxWorkDate = useMemo(
    () => (selectedEmployee ? new Date(selectedEmployee.eligibleDateTo) : null),
    [selectedEmployee],
  );

  const workDateIso = useMemo(
    () => (workDate ? format(workDate, "yyyy-MM-dd") : undefined),
    [workDate],
  );

  const stepLabels = [
    t("workHours.stepper.period", "Period"),
    t("workHours.stepper.site", "Construction site"),
    t("workHours.stepper.employeeTime", "Employee & time"),
  ];

  const parseTime = (timeValue?: string | null): Date | null => {
    if (!timeValue) return null;
    const pattern = timeValue.length === 5 ? "HH:mm" : "HH:mm:ss";
    return parse(timeValue, pattern, new Date());
  };

  const resetForm = () => {
    setActiveStep(0);
    setConstructionSiteId("");
    setSelectedEmployeeId("");
    setDateFrom(defaultDate ?? new Date());
    setDateTo(defaultDate ?? new Date());
    setWorkDate(defaultDate ?? new Date());
    const start = new Date();
    start.setHours(8, 0, 0, 0);
    setStartTime(start);
    const end = new Date();
    end.setHours(16, 0, 0, 0);
    setEndTime(end);
  };

  useEffect(() => {
    if (open) {
      if (defaultDate) {
        setDateFrom(defaultDate);
        setDateTo(defaultDate);
        setWorkDate(defaultDate);
      }
    }
  }, [open, defaultDate]);

  useEffect(() => {
    if (!open || isAdmin || !employeeId) return;
    setSelectedEmployeeId(employeeId);
  }, [open, isAdmin, employeeId]);

  useEffect(() => {
    if (!selectedSite) {
      setSelectedEmployeeId(isAdmin ? "" : (employeeId ?? ""));
      return;
    }

    if (
      typeof selectedEmployeeId === "number" &&
      selectedSite.employees.some(
        (employee) => employee.employeeId === selectedEmployeeId,
      )
    ) {
      return;
    }

    if (!isAdmin && employeeId) {
      const mine = selectedSite.employees.find(
        (employee) => employee.employeeId === employeeId,
      );
      setSelectedEmployeeId(mine ? employeeId : "");
      return;
    }

    setSelectedEmployeeId("");
  }, [selectedSite, selectedEmployeeId, isAdmin, employeeId]);

  useEffect(() => {
    if (!selectedEmployee || !workDate) return;
    if (minWorkDate && isAfter(minWorkDate, workDate)) {
      setWorkDate(minWorkDate);
      return;
    }
    if (maxWorkDate && isAfter(workDate, maxWorkDate)) {
      setWorkDate(maxWorkDate);
    }
  }, [selectedEmployee, workDate, minWorkDate, maxWorkDate]);

  useEffect(() => {
    if (!selectedEmployee || !workDateIso) return;
    const existing = selectedEmployee.existingWorkLogs.find(
      (workLog) => workLog.workDate === workDateIso,
    );
    if (!existing) return;

    const parsedStart = parseTime(existing.startTime);
    const parsedEnd = parseTime(existing.endTime);
    if (parsedStart) setStartTime(parsedStart);
    if (parsedEnd) setEndTime(parsedEnd);
  }, [selectedEmployee, workDateIso]);

  const isStep0Valid =
    Boolean(dateFrom && dateTo) &&
    !(dateFrom && dateTo && isAfter(dateFrom, dateTo));
  const isStep1Valid = typeof constructionSiteId === "number";
  const isTimeRangeInvalid =
    Boolean(startTime && endTime) &&
    !isAfter(endTime as Date, startTime as Date);
  const isStep2Valid =
    typeof selectedEmployeeId === "number" &&
    Boolean(workDate && startTime && endTime) &&
    !isTimeRangeInvalid;

  const handleAdvance = async () => {
    if (activeStep === STEP_SELECT_PERIOD) {
      if (!isStep0Valid) return;
      const prep = await refetchPreparation();
      if (prep.error) return;
      setConstructionSiteId("");
      setSelectedEmployeeId(isAdmin ? "" : (employeeId ?? ""));
      setActiveStep(STEP_SELECT_SITE);
      return;
    }

    if (activeStep === STEP_SELECT_SITE) {
      if (!isStep1Valid) return;
      setActiveStep(STEP_SELECT_EMPLOYEE_TIME);
      return;
    }

    if (!isStep2Valid) {
      return;
    }

    await upsertBulk({
      entries: [
        {
          constructionSiteId: Number(constructionSiteId),
          employeeId: Number(selectedEmployeeId),
          workLogs: [
            {
              workDate: format(workDate!, "yyyy-MM-dd"),
              startTime: format(startTime!, "HH:mm:ss"),
              endTime: format(endTime!, "HH:mm:ss"),
            },
          ],
        },
      ],
    });

    onClose();
  };

  const submitText =
    activeStep === STEP_SELECT_EMPLOYEE_TIME
      ? t("common.save", "Save")
      : t("common.next", "Next");

  const submitDisabled =
    isPending ||
    (activeStep === STEP_SELECT_PERIOD &&
      (!isStep0Valid || preparationLoading)) ||
    (activeStep === STEP_SELECT_SITE && !isStep1Valid) ||
    (activeStep === STEP_SELECT_EMPLOYEE_TIME && !isStep2Valid);

  const isTwelveHourClock = useMemo(
    () => i18n.language?.startsWith("en"),
    [i18n.language],
  );

  return (
    <WorkHoursStepperDialog
      open={open}
      onClose={onClose}
      onExited={resetForm}
      title={t("workHours.record")}
      subtitle={t(
        "workHours.stepper.subtitle",
        "Follow the steps to log work hours",
      )}
      submitText={submitText}
      cancelText={t("common.cancel", "Cancel")}
      submitting={isPending}
      submitDisabled={submitDisabled}
      onSubmit={handleAdvance}
      activeStep={activeStep}
      stepLabels={stepLabels}
    >
      <Stack spacing={2.5}>
        {activeStep === STEP_SELECT_PERIOD && (
          <Stack spacing={1.5}>
            <DatePicker
              label={t("workHours.stepper.dateFrom", "Date from")}
              value={dateFrom}
              onChange={(newValue) => setDateFrom(newValue)}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
            <DatePicker
              label={t("workHours.stepper.dateTo", "Date to")}
              value={dateTo}
              onChange={(newValue) => setDateTo(newValue)}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
            {!isStep0Valid && (
              <Alert severity="warning">
                {t(
                  "workHours.stepper.periodInvalid",
                  "Date to must be greater than or equal to date from.",
                )}
              </Alert>
            )}
            {preparationError && (
              <Alert severity="error">
                {preparationQueryError?.message ??
                  t("common.loadError", "Failed to load data.")}
              </Alert>
            )}
          </Stack>
        )}

        {activeStep === STEP_SELECT_SITE && (
          <Stack spacing={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="wh-site-label">
                {t("constructionSites.list.filterBySite")}
              </InputLabel>
              <Select
                labelId="wh-site-label"
                value={constructionSiteId}
                label={t("constructionSites.list.filterBySite")}
                onChange={(e) => {
                  const nextId = Number(e.target.value);
                  setConstructionSiteId(Number.isFinite(nextId) ? nextId : "");
                }}
              >
                {filteredPreparation.map((site) => (
                  <MenuItem
                    key={site.constructionSiteId}
                    value={site.constructionSiteId}
                  >
                    {site.constructionSiteName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {filteredPreparation.length === 0 && !preparationLoading && (
              <Alert severity="info">
                {t(
                  "workHours.stepper.noAssignments",
                  "No employee assignments found for the selected period.",
                )}
              </Alert>
            )}
            {preparationLoading && (
              <Typography variant="body2" color="text.secondary">
                {t("common.loading", "Loading...")}
              </Typography>
            )}
          </Stack>
        )}

        {activeStep === STEP_SELECT_EMPLOYEE_TIME && (
          <Stack spacing={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel id="wh-employee-label">
                {t("assignments.filterByEmployee")}
              </InputLabel>
              <Select
                labelId="wh-employee-label"
                value={selectedEmployeeId}
                label={t("assignments.filterByEmployee")}
                disabled={!isAdmin}
                onChange={(e) => {
                  const nextId = Number(e.target.value);
                  setSelectedEmployeeId(Number.isFinite(nextId) ? nextId : "");
                }}
              >
                {availableEmployees.map((employee) => (
                  <MenuItem
                    key={employee.employeeId}
                    value={employee.employeeId}
                  >
                    {`${employee.firstName} ${employee.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DatePicker
              label={t("workHours.date")}
              value={workDate}
              onChange={(newValue) => setWorkDate(newValue)}
              minDate={minWorkDate ?? undefined}
              maxDate={maxWorkDate ?? undefined}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />

            <Stack direction="row" spacing={2}>
              <TimePicker
                label={t("workHours.startTime")}
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                ampm={isTwelveHourClock}
                ampmInClock={isTwelveHourClock}
                format={isTwelveHourClock ? "hh:mm a" : "HH:mm"}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
              <TimePicker
                label={t("workHours.endTime")}
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                ampm={isTwelveHourClock}
                ampmInClock={isTwelveHourClock}
                format={isTwelveHourClock ? "hh:mm a" : "HH:mm"}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Stack>

            {isTimeRangeInvalid && (
              <Alert severity="warning">
                {t(
                  "workHours.stepper.invalidTimeRange",
                  "End time must be after start time.",
                )}
              </Alert>
            )}
          </Stack>
        )}

        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ mt: 1 }}
        >
          <Button
            size="small"
            variant="text"
            disabled={activeStep === STEP_SELECT_PERIOD || isPending}
            onClick={() =>
              setActiveStep((prev) => Math.max(prev - 1, STEP_SELECT_PERIOD))
            }
            sx={{ 
              textTransform: "none", 
              fontWeight: 600,
              color: "#6B7280",
              "&:hover": { backgroundColor: "#F3F4F6" }
            }}
          >
            ← {t("common.back", "Back")}
          </Button>
        </Stack>
      </Stack>
    </WorkHoursStepperDialog>
  );
}
