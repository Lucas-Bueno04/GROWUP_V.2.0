package com.prometech.growupapi.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "month_budget")
@Getter
@Setter
public class MonthBudget {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Enumerated(EnumType.STRING)
	private Month month;
	
	@ManyToOne()
	@JsonBackReference
	private Budget budget;
	
	@OneToMany(mappedBy = "monthBudget",  cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<AccountValue> values;
	
	
}
