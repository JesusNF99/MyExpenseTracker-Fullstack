package com.praject.expenselist.repository;

import com.praject.expenselist.model.Expense;
import com.praject.expenselist.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// No necesita @Repository porque JpaRepository ya lo gestiona internamente.
// El secreto aquí es que Spring "crea la implementación" por ti en tiempo de ejecución.
public interface ExpenseRepository extends JpaRepository<Expense, Integer> {
    // Al heredar de JpaRepository, ya tienes métodos como save(), deleteById(), etc.


    List<Expense> findByUser(User user);
    // No lleva { body } porque Spring lo implementa por ti.
    // Al llamarlo "findBy" + "User" (que es el atributo de tu clase Expense),
    // Spring entiende: "SELECT * FROM expenses WHERE user_id = ?"


}
