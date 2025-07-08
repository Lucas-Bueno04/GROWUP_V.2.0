package com.prometech.growupapi.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "budgetEnterprise")
@Getter
@Setter
public class BudgetEnterprise {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(optional = false)
	@JoinColumn(referencedColumnName = "id")
	private Enterprise enterprise;
	
	@Column(nullable = false)
	private Integer year;
	
	@Column(nullable = false)
	private String name;
	
	private String description;
}
