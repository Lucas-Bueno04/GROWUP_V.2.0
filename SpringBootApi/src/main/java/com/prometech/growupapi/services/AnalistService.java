package com.prometech.growupapi.services;

import com.prometech.growupapi.domain.*;
import com.prometech.growupapi.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import net.objecthunter.exp4j.Expression;
import net.objecthunter.exp4j.ExpressionBuilder;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AnalistService {

	@Autowired
	GroupService groupService;
	
	@Autowired
	BudgetService budgetService;
	
	@Autowired
	AccountService accountService;
	
	public List<GroupSumDto> calculateSumByMonth(BudgetDto budget , String month){
	
		Map<Group, Map<String, BigDecimal>> sumByGroup = new HashMap<>();
		
		
		for (MonthBudgetDto monthBudgetDto: budget.months()){
			
			if(!monthBudgetDto.month().equals(month)) continue;
			
			for (AccountValueDto accountValueDto : monthBudgetDto.values()){
				Account account = accountService.getById(accountValueDto.accountId());
				Group group = account.getGroup();
				BigDecimal value = accountValueDto.value();
				String  type = accountValueDto.valueType();
				
				sumByGroup.computeIfAbsent(group,g-> new HashMap<>());
				
				Map<String, BigDecimal> totalByType = sumByGroup.get(group);
				totalByType.put(type, totalByType.getOrDefault(type, BigDecimal.ZERO).add(value));
			}
		}
		
		return sumByGroup.entrySet().stream()
				                         .map(entry -> {
					                         Group group = entry.getKey();
					                         Map<String, BigDecimal> values = entry.getValue();
					                         return new GroupSumDto(
							                         group.getId(),
							                         group.getCod(),
							                         group.getName(),
							                         values.getOrDefault("BUDGETED", BigDecimal.ZERO),
							                         values.getOrDefault("CARRIED", BigDecimal.ZERO)
					                         );
				                         })
				                         .toList();
	}

	
	public List<AccountSumDto> calculateAccountSumByMonth(BudgetDto budget, String month) {
		Map<Account, Map<String, BigDecimal>> sumByAccount = new HashMap<>();
		
		for (MonthBudgetDto monthBudgetDto : budget.months()) {
			if (!monthBudgetDto.month().equalsIgnoreCase(month)) continue;
			
			for (AccountValueDto accountValueDto : monthBudgetDto.values()) {
				Account account = accountService.getById(accountValueDto.accountId());
				BigDecimal value = accountValueDto.value();
				String type = accountValueDto.valueType();
				
				sumByAccount
						.computeIfAbsent(account, a -> new HashMap<>())
						.merge(type, value, BigDecimal::add);
			}
		}
		
		return sumByAccount.entrySet().stream()
				       .map(entry -> {
					       Account account = entry.getKey();
					       Map<String, BigDecimal> values = entry.getValue();
					       Group group = account.getGroup();
					       
					       return new AccountSumDto(
							       account.getId(),
							       account.getCod(),
							       account.getName(),
							       group.getId(),
							       group.getCod(),
							       group.getName(),
							       values.getOrDefault("BUDGETED", BigDecimal.ZERO),
							       values.getOrDefault("CARRIED", BigDecimal.ZERO)
					       );
				       })
				       .toList();
	}
	
	
	
	public List<GroupSumDto> calculateSumByMonths(BudgetDto budget, List<String> months) {
		// Mapeia por groupId os totais acumulados
		Map<Long, GroupSumDto> acumulateByGroup = new HashMap<>();
		
		for (String mes : months) {
			List<GroupSumDto> somaDoMes = calculateSumByMonth(budget, mes);
			
			for (GroupSumDto dto : somaDoMes) {
				acumulateByGroup.merge(dto.groupId(), dto,
						(existente, novoDto) -> new GroupSumDto(
								existente.groupId(),
								existente.groupCod(),
								existente.groupName(),
								existente.budgeted().add(novoDto.budgeted()),
								existente.carried().add(novoDto.carried())
						)
				);
			}
		}
		
		// Retorna os valores acumulados como lista
		return new ArrayList<>(acumulateByGroup.values());
	}

	public List<AccountSumDto> calculateAccountSumByMonths(BudgetDto budget, List<String> months) {
		Map<Account, Map<String, BigDecimal>> sumByAccount = new HashMap<>();
		
		for (MonthBudgetDto monthBudgetDto : budget.months()) {
			if (!months.contains(monthBudgetDto.month())) continue;
			
			for (AccountValueDto accountValueDto : monthBudgetDto.values()) {
				Account account = accountService.getById(accountValueDto.accountId());
				Group group = account.getGroup();
				BigDecimal value = accountValueDto.value();
				String type = accountValueDto.valueType();
				
				sumByAccount
						.computeIfAbsent(account, a -> new HashMap<>())
						.merge(type, value, BigDecimal::add);
			}
		}
		
		return sumByAccount.entrySet().stream()
				       .map(entry -> {
					       Account account = entry.getKey();
					       Group group = account.getGroup();
					       Map<String, BigDecimal> values = entry.getValue();
					       
					       return new AccountSumDto(
							       account.getId(),
							       account.getCod(),
							       account.getName(),
							       group.getId(),
							       group.getCod(),
							       group.getName(),
							       values.getOrDefault("BUDGETED", BigDecimal.ZERO),
							       values.getOrDefault("CARRIED", BigDecimal.ZERO)
					       );
				       })
				       .toList();
	}

	public List<GroupSumDto> calculateAverageGroupSumByMonths(BudgetDto budget, List<String> months) {
		Map<Group, BigDecimal> totalBudgetedByGroup = new HashMap<>();
		Map<Group, BigDecimal> totalCarriedByGroup = new HashMap<>();
		
		for (String month : months) {
			List<GroupSumDto> monthlySums = calculateSumByMonth(budget, month);
			
			for (GroupSumDto dto : monthlySums) {
				Group group = groupService.getById(dto.groupId());
				
				totalBudgetedByGroup.merge(group, dto.budgeted(), BigDecimal::add);
				totalCarriedByGroup.merge(group, dto.carried(), BigDecimal::add);
			}
		}
		
		int divisor = months.size();
		
		return totalBudgetedByGroup.keySet().stream()
				       .map(group -> {
					       BigDecimal totalBudgeted = totalBudgetedByGroup.getOrDefault(group, BigDecimal.ZERO);
					       BigDecimal totalCarried = totalCarriedByGroup.getOrDefault(group, BigDecimal.ZERO);
					       
					       return new GroupSumDto(
							       group.getId(),
							       group.getCod(),
							       group.getName(),
							       totalBudgeted.divide(BigDecimal.valueOf(divisor), 2, RoundingMode.HALF_UP),
							       totalCarried.divide(BigDecimal.valueOf(divisor), 2, RoundingMode.HALF_UP)
					       );
				       })
				       .toList();
	}

	public List<AccountSumDto> calculateAverageAccountSumByMonths(BudgetDto budget, List<String> months) {
		// Mapa para armazenar totais acumulados por conta (usando o ID como chave)
		Map<Long, AccountSumDto> totalByAccount = new HashMap<>();
		
		// Acumula as somas mensais por conta
		List<AccountSumDto> totalSums = calculateAccountSumByMonths(budget, months);
		for (AccountSumDto dto : totalSums) {
			totalByAccount.merge(dto.accountId(), dto, (a, b) -> new AccountSumDto(
					a.accountId(),
					a.accountCod(),
					a.accountName(),
					a.groupId(),
					a.groupCod(),
					a.groupName(),
					a.budgeted().add(b.budgeted()),
					a.carried().add(b.carried())
			));
		}
		
		int divisor = months.size();
		
		// Divide os totais acumulados pelo número de meses
		return totalByAccount.values().stream()
				       .map(dto -> new AccountSumDto(
						       dto.accountId(),
						       dto.accountCod(),
						       dto.accountName(),
						       dto.groupId(),
						       dto.groupCod(),
						       dto.groupName(),
						       dto.budgeted().divide(BigDecimal.valueOf(divisor), 2, RoundingMode.HALF_UP),
						       dto.carried().divide(BigDecimal.valueOf(divisor), 2, RoundingMode.HALF_UP)
				       ))
				       .toList();
	}


	
	public NetRevenueDto calculateNetEarnings(BudgetDto budgetDto, String month){
				List<GroupSumDto> groups = this.calculateSumByMonth(budgetDto, month);
				
				BigDecimal grossIncome = groups.stream()
						                         .filter(g->g.groupCod().trim().equals("1"))
						                         .map(GroupSumDto::budgeted)
						                         .reduce(BigDecimal.ZERO, BigDecimal::add);
				
				BigDecimal deductions = groups.stream()
						                        .filter(g->g.groupCod().trim().equals("2"))
						                        .map(GroupSumDto::budgeted)
						                        .reduce(BigDecimal.ZERO, BigDecimal::add);
				
				BigDecimal netIncomeBudgeted = grossIncome.subtract(deductions);
				
				BigDecimal grossIncomeCarried = groups.stream()
						                         .filter(g->g.groupCod().trim().equals("1"))
						                         .map(GroupSumDto::carried)
						                         .reduce(BigDecimal.ZERO, BigDecimal::add);
				
				BigDecimal deductionsCarried = groups.stream()
						                        .filter(g->g.groupCod().trim().equals("2"))
						                        .map(GroupSumDto::carried)
						                        .reduce(BigDecimal.ZERO, BigDecimal::add);
				
				BigDecimal netIncomeCarried = grossIncome.subtract(deductions);
				
		
				
				return  new NetRevenueDto(netIncomeBudgeted, netIncomeCarried);
				
				
		}
	
	public List<NetRevenueByMonth> calculateNetRevenueByMonth(Long budgetId){
		
		BudgetDto budgetDto = budgetService.getBudgetById(budgetId);
		
		return budgetDto.months().stream()
				       .map(monthBudgetDto->{
						   String month = monthBudgetDto.month();
						   NetRevenueDto netRevenue = calculateNetEarnings(budgetDto, month);
						   return  new NetRevenueByMonth(month, netRevenue);
				       }).collect(Collectors.toList());
	}


	private BigDecimal evaluateMathExpression(String expression) {
		try {
			Expression e = new ExpressionBuilder(expression).build();
			double result = e.evaluate();
			return BigDecimal.valueOf(result);
		} catch (Exception ex) {
			throw new RuntimeException("Erro ao avaliar fórmula: " + expression, ex);
		}
	}
	public FormulaResultDto evaluateFormula(String formula, BudgetDto budget, List<String> months) {
		Map<String, BigDecimal> budgetedValues = new HashMap<>();
		Map<String, BigDecimal> carriedValues = new HashMap<>();
		
		// 1. Extrair identificadores G_ e C_ usando regex
		Pattern pattern = Pattern.compile("(G_\\d+|C_\\d+\\.\\d+)");
		Matcher matcher = pattern.matcher(formula);
		Set<String> identifiers = new HashSet<>();
		
		while (matcher.find()) {
			identifiers.add(matcher.group());
		}
		
		// 2. Calcular médias para cada identificador
		for (String id : identifiers) {
			if (id.startsWith("G_")) {
				String cod = id.substring(2).trim();
				var medias = calculateAverageGroupSumByMonths(budget, months).stream()
						             .filter(g -> g.groupCod().trim().equals(cod))
						             .findFirst().orElse(new GroupSumDto(null, cod, "", BigDecimal.ZERO, BigDecimal.ZERO));
				
				budgetedValues.put(id, medias.budgeted());
				carriedValues.put(id, medias.carried());
			} else if (id.startsWith("C_")) {
				String cod = id.substring(2).trim();
				var medias = calculateAverageAccountSumByMonths(budget, months).stream()
						             .filter(c -> c.accountCod().trim().equals(cod))
						             .findFirst().orElse(new AccountSumDto(null, cod, "", null, "", "", BigDecimal.ZERO, BigDecimal.ZERO));
				
				budgetedValues.put(id, medias.budgeted());
				carriedValues.put(id, medias.carried());
			}
		}
		
		// 3. Substituir identificadores na fórmula
		String budgetedFormula = formula;
		String carriedFormula = formula;
		
		for (String id : identifiers) {
			budgetedFormula = budgetedFormula.replace(id, budgetedValues.get(id).toPlainString());
			carriedFormula = carriedFormula.replace(id, carriedValues.get(id).toPlainString());
		}
		
		// 4. Avaliar expressões (usando javax.script ou uma lib tipo exp4j)
		BigDecimal budgetedResult = evaluateMathExpression(budgetedFormula);
		BigDecimal carriedResult = evaluateMathExpression(carriedFormula);
		
		return new FormulaResultDto(budgetedResult, carriedResult);
	}
	
}
