package com.authservice.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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
        // Validating email address
        if (!signUpService.validateEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email address is invalid. Please check and try again.");
        }
        // Validating date of birth
        if (!signUpService.validateDob(user.getDob())) {
            return ResponseEntity.badRequest().body("Date of birth is invalid. Please make sure it is in the format of DD/MM/YYYY and try again.");
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
            // Validating email address
            if (!signUpService.validateEmail(user.getEmail())) {
                return ResponseEntity.badRequest().body("Email address is invalid. Please check and try again.");
            }
            // Validating date of birth
            if (!signUpService.validateDob(user.getDob())) {
                return ResponseEntity.badRequest().body("Date of birth is invalid. Please make sure it is in the format of DD/MM/YYYY and try again.");
            }
            return ResponseEntity.ok("User profile updated.");
        } else {
            return ResponseEntity.badRequest().body("User not found.");
        }
    }
}
