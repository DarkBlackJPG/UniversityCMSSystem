export class NewCourseData {
  constructor() {
    this.type = null;
    this.coursecode_SI = '';
    this.coursecode_RTI = '';
    this.isMaster = null;
    this.isSI = null;
    this.isRTI = null;
    this.semester = -1;
    this.classCount = '';
    this.conditions = '';
    this.outcome = '';
    this.purpose = '';
    this.lectureDates = '';
    this.auditoryExcercisesDates = '';
    this.labInfo = '';
    this.ESPB = 0;
    this.homeworks = '';
    this.isMapped = false;
    this.acronym = '';
    this.name = '';
  }
  public type: boolean;
  public coursecode_SI: string;
  public coursecode_RTI: string;
  public isMaster: boolean;
  public isSI: boolean;
  public isRTI: boolean;
  public semester: number;
  public classCount: string;
  public ESPB: number;
  public conditions: string;
  public outcome: string;
  public purpose: string;
  public lectureDates: string;
  public auditoryExcercisesDates: string;
  public labInfo: string;
  public homeworks: string;
  public isMapped: boolean;
  public acronym: string;
  public name: string;
}
