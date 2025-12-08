// este archivo define la página para editar una rutina específica en la aplicación.
// Utiliza React Router para obtener el ID de la rutina desde la URL.
// Emplea un hook personalizado para obtener los datos actuales de la rutina desde la API.
// Mapea los datos obtenidos al formato esperado por el formulario de edición.
// Utiliza un componente de formulario reutilizable para mostrar y manejar la edición de la rutina.
// Proporciona manejo de estados de carga, error y envío del formulario.
// Incluye navegación para volver a la página anterior o a la vista de detalles de la rutina tras la edición.
// Muestra mensajes de error si la carga o actualización de la rutina falla.
// Importa los tipos necesarios para las rutinas y sus cargas útiles.


import { Alert, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate, useParams } from "react-router-dom";

import { useRutina, useUpdateRutina } from "@/api/rutinas";
import RutinaForm from "@/components/forms/RutinaForm";
import { Rutina, RutinaCreatePayload } from "@/types/rutina";

function mapRutinaToPayload(rutina: Rutina): RutinaCreatePayload {
  return {
    nombre: rutina.nombre,
    descripcion: rutina.descripcion ?? "",
    ejercicios: [...rutina.ejercicios]
      .sort((a, b) => a.orden - b.orden)
      .map((ejercicio) => ({
        nombre: ejercicio.nombre,
        dia_semana: ejercicio.dia_semana,
        series: ejercicio.series,
        repeticiones: ejercicio.repeticiones,
        peso: ejercicio.peso ?? 0,
        notas: ejercicio.notas ?? "",
        orden: ejercicio.orden,
      })),
  };
}

function RutinaEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const rutinaId = Number(id);

  if (Number.isNaN(rutinaId)) {
    return (
      <Stack spacing={2}>
        <Typography color="error">El identificador de la rutina no es válido.</Typography>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Stack>
    );
  }

  const { data, isLoading, isError, error, refetch } = useRutina(rutinaId);
  const { mutateAsync, isPending, error: mutationError } = useUpdateRutina(rutinaId);

  const handleSubmit = async (values: RutinaCreatePayload) => {
    try {
      await mutateAsync(values);
      navigate(`/rutinas/${rutinaId}`);
    } catch {
      // El error se muestra mediante mutationError
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

  const initialValues = mapRutinaToPayload(data);

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <div>
          <Typography variant="h4" component="h1">
            Editar rutina
          </Typography>
          <Typography color="text.secondary">Actualizá los datos y guardá los cambios.</Typography>
        </div>
      </Stack>

      {mutationError && (
        <Alert severity="error">
          {mutationError instanceof Error ? mutationError.message : "No se pudo actualizar la rutina."}
        </Alert>
      )}

      <RutinaForm
        key={data.id}
        defaultValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        isSubmitting={isPending}
      />
    </Stack>
  );
}

export default RutinaEditPage;
