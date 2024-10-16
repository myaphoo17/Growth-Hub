export class User {
    sr!: string;
    division!: string;
    staffId!: string;
    name!: string;
    doorLogNo!: string;
    department!: string;
    team!: string;
    email!: string;
    status!: string;
    role!: string;
    defaultPassword!: string;
    profilePhotoUrl!: string;

    constructor(sr: string, division: string, staffId: string, name: string, doorLogNo: string, department: string, team: string, email: string, status: string, role: string, defaultPassword: string, profilePhotoUrl: string) {
        this.sr = sr;
        this.division = division;
        this.staffId = staffId;
        this.name = name;
        this.doorLogNo = doorLogNo;
        this.department = department;
        this.team = team;
        this.email = email;
        this.status = status;
        this.role = role;
        this.defaultPassword = defaultPassword;
        this.profilePhotoUrl = profilePhotoUrl;
    }
}
