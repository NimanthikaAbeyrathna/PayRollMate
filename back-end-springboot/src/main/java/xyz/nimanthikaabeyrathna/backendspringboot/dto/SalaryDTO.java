package xyz.nimanthikaabeyrathna.backendspringboot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalaryDTO implements Serializable {

    private int id;

    @NotBlank(message = "Employee ID cannot be blank.")
    private String employeeID;

    @Positive(message = "Year must be a positive number.")
    private int year;

    @NotBlank(message = "Month cannot be blank.")
    private String month;

    @NotNull(message = "Basic salary cannot be null.")
    private BigDecimal basicSalary;

    @NotNull(message = "Leave allowed cannot be null.")
    private BigDecimal leaveAllowed;

    @NotNull(message = "Leave taken cannot be null.")
    private BigDecimal leaveTaken;


    private BigDecimal noPayLeave;


    private BigDecimal normalOverTimeHours;


    private BigDecimal specialOverTimeHours;


    private BigDecimal salaryIncrement;


    private BigDecimal livingAllowance;


    private BigDecimal foodAllowance;


    private BigDecimal conveyanceAllowance;


    private BigDecimal medicalAllowance;

    @NotNull(message = "gross salary cannot be null.")
    private BigDecimal grossSalary;


    private BigDecimal overTime;


    private BigDecimal reimbursements;


    private BigDecimal bonus;

    @NotNull(message = "salary before deduction cannot be null.")
    private BigDecimal salaryBeforeDeduction;


    private BigDecimal noPayDeduction;


    private BigDecimal salaryAdvance;


    private BigDecimal welfareService;


    private BigDecimal insurance;


    private BigDecimal apit;


    private BigDecimal epfEmployeeContribution;

    @NotNull(message = "total deduction cannot be null.")
    private BigDecimal totalDeductions;

    @NotNull(message = "net payable salary cannot be null.")
    private BigDecimal netPayableSalary;


    private BigDecimal epfEmployerContribution;


    private BigDecimal etfEmployerContribution;

}
