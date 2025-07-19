package com.prometech.growupapi.dto;

import java.math.BigDecimal;

public record GroupSumDto(
		Long groupId,
		String groupCod,
		String groupName,
		BigDecimal budgeted,
		BigDecimal carried
) {
}
