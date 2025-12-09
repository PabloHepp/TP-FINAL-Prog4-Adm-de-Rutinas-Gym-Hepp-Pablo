// este archivo define el componente Dashboard que muestra una lista de rutinas.
// Incluye filtros para buscar y filtrar rutinas por día de la semana.
// Utiliza hooks personalizados para obtener datos de rutinas desde la API.
// Maneja estados de carga, error y muestra los datos en una tabla.
// Proporciona una interfaz de usuario amigable con Material-UI.

import { Alert, Button, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDeleteRutina, useDuplicateRutina, useRutinas } from "@/api/rutinas";
import RutinaFilters, { RutinaFiltersValue } from "@/components/RutinaFilters";
import RutinaTable from "@/components/RutinaTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Rutina } from "@/types/rutina";

const INITIAL_FILTERS: RutinaFiltersValue = {
  search: "",
  dia_semana: "",
};

const PAGE_SIZE = 9;

function Dashboard() {
  const [filters, setFilters] = useState<RutinaFiltersValue>(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [rutinaToDelete, setRutinaToDelete] = useState<Rutina | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [rutinaToDuplicate, setRutinaToDuplicate] = useState<Rutina | null>(null);
  const [duplicateName, setDuplicateName] = useState("");
  const [duplicateError, setDuplicateError] = useState<string | undefined>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, isError, error, refetch } = useRutinas({
    search: filters.search || undefined,
    dia_semana: filters.dia_semana || undefined,
    page,
    page_size: PAGE_SIZE,
  });
  const { mutateAsync: deleteRutina, isPending: isDeleting } = useDeleteRutina();
  const { mutateAsync: duplicateRutina, isPending: isDuplicating } = useDuplicateRutina();

  useEffect(() => {
    const feedback = (location.state as { feedback?: string } | null)?.feedback;
    if (feedback) {
      setSnackbar({ open: true, message: feedback, severity: "success" });
      navigate(".", { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (!data) return;
    if (data.total_pages === 0 && page !== 1) {
      setPage(1);
      return;
    }
    if (data.total_pages > 0 && page > data.total_pages) {
      setPage(data.total_pages);
    }
  }, [data, page]);

  const handleDelete = async () => {
    if (!rutinaToDelete) return;
    try {
      await deleteRutina(rutinaToDelete.id);
      setRutinaToDelete(null);
      setSnackbar({ open: true, message: "Rutina eliminada correctamente.", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : "No se pudo eliminar la rutina.",
        severity: "error",
      });
    }
  };

  const handleStartDuplicate = (rutina: Rutina) => {
    setRutinaToDuplicate(rutina);
    setDuplicateName(`${rutina.nombre} (copia)`);
    setDuplicateError(undefined);
  };

  const handleDuplicate = async () => {
    if (!rutinaToDuplicate) return;
    if (!duplicateName.trim()) {
      setDuplicateError("Ingresá un nombre válido.");
      return;
    }
    try {
      const nueva = await duplicateRutina({ id: rutinaToDuplicate.id, payload: { nuevo_nombre: duplicateName.trim() } });
      setRutinaToDuplicate(null);
      setSnackbar({ open: true, message: "Rutina duplicada correctamente.", severity: "success" });
      setDuplicateName("");
      setDuplicateError(undefined);
      navigate(`/rutinas/${nueva.id}`);
    } catch (err) {
      setDuplicateError(err instanceof Error ? err.message : "No se pudo duplicar la rutina.");
    }
  };

  const handleSnackbarClose = (_?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleFiltersChange = (nextFilters: RutinaFiltersValue) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const rutinas = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 0;
  const hasResults = rutinas.length > 0;
  const showingStart = hasResults ? (page - 1) * PAGE_SIZE + 1 : 0;
  const showingEnd = hasResults ? showingStart + rutinas.length - 1 : 0;
  const canGoPrev = page > 1;
  const canGoNext = totalPages > 0 ? page < totalPages : false;

  const handlePrevPage = () => {
    if (canGoPrev) setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    if (canGoNext) setPage((prev) => prev + 1);
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
        <div>
          <Typography variant="h4" component="h1">
            Rutinas
          </Typography>
          <Typography color="text.secondary">Gestioná tus planes de entrenamiento.</Typography>
        </div>
        <Button variant="contained" color="secondary" onClick={() => navigate("/rutinas/nueva")}>
          Nueva rutina
        </Button>
      </Stack>

      <RutinaFilters value={filters} onChange={handleFiltersChange} />

      {isLoading && (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      )}

      {isError && (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Reintentar</Button>}>
          {error instanceof Error ? error.message : "Error al cargar las rutinas."}
        </Alert>
      )}

      {!isLoading && !isError && data && (
        <Stack spacing={2}>
          <RutinaTable
            rutinas={rutinas}
            onSelect={(rutina) => navigate(`/rutinas/${rutina.id}`)}
            onEdit={(rutina) => navigate(`/rutinas/${rutina.id}/editar`)}
            onDelete={(rutina) => setRutinaToDelete(rutina)}
            onDuplicate={handleStartDuplicate}
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Typography variant="body2" color="text.secondary">
              {hasResults
                ? `Mostrando ${showingStart}-${showingEnd} de ${total} rutinas`
                : total === 0
                  ? "No se encontraron rutinas para los filtros seleccionados."
                  : `Mostrando 0 de ${total} rutinas`}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
              <Button variant="outlined" onClick={handlePrevPage} disabled={!canGoPrev}>
                Anterior
              </Button>
              <Button variant="outlined" onClick={handleNextPage} disabled={!canGoNext}>
                Siguiente
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 120, textAlign: "center", alignSelf: "center" }}
              >
                Página {Math.min(page, Math.max(totalPages, 1))} de {Math.max(totalPages, 1)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}

      <ConfirmDialog
        open={Boolean(rutinaToDelete)}
        title="Eliminar rutina"
        description={`¿Seguro que querés eliminar "${rutinaToDelete?.nombre ?? ""}"? Esta acción no se puede deshacer.`}
        confirmLabel={isDeleting ? "Eliminando..." : "Eliminar"}
        destructive
        onConfirm={handleDelete}
        onClose={() => {
          if (!isDeleting) setRutinaToDelete(null);
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert variant="filled" severity={snackbar.severity} onClose={handleSnackbarClose} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ConfirmDialog
        open={Boolean(rutinaToDuplicate)}
        title="Duplicar rutina"
        description="Ingresá un nuevo nombre para la rutina duplicada."
        confirmLabel={isDuplicating ? "Duplicando..." : "Duplicar"}
        onConfirm={handleDuplicate}
        onClose={() => {
          if (!isDuplicating) {
            setRutinaToDuplicate(null);
            setDuplicateName("");
            setDuplicateError(undefined);
          }
        }}
        textFieldLabel="Nuevo nombre"
        textFieldValue={duplicateName}
        textFieldPlaceholder="Ej. Rutina fuerza (copia)"
        textFieldRequired
        textFieldError={duplicateError}
        onTextFieldChange={(value) => {
          setDuplicateName(value);
          if (duplicateError) setDuplicateError(undefined);
        }}
      />
    </Stack>
  );
}

export default Dashboard;
