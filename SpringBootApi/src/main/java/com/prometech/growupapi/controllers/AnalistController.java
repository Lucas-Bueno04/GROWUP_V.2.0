package com.prometech.growupapi.controllers;


import com.prometech.growupapi.domain.Budget;
import com.prometech.growupapi.domain.Group;
import com.prometech.growupapi.dto.*;
import com.prometech.growupapi.services.AnalistService;
import com.prometech.growupapi.services.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
	
	
	@PostMapping("/group-sum/months/{id}")
	public List<GroupSumDto> calculateGroupSumByMonths(@PathVariable Long id, @RequestBody List<String> months) {
		
		BudgetDto budget = budgetService.getBudgetById(id);
		
		return analistService.calculateSumByMonths(budget, months);
	}
	
	@PostMapping("/account-sum/months/{id}")
	public List<AccountSumDto> calculateAccountSumByMonths(@PathVariable Long id, @RequestBody List<String> months) {
		BudgetDto budget = budgetService.getBudgetById(id);
		return analistService.calculateAccountSumByMonths(budget, months);
	}
	
	@PostMapping("/group-average/months/{id}")
	public List<GroupSumDto> calculateAverageGroupSumByMonths(@PathVariable Long id, @RequestBody List<String> months) {
		BudgetDto budget = budgetService.getBudgetById(id);
		return analistService.calculateAverageGroupSumByMonths(budget, months);
	}
	
	@PostMapping("/account-average/months/{id}")
	public List<AccountSumDto> calculateAverageAccountSumByMonths(@PathVariable Long id, @RequestBody List<String> months) {
		BudgetDto budget = budgetService.getBudgetById(id);
		return analistService.calculateAverageAccountSumByMonths(budget, months);
	}
	
	@PostMapping("/net-revenue/month/{id}")
	public NetRevenueDto calculateNetRevenue(@PathVariable Long id, @RequestBody String month) {
		BudgetDto budget = budgetService.getBudgetById(id);
		return analistService.calculateNetEarnings(budget, month);
	}
	
	@GetMapping("/net-revenue/budget/{id}")
	public List<NetRevenueByMonth> calculateNetRevenueByBudget(@PathVariable Long id) {
		return analistService.calculateNetRevenueByMonth(id);
	}
	@PostMapping("/formula/evaluate/{id}")
	public FormulaResultDto evaluateFormula(@PathVariable Long id, @RequestBody FormulaRequest request) {
		BudgetDto budget = budgetService.getBudgetById(id);
		return analistService.evaluateFormula(request.formula(), budget, request.months());
	}
	
	// DTO auxiliar para requests que usam BudgetDto + List<String>
	public record BudgetDtoWithMonths(BudgetDto budget, List<String> months) {}
	
	// DTO auxiliar para request de fórmula
	public record FormulaRequest(String formula, List<String> months) {}
}
