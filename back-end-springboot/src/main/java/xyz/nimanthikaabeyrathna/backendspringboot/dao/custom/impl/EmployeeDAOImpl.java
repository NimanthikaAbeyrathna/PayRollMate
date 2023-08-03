package xyz.nimanthikaabeyrathna.backendspringboot.dao.custom.impl;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import xyz.nimanthikaabeyrathna.backendspringboot.dao.custom.EmployeeDAO;
import xyz.nimanthikaabeyrathna.backendspringboot.entity.Employee;

import java.awt.print.Book;
import java.util.List;
import java.util.Optional;

import static xyz.nimanthikaabeyrathna.backendspringboot.dao.util.Mappers.*;

@Repository
public class EmployeeDAOImpl implements EmployeeDAO {

    private final JdbcTemplate jdbcTemplate;

    public EmployeeDAOImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public long count() throws Exception {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM employee", long.class);
    }

    @Override
    public Employee save(Employee entity) throws Exception {
        jdbcTemplate.update("INSERT INTO employee (employee_id, full_name, id_no, gender, dob, address, contact_number, email, department, post, epf_number, basic_salary, bank_name, branch_name, acc_number, image_url) " +
                        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                entity.getEmployeeID(),
                entity.getFullName(),
                entity.getIdNo(),
                entity.getGender(),
                entity.getDob(),
                entity.getAddress(),
                entity.getContactNumber(),
                entity.getEmail(),
                entity.getDepartment(),
                entity.getPost(),
                entity.getEpfNumber(),
                entity.getBasicSalary(),
                entity.getBankName(),
                entity.getBranchName(),
                entity.getAccNumber(),
                entity.getImageUrl());
        return entity;
    }

    @Override
    public void update(Employee entity) throws Exception {
        jdbcTemplate.update("UPDATE employee SET full_name=?, id_no=?, gender=?, dob=?,address=?," +
                        "contact_number=?, email=?, department=?, post=?, epf_number=?,basic_salary=?,bank_name=?," +
                        "branch_name=?,acc_number=?,image_url=? WHERE employee_id=?",
                entity.getFullName(),
                entity.getIdNo(),
                entity.getGender(),
                entity.getDob(),
                entity.getAddress(),
                entity.getContactNumber(),
                entity.getEmail(),
                entity.getDepartment(),
                entity.getPost(),
                entity.getEpfNumber(),
                entity.getBasicSalary(),
                entity.getBankName(),
                entity.getBranchName(),
                entity.getAccNumber(),
                entity.getImageUrl(),
                entity.getEmployeeID());
    }

    @Override
    public void deleteById(String pk) throws Exception {
        jdbcTemplate.update("DELETE FROM employee WHERE employee_id=?", pk);
    }


    @Override
    public Optional<Employee> findById(String pk) throws Exception {
        try {
            return Optional.of(jdbcTemplate.queryForObject("SELECT * FROM employee WHERE employee_id=?", EMPLOYEE_ROW_MAPPER, pk));
        } catch (DataAccessException exp) {
            return Optional.empty();
        }
    }

    @Override
    public List<Employee> findAll() throws Exception {
        return jdbcTemplate.query("SELECT * FROM employee", EMPLOYEE_ROW_MAPPER);
    }


    @Override
    public boolean existsById(String pk) throws Exception {
        return findById(pk).isPresent();
    }

}
