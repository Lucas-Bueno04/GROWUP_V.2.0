package com.prometech.growupapi.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "budget")
@Getter
@Setter
public class Budget {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private Integer year;
	
	private String name;

	@ManyToOne
	@JsonBackReference
	private Enterprise enterprise;
	
	@OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference
	private List<MonthBudget> monthBudgets;
	
	
}
