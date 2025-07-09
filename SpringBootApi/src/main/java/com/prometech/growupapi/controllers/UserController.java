package com.prometech.growupapi.controllers;

import com.prometech.growupapi.dto.CreateUserDto;
import com.prometech.growupapi.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserService userService;
	
	@PostMapping
	public ResponseEntity<Void> createUser(@RequestBody CreateUserDto createUserDto){
		userService.createUser(createUserDto);
		return  new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	
}
