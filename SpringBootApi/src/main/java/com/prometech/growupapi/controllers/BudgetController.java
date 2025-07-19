package com.prometech.growupapi.controllers;

import com.prometech.growupapi.domain.*;
import com.prometech.growupapi.dto.*;

import com.prometech.growupapi.services.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
	
	@GetMapping("/by-id/{id}")
	public ResponseEntity<String> getBudgetNameById(@PathVariable Long id){
		BudgetDto budgetDto = budgetService.getBudgetById(id);
		
		return  ResponseEntity.ok(budgetDto.name());
		
	}
	
	@GetMapping("/by-email/{email}")
	public ResponseEntity<List<BudgetDto>> getByUserEmail(@PathVariable String email){
		List<BudgetDto> budgets =  budgetService.getAllBudgetsByUserEmail(email);
		
		return  ResponseEntity.ok(budgets);
	}

	@GetMapping("/by-email-id/{email}/{id}")
	public ResponseEntity<?> getBudgetById(@PathVariable String email, @PathVariable Long id) {
		
		BudgetDto budget = budgetService.getBudgetById(id);
		
		boolean hasAccess = budgetService.userHasAccessToBudget(budget.id(), email);
		
		if (hasAccess) {
			return ResponseEntity.ok(budget);
		} else {
			return ResponseEntity
					       .status(HttpStatus.FORBIDDEN)
					       .body("Usuário não tem acesso a esse orçamento");
		}
	}
	
	@DeleteMapping("delete/{id}")
	public ResponseEntity<Void> deleteById(@PathVariable Long id){
		budgetService.deleteBudget(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping("/update")
	public ResponseEntity<Void> update(@RequestBody BudgetDto budgetDto){
		budgetService.updateBudget(budgetDto);
		return  ResponseEntity.status(HttpStatus.OK).build();
	}
	
	@GetMapping("/filter-months")
	public  ResponseEntity<List<MonthBudget>> filterBudgetMonths(@RequestBody BudgetMonthFilteredRequest budgetMonthFilteredRequest){
		List<MonthBudget> filtered = budgetService.getFilteredMonthBudgets(budgetMonthFilteredRequest.budgetId(),budgetMonthFilteredRequest.months());
		return ResponseEntity.ok(filtered);
	}

	
}
