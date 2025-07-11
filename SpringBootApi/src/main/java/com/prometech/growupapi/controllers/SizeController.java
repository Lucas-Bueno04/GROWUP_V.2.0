package com.prometech.growupapi.controllers;

import com.prometech.growupapi.domain.Size;
import com.prometech.growupapi.dto.SizeDTO;
import com.prometech.growupapi.dto.SizeInvoicingRange;
import com.prometech.growupapi.services.SizeService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/size")
public class SizeController {

	@Autowired
	private SizeService sizeService;
	
	@PostMapping("/create")
	public ResponseEntity<Void> createSize(@RequestBody SizeDTO sizeDTO){
		sizeService.creteSize(sizeDTO);
		
		return  new ResponseEntity<>(HttpStatus.CREATED);
	}
	
	@GetMapping("/by-invoicing")
	public ResponseEntity<?> findByInvoicingRange(@RequestBody SizeInvoicingRange sizeInvoicingRange){
		try{
			Optional<Size> size = sizeService.findByInvoicing(sizeInvoicingRange);
			return ResponseEntity.ok(size);
		}catch (RuntimeException e){
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}
	
	@PutMapping("update/{id}")
	public ResponseEntity<?> updateSize(@PathVariable Long id, @RequestBody SizeDTO sizeDTO){
		try{
			sizeService.updateSize(id, sizeDTO);
			return ResponseEntity.ok().build();
		}catch (RuntimeException e){
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}
	
	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> deleteSize(@PathVariable Long id){
		try{
			sizeService.deleteSize(id);
			return ResponseEntity.noContent().build();
		}catch (RuntimeException e){
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@GetMapping
	public ResponseEntity<List<Size>> findAllSizes() {
		List<Size> sizes = sizeService.findAll();
		return ResponseEntity.ok(sizes);
	}
}
