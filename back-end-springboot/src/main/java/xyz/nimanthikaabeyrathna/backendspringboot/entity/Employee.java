package xyz.nimanthikaabeyrathna.backendspringboot.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Employee implements SuperEntity{
    private String employeeID;
    private String fullName;
    private String idNo;
    private String gender;
    private Date dob;
    private String address;
    private String contactNumber;
    private String email;
    private String department;
    private String post;
    private String epfNumber;
    private BigDecimal basicSalary;
    private String bankName;
    private String branchName;
    private long accNumber;
    private String imageUrl;


}
