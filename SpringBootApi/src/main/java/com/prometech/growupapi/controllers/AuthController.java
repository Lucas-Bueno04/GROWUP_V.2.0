package com.prometech.growupapi.controllers;

import com.prometech.growupapi.dto.LoginUserDto;
import com.prometech.growupapi.dto.RecoveryJwtTokenDto;
import com.prometech.growupapi.security.JwtTokenService;
import com.prometech.growupapi.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private JwtTokenService jwtTokenService;
	
	@PostMapping
	public ResponseEntity<RecoveryJwtTokenDto> authenticateUser(@RequestBody LoginUserDto loginUserDto){
		RecoveryJwtTokenDto token = userService.authenticateUser(loginUserDto);
		return new ResponseEntity<>(token, HttpStatus.OK);
		
	}
	
	@PostMapping("/validate")
	public ResponseEntity<Boolean> validateToken(@RequestBody RecoveryJwtTokenDto tokenDTO){
		boolean isValid = jwtTokenService.isTokenValido(tokenDTO.token());
		
		return ResponseEntity.ok(isValid);
	}

	
}
