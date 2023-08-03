package xyz.nimanthikaabeyrathna.backendspringboot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmployeeDTO implements Serializable {

    @NotBlank(message = "Employee ID cannot be blank")
    private String employeeID;

    @NotBlank(message = "Full Name cannot be blank")
    private String fullName;

    @NotBlank(message = "ID No cannot be blank")
    @Pattern(regexp = "[0-9]{9}[Vv]")
    private String idNo;

    @NotNull(message = "Gender cannot be null")
    @Pattern(regexp = "^(MALE|FEMALE)$", message = "Gender should be either 'MALE' or 'FEMALE'")
    private String gender;

    @NotNull(message = "Date of Birth cannot be null")
    private Date dob;

    @NotBlank(message = "Address cannot be blank")
    private String address;

    @Pattern(regexp = "[0-9]{3}-[0-9]{7}", message = "Contact Number should be in the format '123-4567890'")
    private String contactNumber;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "Department cannot be blank")
    private String department;

    @NotBlank(message = "Post cannot be blank")
    private String post;

    @NotBlank(message = "EPF Number cannot be blank")
    private String epfNumber;

    @NotNull(message = "Basic Salary cannot be null")
    private BigDecimal basicSalary;

    @NotBlank(message = "Bank Name cannot be blank")
    private String bankName;

    @NotBlank(message = "Branch Name cannot be blank")
    private String branchName;

    @NotNull(message = "Account Number cannot be null")
    private long accNumber;

    private String imageUrl;
}
