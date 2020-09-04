def calculate_total_cost_of_ticket(no_of_adults,no_of_childrens):
	total_cost_of_ticket = (37550* no_of_adults)+(((1/3)*37550)*no_of_childrens)
	total_cost_of_ticket = total_cost_of_ticket+((total_cost_of_ticket/100)*7)
	
	new=total_cost_of_ticket-((total_cost_of_ticket/100)*10) 
	return new 
result=calculate_total_cost_of_ticket(5,2)
print(result) #expected 204910.35

#obtained 204910.35000000003