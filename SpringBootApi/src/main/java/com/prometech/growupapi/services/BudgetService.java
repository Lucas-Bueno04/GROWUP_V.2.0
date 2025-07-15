package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.*;
import com.prometech.growupapi.dto.AccountValueDto;
import com.prometech.growupapi.dto.BudgetRequestDto;
import com.prometech.growupapi.repositories.AccountRepository;
import com.prometech.growupapi.repositories.BudgetRepository;
import com.prometech.growupapi.repositories.EnterpriseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {
	
	@Autowired
	private BudgetRepository budgetRepository;
	
	@Autowired
	private EnterpriseRepository enterpriseRepository;
	
	@Autowired
	private AccountRepository accountRepository;
	
	public Budget getBudgetById(Long id){
		return budgetRepository.findById(id).orElseThrow(()->new RuntimeException("Erro ao buscar orçamento"));
		
	}
	public List<Budget> getAllBudgetsByUserEmail(String email){
		return budgetRepository.findByEnterpriseUserEmail(email);
	}
	
	public void createBudget(BudgetRequestDto budgetRequestDto){
		Enterprise enterprise = enterpriseRepository.findById(budgetRequestDto.enterpriseId()).orElseThrow(()->new RuntimeException("Empresa não encontrada"));
		
		Budget budget = new Budget();
		
		budget.setYear(budgetRequestDto.year());
		budget.setEnterprise(enterprise);
		
		List<MonthBudget> monthBudgets = budgetRequestDto.months().stream().map(monthDto->{
			MonthBudget mb = new MonthBudget();
			mb.setMonth(Month.valueOf(monthDto.month()));
			mb.setBudget(budget);
			
			List<AccountValue> values = monthDto.values().stream().map(valueDto->{
				Account account = accountRepository.findById(valueDto.accountId()).orElseThrow(()->new RuntimeException("Conta não encontrada"));
				
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
	
	public void updateBudget(Long id, BudgetRequestDto budgetRequestDto){
		Budget budget = budgetRepository.findById(id).orElseThrow(()->new RuntimeException("Erro ao buscar orçamento por id"));
		
		budget.setYear(budgetRequestDto.year());
		Enterprise enterprise = enterpriseRepository.findById(budgetRequestDto.enterpriseId())
				                        .orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
		budget.setEnterprise(enterprise);
		
		budget.getMonthBudgets().clear();
		List<MonthBudget> monthBudgets = budgetRequestDto.months().stream().map(monthDto -> {
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

	public void deleteBudget(Long id) {
		if (!budgetRepository.existsById(id)) {
			throw new RuntimeException("Orçamento não encontrado");
		}
		budgetRepository.deleteById(id);
	}
}
