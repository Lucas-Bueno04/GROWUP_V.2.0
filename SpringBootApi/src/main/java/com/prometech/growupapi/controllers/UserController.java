package com.prometech.growupapi.controllers;

import com.prometech.growupapi.dto.CreateUserDto;
import com.prometech.growupapi.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users")
public class UserController {

	@Autowired
	private UserService userService;
	
	@PostMapping
	public ResponseEntity<Void> createUser(@RequestBody CreateUserDto createUserDto){
		userService.createUser(createUserDto);
		return  new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@GetMapping("/name")
	public ResponseEntity<String> getUserNameByEmail(@RequestParam String email){
		try {
			String name = userService.getNameByEmail(email);
			return ResponseEntity.ok(name);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}
	
	@GetMapping("/test")
	public ResponseEntity<String> test(){
		return ResponseEntity.status(HttpStatus.OK).body("TESTE DE AUTENTICAÇÃO CONCLUIDO COM SUCESSO");
	}
	
	
}
