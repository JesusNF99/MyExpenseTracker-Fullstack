package com.praject.expenselist.dto;

import com.praject.expenselist.model.Expense;

import java.time.LocalDateTime;

public class ExpenseResponseDTO {
    private int id;
    private String name;
    private String description;
    private double price;
    private int quantity;
    private String category;
    private LocalDateTime creationDate;
    private String username; // <--- Solo el nombre, nada de passwords.

    // Constructor, Getters y Setters
    public ExpenseResponseDTO(Expense expense) {
        this.id = expense.getId();
        this.name = expense.getName();
        this.description = expense.getDescription();
        this.price = expense.getPrice();
        this.quantity = expense.getQuantity();
        this.category = expense.getCategory();
        this.creationDate = expense.getCreationDate();
        this.username = expense.getUser().getUsername();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
