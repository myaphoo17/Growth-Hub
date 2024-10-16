package com.E_Learnig.System.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class MessagePrivateDtoRequest {
    private String userFromStaffId;
    private String recipientStaffId;
    private String content;
    private String typeMessage;


}
