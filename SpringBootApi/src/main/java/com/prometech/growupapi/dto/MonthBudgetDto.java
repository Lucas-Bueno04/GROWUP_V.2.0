package com.prometech.growupapi.dto;

import com.prometech.growupapi.domain.AccountValue;

import java.util.List;

public record MonthBudgetDto(
		String month,
		List<AccountValueDto> values
) {
}
