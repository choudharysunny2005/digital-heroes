package com.digitalheroes.controller;

import com.digitalheroes.model.Order;
import com.digitalheroes.model.Product;
import com.digitalheroes.repository.OrderRepository;
import com.digitalheroes.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api")
public class StoreController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        
        // Auto-seed database if empty (Enterprise Fallback)
        if (products.isEmpty()) {
            products = seedDatabase();
        }
        
        return products;
    }

    @PostMapping("/orders")
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        try {
            if (order == null) {
                return ResponseEntity.badRequest().body("Order payload is required.");
            }
            // Strictly typed payload enforces integrity before saving
            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process secured order.");
        }
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private List<Product> seedDatabase() {
        String[] specificCategories = {"Tech & Electronics", "Fashion & Lifestyle", "Home & Kitchen", "Automotive & Bikes"};
        String[] templates = {
            "Premium Wireless %s", "Advanced %s Pro", "Essential Daily %s", 
            "Ultra-Slim %s", "Heavy Duty %s"
        };
        String[] prefixes = {"Gadget", "Gear", "Device", "Apparel", "Tool", "Accessory"};
        
        Random random = new Random();
        List<Product> newProducts = new ArrayList<>();
        
        for (int i = 0; i < 240; i++) {
            Product p = new Product();
            String cat = specificCategories[random.nextInt(specificCategories.length)];
            String prefix = prefixes[random.nextInt(prefixes.length)];
            String template = templates[random.nextInt(templates.length)];
            
            p.setName(String.format(template, prefix));
            p.setCategory(cat);
            
            double basePrice = 500 + random.nextInt(45000);
            p.setOriginalPrice(basePrice + (basePrice * (0.1 + random.nextDouble() * 0.4)));
            p.setPrice(basePrice);
            p.setRating(3.5 + random.nextDouble() * 1.5);
            p.setReviews(10 + random.nextInt(1000));
            p.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80");
            
            newProducts.add(p);
        }
        
        return productRepository.saveAll(newProducts);
    }
}
