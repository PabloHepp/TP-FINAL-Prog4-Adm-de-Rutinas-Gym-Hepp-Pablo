// este archivo define el componente RutinaTable que muestra una lista de rutinas en tarjetas.
// Utiliza Material-UI para el diseño y estilo de las tarjetas.
// Cada tarjeta muestra el nombre, descripción, fecha de creación y ejercicios asociados a la rutina.
// Proporciona botones para editar y eliminar cada rutina.
// Acepta props para manejar las acciones de edición y eliminación desde el componente padre.

import { Rutina } from "@/types/rutina";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface RutinaTableProps {
  rutinas: Rutina[];
  onEdit?: (rutina: Rutina) => void;
  onDelete?: (rutina: Rutina) => void;
  onDuplicate?: (rutina: Rutina) => void;
  onSelect?: (rutina: Rutina) => void;
}

function RutinaTable({ rutinas, onEdit, onDelete, onDuplicate, onSelect }: RutinaTableProps) {
  if (!rutinas.length) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">No hay rutinas disponibles.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {rutinas.map((rutina) => (
        <Grid item key={rutina.id} xs={12} sm={6} lg={4}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              border: "1px solid rgba(146, 173, 196, 0.4)",
              boxShadow: "0 24px 38px rgba(2, 9, 18, 0.75)",
            }}
          >
            <CardHeader
              title={rutina.nombre}
              subheader={new Date(rutina.fecha_creacion).toLocaleDateString()}
              titleTypographyProps={{ sx: { letterSpacing: "0.08em", fontSize: "1.1rem" } }}
              subheaderTypographyProps={{ color: "text.secondary" }}
              action={
                <Stack direction="row" spacing={1}>
                  <IconButton aria-label="editar" onClick={() => onEdit?.(rutina)} color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="duplicar" onClick={() => onDuplicate?.(rutina)} color="primary">
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="eliminar" onClick={() => onDelete?.(rutina)} color="primary">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              }
            />
            <CardActionArea
              onClick={() => onSelect?.(rutina)}
              sx={{
                flexGrow: 1,
                textAlign: "left",
                alignItems: "stretch",
              }}
            >
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {rutina.descripcion || "Sin descripción"}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {rutina.ejercicios.map((ejercicio) => (
                    <Chip
                      key={`${rutina.id}-${ejercicio.orden}`}
                      label={`${ejercicio.nombre} (${ejercicio.dia_semana})`}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 0.5, fontSize: "0.75rem" }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default RutinaTable;
