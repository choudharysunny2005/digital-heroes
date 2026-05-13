package com.digitalheroes.model;

import lombok.Data;

@Data
public class OrderItem {
    private String productId;
    private String name;
    private double price;
    private String imageUrl;
    private int quantity;
}
