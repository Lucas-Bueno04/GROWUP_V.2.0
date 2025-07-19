package com.prometech.growupapi.controllers;

import com.prometech.growupapi.dto.IndicatorRequestDto;
import com.prometech.growupapi.dto.IndicatorResponseDto;
import com.prometech.growupapi.services.UserIndicatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/indicator/user-indicator")
public class UserIndicatorController {
	
	@Autowired
	UserIndicatorService userIndicatorService;
	

	@PostMapping("/create/{email}")
	public ResponseEntity<Void> create(@PathVariable String email, @RequestBody IndicatorRequestDto dto) {
		userIndicatorService.create(email, dto);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@GetMapping("/by-user-email/{email}")
	public ResponseEntity<List<IndicatorResponseDto>> getAllByUser(@PathVariable String email) {
		List<IndicatorResponseDto> list = userIndicatorService.findByUserId(email);
		return ResponseEntity.ok(list);
	}
	
	@GetMapping("/by-id/{id}")
	public ResponseEntity<IndicatorResponseDto> getById(@PathVariable Long id) {
		return userIndicatorService.findById(id)
				       .map(ResponseEntity::ok)
				       .orElse(ResponseEntity.notFound().build());
	}
	
	@DeleteMapping("/delete/by-id/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		userIndicatorService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
