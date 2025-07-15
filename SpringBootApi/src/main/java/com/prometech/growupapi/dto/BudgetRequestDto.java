package com.prometech.growupapi.dto;

import java.util.List;

public record BudgetRequestDto(
		Integer year,
		Long enterpriseId,
		String name,
		List<MonthBudgetDto> months
) {
}
