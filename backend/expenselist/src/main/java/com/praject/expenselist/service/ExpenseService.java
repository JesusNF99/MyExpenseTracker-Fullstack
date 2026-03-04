package com.praject.expenselist.service;


import com.praject.expenselist.dto.ExpenseRequestDTO;
import com.praject.expenselist.dto.ExpenseResponseDTO;
import com.praject.expenselist.exception.ExpenseNotFoundException;
import com.praject.expenselist.model.Expense;
import com.praject.expenselist.model.User;
import com.praject.expenselist.repository.ExpenseRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    /*
       DUDA RESUELTA: Asignación automática de dueño.
       El cliente no nos envía quién es el dueño del gasto;
       nosotros lo "atrapamos" del sistema para evitar que alguien
       cree gastos a nombre de otros usuarios.
    */
    public ExpenseResponseDTO createExpense(ExpenseRequestDTO dto){
        Expense expense = new Expense();
        expense.setName(dto.getName());
        expense.setPrice(dto.getPrice());
        expense.setQuantity(dto.getQuantity());
        expense.setCategory(dto.getCategory());
        expense.setDescription(dto.getDescription());
        expense.setUser(getCurrentUser());
        expense.setCreationDate(java.time.LocalDateTime.now());

        return new ExpenseResponseDTO(expenseRepository.save(expense));
    }

    public List<ExpenseResponseDTO> readAllExpenses() {
        User currentUser = getCurrentUser();
        // Usamos el method personalizado que creamos en el Repository
        List<Expense> expenses = expenseRepository.findByUser(currentUser);
        return expenses.stream()
                .map(ExpenseResponseDTO::new)
                .toList();
    }

    public void deleteExpense(int id){
        User currentUser = getCurrentUser();

        // 1. Buscamos el gasto real en la base de datos
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException("Gasto no encontrado"));

        /*
           DUDA RESUELTA: Validación de Propiedad.
           Incluso si el gasto existe, verificamos si el ID del dueño coincide
           con el ID de quien está intentando borrarlo.
        */
        if(expense.getUser().getId() != currentUser.getId()){
            throw new RuntimeException("No tienes permiso para eliminar este gasto.");
        }

        expenseRepository.deleteById(id);
    }

    public ExpenseResponseDTO updateExpense(int id, ExpenseRequestDTO expenseJson){
        // 1. Buscamos el objeto "Real" (de la BD)
        Expense dbExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException("Gasto no encontrado"));

        User currentUser = getCurrentUser();

        /*
           DUDA RESUELTA: Objeto DB vs Objeto JSON.
           Comparamos el dueño guardado en la base de datos, porque el objeto
           que viene del JSON (expenseJson) suele tener el campo user a null.
        */
        if (dbExpense.getUser().getId() != currentUser.getId()) {
            throw new RuntimeException("No tienes permiso para actualizar este gasto.");
        }

        // 2. Solo actualizamos los campos que el usuario puede cambiar
        dbExpense.setCategory(expenseJson.getCategory());
        dbExpense.setDescription(expenseJson.getDescription());
        dbExpense.setName(expenseJson.getName());
        dbExpense.setPrice(expenseJson.getPrice());
        dbExpense.setQuantity(expenseJson.getQuantity());

        // 3. Guardamos el objeto de la BD, que ya tiene su dueño e ID correcto
        Expense savedExpense = expenseRepository.save(dbExpense);
        return new ExpenseResponseDTO(savedExpense);
    }

    /*
       DUDA RESUELTA: Method de apoyo.
       Centralizamos el acceso a la Seguridad. Si mañana cambiamos el sistema
       de login, solo tenemos que cambiar este method privado.
    */
    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
