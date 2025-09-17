package com.prometech.growupapi.controllers;

import com.prometech.growupapi.dto.InsertEntepriseUserDto;
import com.prometech.growupapi.services.EnterpriseUserService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/enterprise_user")
public class EnterpriseUserController {
	
	@Autowired
	private EnterpriseUserService enterpriseUserService;
	
	@PostMapping("/create")
	public ResponseEntity<Void> createEnterpriseUser(@RequestBody InsertEntepriseUserDto dto){
		enterpriseUserService.insertEnterpriseUser(dto);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
	@DeleteMapping("/delete")
	public ResponseEntity<Void> deleteEnterpriseUserByUserEmail(@RequestBody InsertEntepriseUserDto dto){
		enterpriseUserService.deleteByEmailAndEnterpriseId(dto.emailUser(), dto.idEnterprise());
		return  ResponseEntity.status(HttpStatus.OK).build();
	}
	
}
