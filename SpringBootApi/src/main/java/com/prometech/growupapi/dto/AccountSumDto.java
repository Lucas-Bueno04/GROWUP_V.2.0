package com.prometech.growupapi.dto;

import java.math.BigDecimal;

public record AccountSumDto(
		Long accountId,
		String accountCod,
		String accountName,
		Long groupId,
		String groupCod,
		String groupName,
		BigDecimal budgeted,
		BigDecimal carried
) {
}
