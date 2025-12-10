// este archivo define el componente RutinaFilters que proporciona filtros para buscar y filtrar rutinas.
// Incluye un campo de búsqueda por nombre y un selector para filtrar por día de la semana.
// Utiliza Material-UI para los elementos de formulario y el diseño.
// Acepta props para el valor actual de los filtros y una función para manejar cambios.
// Facilita la interacción del usuario para refinar la lista de rutinas mostradas.
// Proporciona una experiencia de usuario intuitiva para la gestión de rutinas.
// Permite la reutilización del componente en diferentes partes de la aplicación.

import { DiaSemana } from "@/types/rutina";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";

export interface RutinaFiltersValue {
  search: string;
  dia_semana: DiaSemana | "";
}

interface RutinaFiltersProps {
  value: RutinaFiltersValue;
  onChange: (next: RutinaFiltersValue) => void;
}

const DIAS_OPTIONS: Array<{ label: string; value: DiaSemana }> = [
  { label: "Lunes", value: "lunes" },
  { label: "Martes", value: "martes" },
  { label: "Miércoles", value: "miercoles" },
  { label: "Jueves", value: "jueves" },
  { label: "Viernes", value: "viernes" },
  { label: "Sábado", value: "sabado" },
  { label: "Domingo", value: "domingo" },
];

function RutinaFilters({ value, onChange }: RutinaFiltersProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, search: event.target.value });
  };

  const handleDiaChange = (event: SelectChangeEvent) => {
    onChange({ ...value, dia_semana: event.target.value as DiaSemana | "" });
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems="stretch"
      sx={{
        background: "rgba(15, 24, 38, 0.8)",
        border: "1px solid rgba(146, 173, 196, 0.35)",
        borderRadius: 3,
        boxShadow: "0 18px 32px rgba(3, 8, 15, 0.65)",
        p: { xs: 2, sm: 3 },
      }}
    >
      <TextField
        label="Buscar rutina"
        placeholder="Nombre"
        value={value.search}
        onChange={handleSearchChange}
        fullWidth
      />
      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel id="dia-semana-label">Día</InputLabel>
        <Select
          labelId="dia-semana-label"
          label="Día"
          value={value.dia_semana}
          onChange={handleDiaChange}
        >
          <MenuItem value="">Todos</MenuItem>
          {DIAS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

export default RutinaFilters;
