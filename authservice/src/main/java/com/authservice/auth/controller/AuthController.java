package com.authservice.auth.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.authservice.auth.model.User;
import com.authservice.auth.repository.UserRepository;
import com.authservice.auth.service.SignUpService;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SignUpService signUpService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        //Code by Namrata
        //updated by Mohsina
        if (!signUpService.validatePassword(user.getPassword())) {
            return ResponseEntity.badRequest().body("Password is invalid. It must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 6 characters long.");
        }
        //Code finishes
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("User already exists - please log in");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());

        if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.ok("User authenticated");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @GetMapping("/profile/{username}")
    public User profileUser(@PathVariable("username") String username) {
        System.out.println("Fetching user profile for username: " + username);
        User existingUser = userRepository.findByUsername(username);

        if (existingUser != null) {
            System.out.println("User profile found: " + existingUser.toString());
        } else {
            System.out.println("User profile not found for username: " + username);
        }
        return existingUser;
    }

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        
        if (userRepository.existsByUsername(user.getUsername())) {
            userRepository.save(user);
            return ResponseEntity.ok("User profile updated.");
        } else {
            return ResponseEntity.badRequest().body("User not found.");
        }
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());

        if (existingUser != null) {
            // Generate and send reset password token to the user's email
            // You can use a service to send an email with the reset token
            // For simplicity, let's assume we generate a token here and return it in the response
            String resetToken = generateResetToken(existingUser);
            return ResponseEntity.ok("Reset token generated: " + resetToken);
        } else {
            return ResponseEntity.badRequest().body("User not found.");
        }
    }

    // Method to generate a reset token (dummy implementation)
    private String generateResetToken(User user) {
        // Generate a random token or use some hashing algorithm with user details
        // For simplicity, let's assume we generate a random token here
        return UUID.randomUUID().toString();
    }
}
