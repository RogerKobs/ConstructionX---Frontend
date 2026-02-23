import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckIcon from "@mui/icons-material/Check";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Divider,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export type WorkHoursPreviewField = {
  label: string;
  value: React.ReactNode;
  minWidth?: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onExited?: () => void;
  title?: string;
  subtitle?: string;
  activeStep: number;
  stepLabels: string[];
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
  submitting?: boolean;
  submitDisabled?: boolean;
  helperMessage?: string;
  children?: React.ReactNode;
};

export default function WorkHoursStepperDialog({
  open,
  onClose,
  onExited,
  title,
  subtitle,
  activeStep,
  stepLabels,
  submitText,
  cancelText,
  onSubmit,
  submitting = false,
  submitDisabled,
  helperMessage,
  children,
}: Props) {
  const { t } = useTranslation();

  const resolvedTitle = title ?? t("workHours.record");
  const resolvedSubmitText = submitText ?? t("common.submit");
  const resolvedCancelText = cancelText ?? t("common.cancel");
  const effectiveSubmitDisabled = submitDisabled ?? submitting;

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      TransitionProps={{ onExited }}
      fullWidth
      maxWidth="md"
      keepMounted
      PaperProps={{
        sx: {
          p: 0,
          backgroundColor: "#ffffff",
          overflow: "hidden",
          borderRadius: 1,
          border: "1px solid #E5E7EB",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        },
      }}
    >
      <Box sx={{ display: "flex", height: "100%", minHeight: 480 }}>
        {/* Sidebar Stepper */}
        <Box
          sx={{
            width: 240,
            backgroundColor: "#F9FAFB",
            borderRight: "1px solid #E5E7EB",
            p: 3,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
          }}
        >
          <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 0.75,
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <AssignmentOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={700} color="#111827">
              {resolvedTitle}
            </Typography>
          </Box>

          <Stack spacing={3}>
            {stepLabels.map((label, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor:
                        isActive || isCompleted ? "primary.main" : "#D1D5DB",
                      backgroundColor: isCompleted
                        ? "primary.main"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isCompleted
                        ? "white"
                        : isActive
                          ? "primary.main"
                          : "#6B7280",
                      fontSize: 13,
                      fontWeight: 700,
                      transition: "all 0.2s",
                      zIndex: 1,
                    }}
                  >
                    {isCompleted ? (
                      <CheckIcon sx={{ fontSize: 16 }} />
                    ) : (
                      index + 1
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "#111827" : "#6B7280",
                      transition: "all 0.2s",
                    }}
                  >
                    {label}
                  </Typography>
                  {index < stepLabels.length - 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 14,
                        top: 28,
                        bottom: -24,
                        width: 2,
                        backgroundColor: isCompleted
                          ? "primary.main"
                          : "#E5E7EB",
                        transition: "all 0.2s",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <DialogTitle
            sx={{
              px: { xs: 2.5, md: 4 },
              pt: 3,
              pb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                    fontSize: { xs: 18, md: 20 },
                  }}
                >
                  {stepLabels[activeStep]}
                </Typography>
                <Typography
                  sx={{
                    display: { xs: "block", md: "none" },
                    fontSize: 12,
                    fontWeight: 600,
                    color: "primary.main",
                    backgroundColor: "primary.light",
                    px: 1,
                    borderRadius: 0.5,
                    opacity: 0.8,
                  }}
                >
                  {activeStep + 1}/{stepLabels.length}
                </Typography>
              </Stack>
              {subtitle && (
                <Typography sx={{ fontSize: 13, color: "#6B7280", mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={onClose}
              disabled={submitting}
              size="small"
              sx={{ color: "#9CA3AF" }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ px: { xs: 2.5, md: 4 }, py: 4, flexGrow: 1 }}>
            <Stack spacing={3}>
              <Box
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 1,
                  p: 3,
                  backgroundColor: "#ffffff",
                }}
              >
                {children}
              </Box>
              {helperMessage && (
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "info.light",
                    backgroundColor: "#F0F9FF",
                  }}
                >
                  {helperMessage}
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{
              px: { xs: 2.5, md: 4 },
              py: 2.5,
              borderTop: "1px solid #E5E7EB",
              backgroundColor: "#F9FAFB",
            }}
          >
            <Button
              size="small"
              onClick={onClose}
              disabled={submitting}
              variant="outlined"
            >
              {resolvedCancelText}
            </Button>

            <Button
              size="small"
              variant="contained"
              onClick={onSubmit}
              disabled={effectiveSubmitDisabled}
            >
              {submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                resolvedSubmitText
              )}
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}
