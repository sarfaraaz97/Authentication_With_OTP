package org.example.springsecurity.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.example.springsecurity.model.Student;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class StudentController {

    List<Student> students=new ArrayList<>(List.of(
            new Student(1,"saffu","python"),
            new Student(2,"ayesha","java")
    ));
    @GetMapping("token")
    public CsrfToken getCsrfToken(HttpServletRequest request) {
        return (CsrfToken) request.getAttribute("_csrf");
    }
    @GetMapping("students")
    public List<Student> getStudents() {
        return students;
    }

    @PostMapping("add")
    public void addStudent(@RequestBody Student student) {
        students.add(student);
    }
}
