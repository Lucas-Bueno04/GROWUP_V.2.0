package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.*;
import com.prometech.growupapi.dto.BudgetDto;
import com.prometech.growupapi.dto.BudgetRequestDto;
import com.prometech.growupapi.dto.ResponseEnterpriseDto;
import com.prometech.growupapi.repositories.AccountRepository;
import com.prometech.growupapi.repositories.BudgetRepository;
import com.prometech.growupapi.repositories.EnterpriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BudgetService {

	@Autowired
	private BudgetRepository budgetRepository;
	
	@Autowired
	private EnterpriseRepository enterpriseRepository;
	
	@Autowired
	private AccountRepository accountRepository;
	
	@Autowired
	private BudgetMapperService budgetMapperService;
	
	@Autowired
	private EnterpriseUserService enterpriseUserService;
	
	@Autowired
	private EnterpriseService enterpriseService;
	
	public BudgetDto getBudgetById(Long id){
		Budget budget =  budgetRepository.findById(id)
				                .orElseThrow(() -> new RuntimeException("Erro ao buscar orçamento"));
		
		return BudgetMapperService.toDto(budget);
	}
	
	public boolean userHasAccessToBudget(Long budgetId, String userEmail) {
		List<Budget> userBudgets = budgetRepository.findByEnterpriseUserEmail(userEmail);
		return userBudgets.stream()
				       .anyMatch(budget -> budget.getId().equals(budgetId));
	}
	
	public List<BudgetDto> getAllBudgetsByUserEmail(String email){
	
		List<ResponseEnterpriseDto> enterprises = enterpriseUserService.getEnterpriseByUserEmail(email);
		
		List<Budget> budgets = enterprises.stream()
				                       .map(e->enterpriseService.getEnterpriseById(e.id()))
				                       .flatMap(ent->budgetRepository.findByEnterprise(ent).stream())
				                       .toList();
		
		return  budgets.stream()
				        .map(BudgetMapperService::toDto)
				        .collect(Collectors.toList());
	}
	
	@Transactional
	public void createBudget(BudgetRequestDto budgetDto){
		Enterprise enterprise = enterpriseRepository.findById(budgetDto.enterpriseId())
				                        .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
		
		Budget budget = new Budget();
		budget.setName(budgetDto.name());
		budget.setYear(budgetDto.year());
		budget.setEnterprise(enterprise);
		
		List<MonthBudget> monthBudgets = budgetDto.months().stream().map(monthDto -> {
			MonthBudget mb = new MonthBudget();
			mb.setMonth(Month.valueOf(monthDto.month()));
			mb.setBudget(budget);
			
			List<AccountValue> values = monthDto.values().stream().map(valueDto -> {
				Account account = accountRepository.findById(valueDto.accountId())
						                  .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
				
				AccountValue av = new AccountValue();
				av.setAccount(account);
				av.setValue(valueDto.value());
				av.setValueType(ValueType.valueOf(valueDto.valueType()));
				av.setMonthBudget(mb);
				return av;
			}).toList();
			mb.setValues(values);
			return mb;
		}).toList();
		
		budget.setMonthBudgets(monthBudgets);
		budgetRepository.save(budget);
	}
	
	
	public void updateBudget(BudgetDto budgetDto){
		
		Budget budget = budgetRepository.findById(budgetDto.id()).orElseThrow(()-> new RuntimeException("Erro ao buscar orçamento por id"));
		
		Enterprise enterprise = enterpriseRepository.findById(budgetDto.enterpriseId())
				                        .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
		
		budget.setName(budgetDto.name());
		budget.setYear(budgetDto.year());
		budget.setEnterprise(enterprise);
		
		List<MonthBudget> monthBudgets = budgetDto.months().stream().map(monthDto -> {
			MonthBudget mb = new MonthBudget();
			mb.setMonth(Month.valueOf(monthDto.month()));
			mb.setBudget(budget);
			
			List<AccountValue> values = monthDto.values().stream().map(valueDto -> {
				Account account = accountRepository.findById(valueDto.accountId())
						                  .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
				
				AccountValue av = new AccountValue();
				av.setAccount(account);
				av.setValue(valueDto.value());
				av.setValueType(ValueType.valueOf(valueDto.valueType()));
				av.setMonthBudget(mb);
				return av;
			}).toList();
			mb.setValues(values);
			return mb;
		}).toList();
		
		// Remove MonthBudgets that were removed in the update
		budget.getMonthBudgets().clear();
		budget.getMonthBudgets().addAll(monthBudgets);
		
		budgetRepository.save(budget);
	}
	
	@Transactional
	public void deleteBudget(Long id) {
		if (!budgetRepository.existsById(id)) {
			throw new RuntimeException("Orçamento não encontrado");
		}
		budgetRepository.deleteById(id);
	}

	public List<MonthBudget> getFilteredMonthBudgets(Long budgetId, List<Month> months) {
		Budget budget = budgetRepository.findById(budgetId)
				                .orElseThrow(() -> new RuntimeException("Budget not found"));
		
		return budget.getMonthBudgets().stream()
				       .filter(mb -> months.contains(mb.getMonth()))
				       .collect(Collectors.toList());
	}
}
