package com.prometech.growupapi.controllers;

import com.prometech.growupapi.dto.EnterpriseCreateDto;
import com.prometech.growupapi.dto.ResponseEnterpriseDto;
import com.prometech.growupapi.services.EnterpriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enterprise")
public class EnterpriseController {
	
	@Autowired
	private EnterpriseService enterpriseService;
	
	@PostMapping("/create")
	public ResponseEntity<ResponseEnterpriseDto> createEnterprise(@RequestBody EnterpriseCreateDto enterpriseCreateDto) {
		ResponseEnterpriseDto dto = enterpriseService.createEnterpise(enterpriseCreateDto);
		return ResponseEntity.ok(dto);
	}
	
	@GetMapping("/{email}")
	public ResponseEntity<List<ResponseEnterpriseDto>> getEnterprisesByUser(@PathVariable String email) {
		List<ResponseEnterpriseDto> enterprises = enterpriseService.getAllEntrisesByEmail(email);
		return ResponseEntity.ok(enterprises);
	}
	
	@GetMapping("/by-enterpriseId/{id}")
	public ResponseEntity<ResponseEnterpriseDto> getEnterpriseById(@PathVariable Long id) {
		ResponseEnterpriseDto enterprise = enterpriseService.getById(id);
		return ResponseEntity.ok(enterprise);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		enterpriseService.deleteById(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping("/update/{id}")
	public ResponseEntity<Void> updateById(@PathVariable Long id, @RequestBody ResponseEnterpriseDto responseEnterpriseDto){
		enterpriseService.updateEnterprise(id, responseEnterpriseDto);
		return ResponseEntity.noContent().build();
	}

}
