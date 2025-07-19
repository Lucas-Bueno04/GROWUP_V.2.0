package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.AdminIndicator;
import com.prometech.growupapi.domain.BaseIndicator;
import com.prometech.growupapi.domain.User;
import com.prometech.growupapi.domain.UserIndicator;
import com.prometech.growupapi.dto.IndicatorRequestDto;
import com.prometech.growupapi.dto.IndicatorResponseDto;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class IndicatorMapper {
	public AdminIndicator toAdminEntity(IndicatorRequestDto dto) {
		AdminIndicator indicator = new AdminIndicator();
		copyCommonFields(indicator, dto);
		return indicator;
	}
	
	public UserIndicator toUserEntity(IndicatorRequestDto dto, User user) {
		UserIndicator indicator = new UserIndicator();
		copyCommonFields(indicator, dto);
		indicator.setUser(user);
		return indicator;
	}
	
	public IndicatorResponseDto toDto(BaseIndicator indicator) {
		return new IndicatorResponseDto(
				String.valueOf(indicator.getId()),
				indicator.getCod(),
				indicator.getName(),
				indicator.getDescription(),
				indicator.getFormula(),
				indicator.getUnity(),
				indicator.getBetterWhen()
		);
	}
	
	private void copyCommonFields(BaseIndicator entity, IndicatorRequestDto dto) {
		entity.setCod(dto.cod());
		entity.setName(dto.name());
		entity.setDescription(dto.description());
		entity.setFormula(dto.formula());
		entity.setUnity(dto.unity());
		entity.setBetterWhen(dto.betterWhen());
	}
}
