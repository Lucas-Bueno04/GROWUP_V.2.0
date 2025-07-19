package com.prometech.growupapi.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_indicators")
@Getter
@Setter
public class UserIndicator extends BaseIndicator {

	@ManyToOne(optional = false)
	@JoinColumn(name = "user_id")
	private User user;
}
