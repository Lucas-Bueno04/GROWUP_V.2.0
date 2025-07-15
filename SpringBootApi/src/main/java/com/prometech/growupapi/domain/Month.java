package com.prometech.growupapi.domain;

import lombok.Getter;

@Getter
public enum Month {
	
	JANEIRO(1),
	FEVEREIRO(2),
	MARCO(3),
	ABRIL(4),
	MAIO(5),
	JUNHO(6),
	JULHO(7),
	AGOSTO(8),
	SETEMBRO(9),
	OUTUBRO(10),
	NOVEMBRO(11),
	DEZEMBRO(12);
	
	private final int number;
	
	Month(int number) {
		this.number = number;
	}
	
	// Para converter de inteiro para enum
	public static Month fromNumber(int number) {
		for (Month mes : Month.values()) {
			if (mes.number == number) {
				return mes;
			}
		}
		throw new IllegalArgumentException("Número inválido para mês: " + number);
	}
}
