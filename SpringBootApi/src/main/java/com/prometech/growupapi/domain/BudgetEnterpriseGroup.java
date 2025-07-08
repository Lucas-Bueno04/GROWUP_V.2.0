package com.prometech.growupapi.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "budgetEnterpriseGroup")
@Getter
@Setter
public class BudgetEnterpriseGroup {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(optional = false)
	@JoinColumn(referencedColumnName = "id")
	private BudgetEnterprise budgetEnterprise;
	
	@ManyToOne(optional = false)
	@JoinColumn(referencedColumnName = "id")
	private Group group;
	
	@Column(nullable = false)
	private Integer month;
	
	@Column(nullable = false)
	private BigDecimal budgetedValue;
	
	@Column(nullable = false)
	private BigDecimal realizedValue;
	
	
}
