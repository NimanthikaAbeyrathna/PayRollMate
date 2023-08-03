package xyz.nimanthikaabeyrathna.backendspringboot.dao.util;

import org.springframework.jdbc.core.RowMapper;
import xyz.nimanthikaabeyrathna.backendspringboot.entity.Employee;
import xyz.nimanthikaabeyrathna.backendspringboot.entity.Salary;


public class Mappers {

    public static final RowMapper<Employee> EMPLOYEE_ROW_MAPPER = (rs, rowNum) -> {

        return new Employee(
                rs.getString("employee_id"),
                rs.getString("full_name"),
                rs.getString("id_no"),
                rs.getString("gender"),
                rs.getDate("dob"),
                rs.getString("address"),
                rs.getString("contact_number"),
                rs.getString("email"),
                rs.getString("department"),
                rs.getString("post"),
                rs.getString("epf_number"),
                rs.getBigDecimal("basic_salary"),
                rs.getString("bank_name"),
                rs.getString("branch_name"),
                rs.getLong("acc_number"),
                rs.getString("image_url")
        );
    };


    public static final RowMapper<Salary> SALARY_ROW_MAPPER = (rs, rowNum) -> {

        return new Salary(
                rs.getInt("id"),
                rs.getString("employeeid"),
                rs.getInt("year"),
                rs.getString("month"),
                rs.getBigDecimal("basicsalary"),
                rs.getBigDecimal("leave_allowed"),
                rs.getBigDecimal("leave_taken"),
                rs.getBigDecimal("no_pay_leave"),
                rs.getBigDecimal("normal_overtime_hours"),
                rs.getBigDecimal("special_overtime_hours"),
                rs.getBigDecimal("salary_increment"),
                rs.getBigDecimal("living_allowance"),
                rs.getBigDecimal("food_allowance"),
                rs.getBigDecimal("conveyance_allowance"),
                rs.getBigDecimal("medical_allowance"),
                rs.getBigDecimal("gross_salary"),
                rs.getBigDecimal("overtime"),
                rs.getBigDecimal("reimbursements"),
                rs.getBigDecimal("bonus"),
                rs.getBigDecimal("salary_before_deduction"),
                rs.getBigDecimal("no_pay_deduction"),
                rs.getBigDecimal("salary_advance"),
                rs.getBigDecimal("welfare_service"),
                rs.getBigDecimal("insurance"),
                rs.getBigDecimal("apit"),
                rs.getBigDecimal("epf_employee_contribution"),
                rs.getBigDecimal("total_deductions"),
                rs.getBigDecimal("net_payable_salary"),
                rs.getBigDecimal("epf_employer_contribution"),
                rs.getBigDecimal("etf_employer_contribution")
        );
    };

}
