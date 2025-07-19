package com.prometech.growupapi.dto;

import com.prometech.growupapi.domain.Month;

import java.util.List;

public record BudgetMonthFilteredRequest (
		Long budgetId,
		List<Month> months
){
}
