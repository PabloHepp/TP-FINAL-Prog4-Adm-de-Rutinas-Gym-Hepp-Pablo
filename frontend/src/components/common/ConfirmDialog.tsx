// Este archivo define un componente de diálogo de confirmación reutilizable.
// sirve para confirmar acciones importantes antes de ejecutarlas.

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  textFieldLabel?: string;
  textFieldValue?: string;
  textFieldPlaceholder?: string;
  textFieldError?: string;
  textFieldRequired?: boolean;
  onTextFieldChange?: (value: string) => void;
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  onConfirm,
  onClose,
  textFieldLabel,
  textFieldValue,
  textFieldPlaceholder,
  textFieldError,
  textFieldRequired = false,
  onTextFieldChange,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      {(description || textFieldLabel) && (
        <DialogContent>
          <Stack spacing={2}>
            {description && <DialogContentText>{description}</DialogContentText>}
            {textFieldLabel && (
              <TextField
                label={textFieldLabel}
                value={textFieldValue ?? ""}
                placeholder={textFieldPlaceholder}
                onChange={(event) => onTextFieldChange?.(event.target.value)}
                error={Boolean(textFieldError)}
                helperText={textFieldError}
                required={textFieldRequired}
                autoFocus
              />
            )}
          </Stack>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel}</Button>
        <Button color={destructive ? "error" : "primary"} onClick={onConfirm} autoFocus>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
