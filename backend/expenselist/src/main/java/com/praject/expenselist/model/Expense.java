package com.praject.expenselist.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;


import java.time.LocalDateTime;

@Entity // Indica que esta clase será una tabla en la base de datos.
public class Expense {
    @Id // Define la llave primaria.
    @GeneratedValue // Spring/JPA se encarga de autoincrementar el ID.
    private int id;

    @NotBlank // Solo para Strings: verifica que no sea null ni esté vacío ("").
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String name;

    @Size(max = 255, message = "La descripción no puede tener mas de 255 caracteres")
    private String description;

    /*
       DUDA RESUELTA: @NotBlank no sirve para números.
       Para 'double' o 'int' usamos @NotNull y validaciones de rango como @Positive.
    */
    @NotNull
    @Positive(message = "Debes añadir un precio positivo")
    private double price;

    /*
       DUDA RESUELTA: @Size es para colecciones o textos.
       Para valores numéricos usamos @Min y @Max.
    */
    @Min(value = 1, message = "La cantidad debe estar entre 1 y 100")
    @Max(value = 100, message = "La cantidad debe estar entre 1 y 100")
    private int quantity;

    private String category;
    private LocalDateTime creationDate;

    @ManyToOne
    @JoinColumn(name = "user_id") // Opcional: para que la columna se llame así en la DB
    private User user;


    // El constructor vacío es OBLIGATORIO para que JPA pueda crear la entidad.
    public Expense() {}

    // ... getters y setters ...

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

    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
}
