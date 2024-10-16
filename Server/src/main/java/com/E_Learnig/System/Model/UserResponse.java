package com.E_Learnig.System.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    long id;
    String staffId;
    String userName;
    String email;
    String profileImage;
    String roles;


    public UserResponse(long id,String staffId,String userName, String email, String profileImage){
        this.id=id;
        this.staffId=staffId;
        this.userName=userName;
        this.email=email;
        this.profileImage=profileImage;
    }
}
