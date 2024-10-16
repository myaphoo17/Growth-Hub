package com.E_Learnig.System.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadNotifDto {
    String staffIdUserTo;

    String staffIdUserFrom;

    String typeNotif;

    Number idPost;
}
