# este archivo hace que app.models.rutina sea accesible desde app.models
# de esta manera, otros módulos pueden importar los modelos directamente desde app.models
# en lugar de tener que importar desde app.models.rutina
# esto es útil para mantener el código limpio y organizado
# además, facilita la gestión de los modelos cuando se trabaja con migraciones de base de datos 
# u otras operaciones que requieren acceso a todos los modelos
# simplemente importa los modelos que deseas exponer aquí
# luego, otros módulos pueden hacer:
# from app.models import Rutina, Ejercicio, DiaSemana
# en lugar de:
# from app.models.rutina import Rutina, Ejercicio, DiaSemana
# esto también ayuda a evitar problemas de importación circular en algunos casos
# al centralizar las importaciones de modelos en un solo archivo
# facilita la escalabilidad del proyecto a medida que se agregan más modelos en el futuro


from app.models.rutina import DiaSemana, Ejercicio, Rutina
from app.models.usuario import Usuario

__all__ = ["DiaSemana", "Ejercicio", "Rutina", "Usuario"]
