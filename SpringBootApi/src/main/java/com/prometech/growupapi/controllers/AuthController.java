package com.prometech.growupapi.controllers;

import com.prometech.growupapi.domain.User;
import com.prometech.growupapi.dto.LoginDTO;
import com.prometech.growupapi.dto.UserDTO;
import com.prometech.growupapi.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.BatchUpdateException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	@Autowired
	private UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody UserDTO user){
		userService.save(user);
		return  ResponseEntity.ok("Usuario registrado com sucesso!");
	}
	
	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO){
		boolean authenticated = userService.authenticate(loginDTO.email, loginDTO.password);
		
		if(authenticated){
			return ResponseEntity.ok("Login realizado com sucesso!");
		}else{
			return  ResponseEntity.status(401).body("Usuario não encontrado!");
		}
	}
	
	
	
}
