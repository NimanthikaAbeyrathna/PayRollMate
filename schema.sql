CREATE DATABASE pay_roll_mate;


CREATE TABLE employee (
                           employee_id VARCHAR(50) PRIMARY KEY,
                           full_name VARCHAR(100) NOT NULL,
                           id_no VARCHAR(20) NOT NULL,
                           gender VARCHAR(50) NOT NULL,
                           dob DATE NOT NULL,
                           address VARCHAR(200) NOT NULL,
                           contact_number VARCHAR(20) NOT NULL,
                           email VARCHAR(100) NOT NULL,
                           department VARCHAR(100) NOT NULL,
                           post VARCHAR(100) NOT NULL,
                           epf_number VARCHAR(20) NOT NULL,
                           basic_salary DECIMAL(15, 2) NOT NULL,
                           bank_name VARCHAR(100) NOT NULL,
                           branch_name VARCHAR(100) NOT NULL,
                           acc_number BIGINT NOT NULL,
                           image_url VARCHAR(200)
);


CREATE TABLE IF NOT EXISTS year(
    id INT PRIMARY KEY AUTO_INCREMENT,
    year INT NOT NULL
);

CREATE TABLE salary (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        employeeid VARCHAR(100) NOT NULL,
                        year INT NOT NULL,
                        month VARCHAR(20) NOT NULL,
                        basicsalary DECIMAL(15, 2) NOT NULL,
                        leave_allowed DECIMAL(5,1) NOT NULL,
                        leave_taken DECIMAL(5,1) NOT NULL,
                        no_pay_leave DECIMAL(5,1) NOT NULL,
                        normal_overtime_hours DECIMAL(5, 2) NOT NULL,
                        special_overtime_hours DECIMAL(5, 2) NOT NULL,
                        salary_increment DECIMAL(15, 2) NOT NULL,
                        living_allowance DECIMAL(15, 2) NOT NULL,
                        food_allowance DECIMAL(15, 2) NOT NULL,
                        conveyance_allowance DECIMAL(15, 2) NOT NULL,
                        medical_allowance DECIMAL(15, 2) NOT NULL,
                        gross_salary DECIMAL(15, 2) NOT NULL,
                        overtime DECIMAL(15, 2) NOT NULL,
                        reimbursements DECIMAL(15, 2) NOT NULL,
                        bonus DECIMAL(15, 2) NOT NULL,
                        salary_before_deduction DECIMAL(15, 2) NOT NULL,
                        no_pay_deduction DECIMAL(15, 2) NOT NULL,
                        salary_advance DECIMAL(15, 2) NOT NULL,
                        welfare_service DECIMAL(15, 2) NOT NULL,
                        insurance DECIMAL(15, 2) NOT NULL,
                        apit DECIMAL(15, 2) NOT NULL,
                        epf_employee_contribution DECIMAL(15, 2) NOT NULL,
                        total_deductions DECIMAL(15, 2) NOT NULL,
                        net_payable_salary DECIMAL(15, 2) NOT NULL,
                        epf_employer_contribution DECIMAL(15, 2) NOT NULL,
                        etf_employer_contribution DECIMAL(15, 2) NOT NULL
);

