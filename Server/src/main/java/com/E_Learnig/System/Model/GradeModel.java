// GradeModel.java
package com.E_Learnig.System.Model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GradeModel {
        private Long id;
        private String name;
        private int minPoints;
        private int maxPoints;
        private int totalPoints;
        private long courseId;


}