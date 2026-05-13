package com.digitalheroes.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Date;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private List<OrderItem> items;
    private double totalAmount;
    private Customer customer;
    private Date createdAt = new Date();
}
