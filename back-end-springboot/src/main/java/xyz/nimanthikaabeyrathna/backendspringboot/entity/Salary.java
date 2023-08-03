package xyz.nimanthikaabeyrathna.backendspringboot.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Salary implements SuperEntity{

    private int id;
    private String employeeID;
    private int year;
    private String month;
    private BigDecimal basicSalary;
    private BigDecimal leaveAllowed;
    private BigDecimal leaveTaken;
    private BigDecimal noPayLeave;
    private BigDecimal normalOverTimeHours;
    private BigDecimal specialOverTimeHours;
    private BigDecimal salaryIncrement;
    private BigDecimal livingAllowance;
    private BigDecimal foodAllowance;
    private BigDecimal conveyanceAllowance;
    private BigDecimal medicalAllowance;
    private BigDecimal grossSalary;
    private BigDecimal overTime;
    private BigDecimal reimbursements;
    private BigDecimal bonus;
    private BigDecimal salaryBeforeDeduction;
    private BigDecimal noPayDeduction;
    private BigDecimal salaryAdvance;
    private BigDecimal welfareService;
    private BigDecimal insurance;
    private BigDecimal apit;
    private BigDecimal epfEmployeeContribution;
    private BigDecimal totalDeductions;
    private BigDecimal netPayableSalary;
    private BigDecimal epfEmployerContribution;
    private BigDecimal etfEmployerContribution;

}
