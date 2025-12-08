// este archivo define un componente de formulario para crear o editar una rutina de ejercicios.
// Utiliza React Hook Form para manejar el estado del formulario y la validación.
// Emplea Material-UI para los elementos de la interfaz de usuario y el diseño.
// Permite agregar, editar y eliminar ejercicios asociados a la rutina.
// Acepta props para valores predeterminados, manejo de envío, cancelación y estado de envío.
// Proporciona una experiencia de usuario intuitiva para gestionar rutinas y sus ejercicios.

import { useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";

import { DiaSemana, RutinaCreatePayload } from "@/types/rutina";

export interface RutinaFormProps {
  defaultValues?: RutinaCreatePayload;
  onSubmit: (values: RutinaCreatePayload) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const DIA_OPTIONS: Array<{ label: string; value: DiaSemana }> = [
  { label: "Lunes", value: "lunes" },
  { label: "Martes", value: "martes" },
  { label: "Miércoles", value: "miercoles" },
  { label: "Jueves", value: "jueves" },
  { label: "Viernes", value: "viernes" },
  { label: "Sábado", value: "sabado" },
  { label: "Domingo", value: "domingo" },
];

const EMPTY_FORM: RutinaCreatePayload = {
  nombre: "",
  descripcion: "",
  ejercicios: [
    {
      nombre: "",
      dia_semana: "lunes",
      series: 3,
      repeticiones: 10,
      peso: 0,
      notas: "",
      orden: 1,
    },
  ],
};

function RutinaForm({ defaultValues = EMPTY_FORM, onSubmit, onCancel, isSubmitting }: RutinaFormProps) {
  const form = useForm<RutinaCreatePayload>({
    defaultValues,
    mode: "onBlur",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray<RutinaCreatePayload, "ejercicios">({
    control,
    name: "ejercicios",
  });

  const addEjercicio = () => {
    append({
      nombre: "",
      dia_semana: "lunes",
      series: 3,
      repeticiones: 10,
      peso: 0,
      notas: "",
      orden: fields.length + 1,
    });
  };

  return (
    <Card component="form" onSubmit={handleSubmit(onSubmit)}>
      <CardHeader title="Datos generales" subheader="Completá la información principal" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              fullWidth
              {...register("nombre", { required: "El nombre es obligatorio" })}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Descripción"
              fullWidth
              multiline
              minRows={2}
              {...register("descripcion")}
            />
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardHeader
        title="Ejercicios"
        subheader="Agregá o modificá los ejercicios"
        action={
          <Button type="button" startIcon={<AddCircleIcon />} onClick={addEjercicio}>
            Agregar
          </Button>
        }
      />
      <CardContent>
        <Stack spacing={3}>
          {fields.map((field, index) => (
            <Card key={field.id} variant="outlined">
              <CardHeader
                title={`Ejercicio ${index + 1}`}
                action={
                  fields.length > 1 && (
                    <IconButton onClick={() => remove(index)} aria-label="Eliminar">
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Nombre"
                      fullWidth
                      {...register(`ejercicios.${index}.nombre`, { required: "Campo obligatorio" })}
                      error={Boolean(errors.ejercicios?.[index]?.nombre)}
                      helperText={errors.ejercicios?.[index]?.nombre?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Día"
                      fullWidth
                      {...register(`ejercicios.${index}.dia_semana` as const, { required: true })}
                    >
                      {DIA_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Series"
                      type="number"
                      fullWidth
                      {...register(`ejercicios.${index}.series`, { valueAsNumber: true, min: 1 })}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Repeticiones"
                      type="number"
                      fullWidth
                      {...register(`ejercicios.${index}.repeticiones`, { valueAsNumber: true, min: 1 })}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Peso (kg)"
                      type="number"
                      fullWidth
                      {...register(`ejercicios.${index}.peso`, { valueAsNumber: true })}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Orden"
                      type="number"
                      fullWidth
                      {...register(`ejercicios.${index}.orden`, { valueAsNumber: true })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Notas"
                      fullWidth
                      multiline
                      minRows={2}
                      {...register(`ejercicios.${index}.notas`)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </CardContent>

      <Divider />

      <CardContent>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {onCancel && (
            <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Guardar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default RutinaForm;
