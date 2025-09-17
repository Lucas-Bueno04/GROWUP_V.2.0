package com.prometech.growupapi.controllers;

import com.prometech.growupapi.domain.EnterpriseUser;
import com.prometech.growupapi.dto.EnterpriseCreateDto;
import com.prometech.growupapi.dto.InsertEntepriseUserDto;
import com.prometech.growupapi.dto.ResponseEnterpriseDto;
import com.prometech.growupapi.services.EnterpriseService;
import com.prometech.growupapi.services.EnterpriseUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.chrono.IsoEra;
import java.util.List;

@RestController
@RequestMapping("/api/v1/enterprise")
public class EnterpriseController {
	
	@Autowired
	private EnterpriseService enterpriseService;
	
	@Autowired
	private EnterpriseUserService enterpriseUserService;
	
	@PostMapping("/create")
	public ResponseEntity<ResponseEnterpriseDto> createEnterprise(@RequestBody EnterpriseCreateDto enterpriseCreateDto) {
		ResponseEnterpriseDto dto = enterpriseService.createEnterpise(enterpriseCreateDto);
		
		InsertEntepriseUserDto insertEntepriseUserDto = new InsertEntepriseUserDto(
				dto.id(),
				enterpriseCreateDto.email()
		);
		enterpriseUserService.insertEnterpriseUser(insertEntepriseUserDto);
		return ResponseEntity.ok(dto);
	}
	
	@GetMapping("/{email}")
	public ResponseEntity<List<ResponseEnterpriseDto>> getEnterprisesByUser(@PathVariable String email) {
		List<ResponseEnterpriseDto> enterprises = enterpriseUserService.getEnterpriseByUserEmail(email);
		return ResponseEntity.ok(enterprises);
	}
	
	@GetMapping("/by-enterpriseId/{id}")
	public ResponseEntity<ResponseEnterpriseDto> getEnterpriseById(@PathVariable Long id) {
		ResponseEnterpriseDto enterprise = enterpriseService.getById(id);
		return ResponseEntity.ok(enterprise);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id) {
		enterpriseUserService.deleteAllByEnterpriseId(id);
		enterpriseService.deleteById(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping("/update/{id}")
	public ResponseEntity<Void> updateById(@PathVariable Long id, @RequestBody ResponseEnterpriseDto responseEnterpriseDto){
		enterpriseService.updateEnterprise(id, responseEnterpriseDto);
		return ResponseEntity.noContent().build();
	}

}
