package com.prometech.growupapi.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import javax.swing.text.html.Option;
import java.math.BigDecimal;

@Entity
@Table(name = "budgetEnterpriseAccount")
@Getter
@Setter
public class BudgetEnterpriseAccount {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(referencedColumnName = "id")
	private BudgetEnterprise budgetEnterprise;
	
	@ManyToOne(optional = false)
	@JoinColumn(referencedColumnName = "id")
	private Account account;
	
	@Column(nullable = false)
	private Integer month;

	@Column(nullable = false)
	private BigDecimal budgetedValue;
	
	@Column(nullable = false)
	private BigDecimal realizedValue;
	
}
