package com.prometech.growupapi.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "account_value")
@Getter
@Setter
public class AccountValue {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "account_id")
	@JsonBackReference
	private Account account;
	
	@ManyToOne()
	@JsonBackReference
	private MonthBudget monthBudget;
	
	@Enumerated(EnumType.STRING)
	private ValueType valueType;
	
	private BigDecimal value;

}
