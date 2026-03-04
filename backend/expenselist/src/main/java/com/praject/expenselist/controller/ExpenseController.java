package com.praject.expenselist.controller;

import com.praject.expenselist.dto.ExpenseRequestDTO;
import com.praject.expenselist.dto.ExpenseResponseDTO;

import com.praject.expenselist.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // DUDA RESUELTA: Combina @Controller y @ResponseBody para devolver JSON directamente.
@RequestMapping("/api/expenses") // Ruta base para todos los métodos de esta clase.
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<ExpenseResponseDTO> getExpenses() {
        return expenseService.readAllExpenses();
    }

    @PostMapping
    public ExpenseResponseDTO addExpense(@Valid @RequestBody ExpenseRequestDTO expense) {
        // @RequestBody le dice a Spring que busque el JSON en el cuerpo de la petición.
        return expenseService.createExpense(expense);
    }

    @DeleteMapping("/{id}") // El {id} es una variable dinámica en la URL.
    public void deleteExpense(@PathVariable Integer id) {
        // @PathVariable "atrapa" ese {id} de la URL y lo mete en el parámetro del method.
        expenseService.deleteExpense(id);
    }

    @PutMapping("/{id}")
    public ExpenseResponseDTO updateExpense(@PathVariable Integer id, @RequestBody ExpenseRequestDTO expense) {
        return expenseService.updateExpense(id, expense);
    }
}
