package com.prometech.growupapi.dto;

import java.util.List;

public record BudgetRequestDto(
		Integer year,
		Long enterpriseId,
		List<MonthBudgetDto> months
) {
}
