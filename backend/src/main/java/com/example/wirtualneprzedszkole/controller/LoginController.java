package com.example.wirtualneprzedszkole.controller;

import com.example.wirtualneprzedszkole.model.dto.LoginDto;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(exposedHeaders = {"authorization"})
@RestController
public class LoginController {

    @PostMapping("api/login")
    public void login(@RequestBody LoginDto loginDto) {
    }
}
