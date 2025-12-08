// este archivo define la página de detalles de una rutina específica en la aplicación.
// Utiliza React Router para obtener el ID de la rutina desde la URL.
// Emplea un hook personalizado para obtener los datos de la rutina desde la API.
// Muestra el nombre, descripción y lista de ejercicios asociados a la rutina.
// Proporciona botones para editar y eliminar la rutina.
// Maneja estados de carga y error durante la obtención de datos.

import { useState } from "react";

import { useDeleteRutina, useRutina } from "@/api/rutinas";
import { Chip, CircularProgress, Divider, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "@/components/common/ConfirmDialog";

function RutinaDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const rutinaId = Number(id);
  const { data, isLoading, isError, error, refetch } = useRutina(Number.isNaN(rutinaId) ? null : rutinaId);
  const { mutateAsync: deleteRutina, isPending: isDeleting } = useDeleteRutina();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!data) return;
    try {
      await deleteRutina(data.id);
      navigate("/");
    } catch {
      /* react-query manejará los errores */
    }
  };

  if (isLoading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    );
  }

  if (isError || !data) {
    return (
      <Stack spacing={2}>
        <Typography color="error">
          {error instanceof Error ? error.message : "No se pudo cargar la rutina."}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {data.nombre}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <IconButton color="primary" onClick={() => navigate(`/rutinas/${data.id}/editar`)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => setShowConfirm(true)} disabled={isDeleting}>
          <DeleteIcon />
        </IconButton>
      </Stack>
      <Typography color="text.secondary">{data.descripcion || "Sin descripción"}</Typography>
      <Divider />
      <Stack spacing={2}>
        <Typography variant="h6">Ejercicios</Typography>
        {data.ejercicios.map((ejercicio) => (
          <Stack key={ejercicio.id} spacing={1}>
            <Typography variant="subtitle1">{ejercicio.nombre}</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label={ejercicio.dia_semana} />
              <Chip label={`${ejercicio.series} x ${ejercicio.repeticiones}`} />
              <Chip label={`Peso: ${ejercicio.peso ?? 0} kg`} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {ejercicio.notas || "Sin notas"}
            </Typography>
            <Divider />
          </Stack>
        ))}
      </Stack>

      <ConfirmDialog
        open={showConfirm}
        title="Eliminar rutina"
        description="Esta acción eliminará la rutina y todos sus ejercicios. ¿Deseás continuar?"
        confirmLabel={isDeleting ? "Eliminando..." : "Eliminar"}
        destructive
        onConfirm={handleDelete}
        onClose={() => {
          if (!isDeleting) setShowConfirm(false);
        }}
      />
    </Stack>
  );
}

export default RutinaDetailPage;
