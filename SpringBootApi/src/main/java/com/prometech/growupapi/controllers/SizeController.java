package com.prometech.growupapi.controllers;

import com.prometech.growupapi.dto.SizeDTO;
import com.prometech.growupapi.services.SizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/size")
public class SizeController {
	
	@Autowired
	private SizeService sizeService;
	
	@PostMapping
	public ResponseEntity<String> addSize(@RequestBody SizeDTO sizeDTO){
		sizeService.save(sizeDTO);
		return ResponseEntity.ok("Faixa de faturamento adicionada com sucesso!");
	}
	
	
	
	
}
