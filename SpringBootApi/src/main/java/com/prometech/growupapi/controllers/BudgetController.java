package com.prometech.growupapi.controllers;

import com.prometech.growupapi.domain.Budget;
import com.prometech.growupapi.dto.BudgetRequestDto;
import com.prometech.growupapi.repositories.BudgetRepository;
import com.prometech.growupapi.services.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/budget")
public class BudgetController {

	@Autowired
	private BudgetService budgetService;
	
	@PostMapping("/create")
	public ResponseEntity<Void> createBudget(@RequestBody BudgetRequestDto dto){
		budgetService.createBudget(dto);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
	
	@GetMapping("/by-email/{email}")
	public ResponseEntity<List<Budget>> getByUserEmail(@PathVariable String email){
		List<Budget> budgets =  budgetService.getAllBudgetsByUserEmail(email);
		
		return  ResponseEntity.ok(budgets);
	}
	
	@GetMapping("/by-id/{id}")
	public ResponseEntity<Budget> getBudgetById(@PathVariable Long id){
		Budget budget = budgetService.getBudgetById(id);
		
		return  ResponseEntity.ok(budget);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id){
		budgetService.deleteBudget(id);
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping("/update/{id}")
	public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody BudgetRequestDto budgetRequestDto){
		budgetService.updateBudget(id, budgetRequestDto);
		return  ResponseEntity.status(HttpStatus.OK).build();
	}
}
