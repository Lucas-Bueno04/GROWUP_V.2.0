package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.AccountValue;
import com.prometech.growupapi.domain.Budget;
import com.prometech.growupapi.domain.MonthBudget;
import com.prometech.growupapi.dto.AccountValueDto;
import com.prometech.growupapi.dto.BudgetDto;
import com.prometech.growupapi.dto.MonthBudgetDto;
import org.springframework.stereotype.Service;

@Service
public class BudgetMapperService {


	public static BudgetDto toDto(Budget budget) {
		return new BudgetDto(
				budget.getId(),
				budget.getYear(),
				budget.getEnterprise().getId(),
				budget.getName(),
				budget.getMonthBudgets().stream()
						.map(BudgetMapperService::toMonthDto)
						.toList()
		);
	}
	
	private static MonthBudgetDto toMonthDto(MonthBudget monthBudget) {
		return new MonthBudgetDto(
				monthBudget.getMonth().name(),
				monthBudget.getValues().stream()
						.map(BudgetMapperService::toAccountValueDto)
						.toList()
		);
	}
	
	private static AccountValueDto toAccountValueDto(AccountValue value) {
		return new AccountValueDto(
				value.getAccount().getId(),
				value.getValueType().name(),
				value.getValue()
		);
	}
}


