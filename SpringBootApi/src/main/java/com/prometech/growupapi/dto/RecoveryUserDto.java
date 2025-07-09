package com.prometech.growupapi.dto;

import com.prometech.growupapi.domain.Role;

import java.util.List;

public record RecoveryUserDto(
		Long id,
		String email,
		List<Role> roles
) {
}
