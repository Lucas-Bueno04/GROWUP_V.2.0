package com.prometech.growupapi.dto;

import java.time.LocalDate;

public record UserDto(
		Long id,
		String name,
		String email,
		String cpf,
		String phone,
		LocalDate birthDate
) {
}
