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
  Grid2 as Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface RutinaTableProps {
  rutinas: Rutina[];
  onEdit?: (rutina: Rutina) => void;
  onDelete?: (rutina: Rutina) => void;
  onSelect?: (rutina: Rutina) => void;
}

function RutinaTable({ rutinas, onEdit, onDelete, onSelect }: RutinaTableProps) {
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
        <Grid key={rutina.id} xs={12} sm={6} lg={4}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardHeader
              title={rutina.nombre}
              subheader={new Date(rutina.fecha_creacion).toLocaleDateString()}
              action={
                <Stack direction="row" spacing={1}>
                  <IconButton aria-label="editar" onClick={() => onEdit?.(rutina)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="eliminar" onClick={() => onDelete?.(rutina)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              }
            />
            <CardActionArea onClick={() => onSelect?.(rutina)} sx={{ flexGrow: 1, textAlign: "left" }}>
              <CardContent>
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
