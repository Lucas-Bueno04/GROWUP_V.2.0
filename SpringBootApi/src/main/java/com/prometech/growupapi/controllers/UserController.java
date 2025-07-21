package com.prometech.growupapi.controllers;

import com.prometech.growupapi.dto.CreateUserDto;
import com.prometech.growupapi.dto.UserDto;
import com.prometech.growupapi.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
	
	@GetMapping("/by-email/{email}")
	
	public  ResponseEntity<?> getUserByEmail (@PathVariable String email){
		try {
			UserDto user = userService.getUserByEmail(email);
			return ResponseEntity.ok(user);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@PutMapping("/update")
	public ResponseEntity<?> updateUser(@RequestBody UserDto userDto) {
		try {
			UserDto updatedUser = userService.updateUser(userDto);
			return ResponseEntity.ok(updatedUser);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}
	
	// ✅ Atualizar senha pelo email
	@PutMapping("/update-password")
	public ResponseEntity<?> updatePassword(@RequestParam String email, @RequestParam String newPassword) {
		try {
			userService.updatePasswordByEmail(email, newPassword);
			return ResponseEntity.ok("Senha atualizada com sucesso");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}


	@GetMapping("/all")
	public ResponseEntity<List<UserDto>> getAllUsers() {
		List<UserDto> users = userService.getAllUsers();
		return ResponseEntity.ok(users);
	}
	
	@DeleteMapping("/delete/{email}")

	public  ResponseEntity<?> deleteByEmail(@PathVariable String email){
		userService.delete(email);
		return  ResponseEntity.noContent().build();
	}
	
	
}
