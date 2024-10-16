package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgetPassModel {
    private String otp;
    private String email;
    private String message;
    private String newPass;
}
