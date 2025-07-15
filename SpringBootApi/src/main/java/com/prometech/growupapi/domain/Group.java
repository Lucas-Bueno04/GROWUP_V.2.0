package com.prometech.growupapi.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "`group`")
@Getter
@Setter
public class Group {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String cod;
	
	private String name;


	@OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("cod ASC")
	@JsonManagedReference
	private List<Account> accounts;
	
}
