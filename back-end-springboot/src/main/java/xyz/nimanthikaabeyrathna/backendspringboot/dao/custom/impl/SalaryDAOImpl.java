package xyz.nimanthikaabeyrathna.backendspringboot.dao.custom.impl;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import xyz.nimanthikaabeyrathna.backendspringboot.dao.custom.SalaryDAO;
import xyz.nimanthikaabeyrathna.backendspringboot.entity.Salary;

import java.util.List;
import java.util.Optional;

import static xyz.nimanthikaabeyrathna.backendspringboot.dao.util.Mappers.EMPLOYEE_ROW_MAPPER;
import static xyz.nimanthikaabeyrathna.backendspringboot.dao.util.Mappers.SALARY_ROW_MAPPER;

@Repository
public class SalaryDAOImpl implements SalaryDAO {
    private final JdbcTemplate jdbcTemplate;

    public SalaryDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public long count() throws Exception {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM salary", long.class);
    }

    @Override
    public Salary save(Salary entity) throws Exception {
        jdbcTemplate.update("INSERT INTO salary (id, employeeid, year, month, basicsalary, " +
                        "leave_allowed, leave_taken, no_pay_leave, normal_overtime_hours, special_overtime_hours, " +
                        "salary_increment, living_allowance, food_allowance, conveyance_allowance, " +
                        "medical_allowance, gross_salary, overtime, reimbursements, bonus, " +
                        "salary_before_deduction, no_pay_deduction, salary_advance, welfare_service, insurance, " +
                        "apit, epf_employee_contribution, total_deductions, net_payable_salary, " +
                        "epf_employer_contribution, etf_employer_contribution) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                entity.getId(),
                entity.getEmployeeID(),
                entity.getYear(),
                entity.getMonth(),
                entity.getBasicSalary(),
                entity.getLeaveAllowed(),
                entity.getLeaveTaken(),
                entity.getNoPayLeave(),
                entity.getNormalOverTimeHours(),
                entity.getSpecialOverTimeHours(),
                entity.getSalaryIncrement(),
                entity.getLivingAllowance(),
                entity.getFoodAllowance(),
                entity.getConveyanceAllowance(),
                entity.getMedicalAllowance(),
                entity.getGrossSalary(),
                entity.getOverTime(),
                entity.getReimbursements(),
                entity.getBonus(),
                entity.getSalaryBeforeDeduction(),
                entity.getNoPayDeduction(),
                entity.getSalaryAdvance(),
                entity.getWelfareService(),
                entity.getInsurance(),
                entity.getApit(),
                entity.getEpfEmployeeContribution(),
                entity.getTotalDeductions(),
                entity.getNetPayableSalary(),
                entity.getEpfEmployerContribution(),
                entity.getEtfEmployerContribution()
        );
        return entity;
    }

    @Override
    public void update(Salary entity) throws Exception {

        jdbcTemplate.update(
                "UPDATE salary SET employeeid=?, year=?, month=?, basicsalary=?, leave_allowed=?, " +
                        "leave_taken=?, no_pay_leave=?, normal_overtime_hours=?, special_overtime_hours=?, salary_increment=?, " +
                        "living_allowance=?, food_allowance=?, conveyance_allowance=?, medical_allowance=?, gross_salary=?, overtime=?, " +
                        "reimbursements=?, bonus=?, salary_before_deduction=?, no_pay_deduction=?, salary_advance=?, welfare_service=?, " +
                        "insurance=?, apit=?, epf_employee_contribution=?, total_deductions=?, net_payable_salary=?, " +
                        "epf_employer_contribution=?, etf_employer_contribution=? WHERE id=?",
                entity.getEmployeeID(),
                entity.getYear(),
                entity.getMonth(),
                entity.getBasicSalary(),
                entity.getLeaveAllowed(),
                entity.getLeaveTaken(),
                entity.getNoPayLeave(),
                entity.getNormalOverTimeHours(),
                entity.getSpecialOverTimeHours(),
                entity.getSalaryIncrement(),
                entity.getLivingAllowance(),
                entity.getFoodAllowance(),
                entity.getConveyanceAllowance(),
                entity.getMedicalAllowance(),
                entity.getGrossSalary(),
                entity.getOverTime(),
                entity.getReimbursements(),
                entity.getBonus(),
                entity.getSalaryBeforeDeduction(),
                entity.getNoPayDeduction(),
                entity.getSalaryAdvance(),
                entity.getWelfareService(),
                entity.getInsurance(),
                entity.getApit(),
                entity.getEpfEmployeeContribution(),
                entity.getTotalDeductions(),
                entity.getNetPayableSalary(),
                entity.getEpfEmployerContribution(),
                entity.getEtfEmployerContribution(),
                entity.getId()
        );

    }

    @Override
    public void deleteById(Integer pk) throws Exception {
        jdbcTemplate.update("DELETE FROM salary WHERE id=?", pk);
    }

    @Override
    public Optional<Salary> findById(Integer pk) throws Exception {

        try {
            return Optional.of(jdbcTemplate.queryForObject("SELECT * FROM salary WHERE id=?", SALARY_ROW_MAPPER, pk));
        } catch (DataAccessException exp) {
            return Optional.empty();
        }
    }

    @Override
    public List<Salary> findAll() throws Exception {

        return jdbcTemplate.query("SELECT * FROM salary", SALARY_ROW_MAPPER);
    }

    @Override
    public boolean existsById(Integer pk) throws Exception {

        return findById(pk).isPresent();
    }
}
