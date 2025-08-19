package org.example.springsecurity.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Homecontroller {

    @GetMapping("/home")
    public String home(HttpServletRequest request) {
        return "home";
    }
    @GetMapping("/about")
    public String about(HttpServletRequest request) {
        return "about"+request.getSession().getId();
    }
}
