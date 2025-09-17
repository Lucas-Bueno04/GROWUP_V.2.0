package com.prometech.growupapi.domain;


import jakarta.persistence.*;
		                           import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="enterprise_group")
@Getter
@Setter
public class EnterpriseGroup {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	
	@Column(nullable = false)
	private String name;
	
	@ManyToMany
	@JoinTable(
			name = "enterprise_group_members",
			joinColumns = @JoinColumn(name = "group_id"),
			inverseJoinColumns = @JoinColumn(name = "enterprise_id")
	)
	private Set<Enterprise> enterprises = new HashSet<>();
}
