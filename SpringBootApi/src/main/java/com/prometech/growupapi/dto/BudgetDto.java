package com.prometech.growupapi.dto;

import java.util.List;

public record BudgetDto(
		Long id,
		Integer year,
		Long enterpriseId,
		String name,
		List<MonthBudgetDto> months
) {
}
