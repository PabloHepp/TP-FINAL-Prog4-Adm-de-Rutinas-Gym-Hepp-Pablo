// este archivo define el componente Dashboard que muestra una lista de rutinas.
// Incluye filtros para buscar y filtrar rutinas por día de la semana.
// Utiliza hooks personalizados para obtener datos de rutinas desde la API.
// Maneja estados de carga, error y muestra los datos en una tabla.
// Proporciona una interfaz de usuario amigable con Material-UI.

import { Alert, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDeleteRutina, useRutinas } from "@/api/rutinas";
import RutinaFilters, { RutinaFiltersValue } from "@/components/RutinaFilters";
import RutinaTable from "@/components/RutinaTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Rutina } from "@/types/rutina";

const INITIAL_FILTERS: RutinaFiltersValue = {
  search: "",
  dia_semana: "",
};

function Dashboard() {
  const [filters, setFilters] = useState<RutinaFiltersValue>(INITIAL_FILTERS);
  const [rutinaToDelete, setRutinaToDelete] = useState<Rutina | null>(null);
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useRutinas(
    filters.search || undefined,
    filters.dia_semana || undefined
  );
  const { mutateAsync: deleteRutina, isPending: isDeleting } = useDeleteRutina();

  const handleDelete = async () => {
    if (!rutinaToDelete) return;
    try {
      await deleteRutina(rutinaToDelete.id);
      setRutinaToDelete(null);
    } catch {
      /* react-query maneja el error */
    }
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

      <RutinaFilters value={filters} onChange={setFilters} />

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
        <RutinaTable
          rutinas={data}
          onSelect={(rutina) => navigate(`/rutinas/${rutina.id}`)}
          onEdit={(rutina) => navigate(`/rutinas/${rutina.id}/editar`)}
          onDelete={(rutina) => setRutinaToDelete(rutina)}
        />
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
    </Stack>
  );
}

export default Dashboard;
