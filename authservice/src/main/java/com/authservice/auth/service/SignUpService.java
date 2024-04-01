package com.authservice.auth.service;

import org.springframework.stereotype.Service;

@Service
public class SignUpService{

    public boolean validatePassword(String userPassword){
        //Code by Namrata
        //updated by Mohsina
        //^: Asserts the start of the line.
        //(?=.*[A-Z]): Positive lookahead to ensure that the password contains at least one uppercase letter.
        //(?=.*\d): Positive lookahead to ensure that the password contains at least one digit.
        //(?=.*[@$!%*?&]): Positive lookahead to ensure that the password contains at least one special character among @$!%*?&
        //$: Asserts the end of the line.
        //Minimum 6 characters long and maximum 12 characters long, At least 1 uppercase letter and 1 lowercase letter, At least 1 special character among @$!%*?&
         
        String pattern = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{6,12}$";
        // Check if the string matches the pattern
            return userPassword.matches(pattern);
    }
    
    public boolean validateEmail(String userEmail) {
        // Regex expression to check validation of email address.
        String pattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" 
        + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";

            return userEmail.matches(pattern);
    }

    public boolean validateDob(String userDob) {
        // Regex expression to check validation of date of birth in format DD/MM/YYYY.
        String pattern = "^(29/02/(2000|2400|2800|(19|2[0-9])(0[48]|[2468][048]|[13579][26])))$" 
        + "|^((0[1-9]|1[0-9]|2[0-8])/02/((19|2[0-9])[0-9]{2}))$"
        + "|^((0[1-9]|[12][0-9]|3[01])/(0[13578]|10|12)/((19|2[0-9])[0-9]{2}))$" 
        + "|^((0[1-9]|[12][0-9]|30)/(0[469]|11)/((19|2[0-9])[0-9]{2}))$";

            return userDob.matches(pattern);
    }

}