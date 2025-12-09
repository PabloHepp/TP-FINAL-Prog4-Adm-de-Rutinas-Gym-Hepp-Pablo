// este archivo define la página para crear una nueva rutina en la aplicación.
// Utiliza un componente de formulario reutilizable para manejar la entrada de datos.
// Emplea un hook personalizado para enviar los datos de la nueva rutina a la API.
// Proporciona navegación para volver a la página anterior o ir a la vista de detalles tras la creación.

import { Alert, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import { useCreateRutina } from "@/api/rutinas";
import RutinaForm from "@/components/forms/RutinaForm";
import { RutinaCreatePayload } from "@/types/rutina";

function RutinaCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useCreateRutina();

  const handleSubmit = async (values: RutinaCreatePayload) => {
    try {
      const rutina = await mutateAsync(values);
      navigate(`/rutinas/${rutina.id}`);
    } catch {
      // El error ya se muestra mediante el estado del mutation
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <div>
          <Typography variant="h4" component="h1">
            Nueva rutina
          </Typography>
          <Typography color="text.secondary">Completá los datos para registrar un nuevo plan.</Typography>
        </div>
      </Stack>

      {error && (
        <Alert severity="error">
          {error instanceof Error ? error.message : "No se pudo crear la rutina."}
        </Alert>
      )}

      <RutinaForm onSubmit={handleSubmit} onCancel={() => navigate(-1)} isSubmitting={isPending} />
    </Stack>
  );
}

export default RutinaCreatePage;
