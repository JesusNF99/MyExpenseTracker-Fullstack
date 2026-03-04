package com.praject.expenselist.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // Esta anotación convierte a la clase en el "Gerente" que escucha errores de TODOS los controladores.
public class GlobalExceptionHandler {

    /*
       DUDA RESUELTA: ¿Cómo capturar mi propio error?
       Usamos @ExceptionHandler con la clase específica.
       Esto evita que el servidor responda con un error 500 (Error interno).
    */
    @ExceptionHandler(ExpenseNotFoundException.class)
    public ResponseEntity<String> handleExpenseNotFoundException(ExpenseNotFoundException ex){
        // Usamos ResponseEntity para controlar el código HTTP (404) y el mensaje.
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    /*
       DUDA RESUELTA: ¿Cómo limpiar los errores de validación (@Valid)?
       Spring lanza MethodArgumentNotValidException cuando fallan las reglas de la Entidad.
    */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // Recorremos la lista técnica de errores de Spring.
        ex.getBindingResult().getFieldErrors().forEach((error) -> {
            // error.getField() nos da el nombre de la variable (ej: "name").
            // error.getDefaultMessage() nos da el texto que pusimos en la Entidad.
            errors.put(error.getField(), error.getDefaultMessage());
        });

        // Devolvemos un 400 (Bad Request) con el mapa que Spring convertirá en JSON.
        return ResponseEntity.status(400).body(errors);
    }
}
