package com.prometech.growupapi.controllers;


import com.prometech.growupapi.domain.Budget;
import com.prometech.growupapi.domain.Group;
import com.prometech.growupapi.dto.*;
import com.prometech.growupapi.services.AnalistService;
import com.prometech.growupapi.services.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analist")
public class AnalistController {
	
	@Autowired
	private AnalistService analistService;
	
	@Autowired
	private BudgetService budgetService;
	
	@GetMapping("/test")
	public ResponseEntity<FormulaResultDto>  test(){
		
		Long mockId = 11L;
		
		BudgetDto budget = budgetService.getBudgetById(mockId);
		
		List<String > months = List.of("JANEIRO","FEVEREIRO","MARCO");
		
		FormulaResultDto result = analistService.evaluateFormula("G_1-G_2", budget, months);
		
		return ResponseEntity.ok(result);
	}
}
