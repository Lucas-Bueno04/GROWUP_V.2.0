package com.prometech.growupapi.dto;

import com.prometech.growupapi.domain.RoleName;

public record CreateUserDto(
		String name,
		String email,
		String password,
		RoleName role
) {
}
