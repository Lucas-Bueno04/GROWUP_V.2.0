package com.prometech.growupapi.controllers;

import com.prometech.growupapi.dto.IndicatorRequestDto;
import com.prometech.growupapi.dto.IndicatorResponseDto;
import com.prometech.growupapi.services.AdminIndicatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/indicator/admin-indicator")
public class AdminIndicatorController {

	@Autowired
	AdminIndicatorService adminIndicatorService;

	
	@PostMapping("/create")
	public ResponseEntity<Void> create(@RequestBody IndicatorRequestDto dto) {
		adminIndicatorService.create(dto);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@GetMapping()
	public ResponseEntity<List<IndicatorResponseDto>> getAll() {
		List<IndicatorResponseDto> list = adminIndicatorService.findAll();
		return ResponseEntity.ok(list);
	}
	
	@GetMapping("/by-id/{id}")
	public ResponseEntity<IndicatorResponseDto> getById(@PathVariable Long id) {
		return adminIndicatorService.findById(id)
				       .map(ResponseEntity::ok)
				       .orElse(ResponseEntity.notFound().build());
	}
	
	@DeleteMapping("/delete/by-id/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		adminIndicatorService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
