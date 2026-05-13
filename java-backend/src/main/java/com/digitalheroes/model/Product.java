package com.digitalheroes.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private double price;
    private double originalPrice;
    private String imageUrl;
    private String category;
    private double rating;
    private int reviews;
    private Date createdAt = new Date();
}
