// Type definitions for GCD USMBA Platform

export type UserRole =
  | 'candidat'
  | 'enseignant_chercheur'
  | 'responsable_labo'
  | 'administration'
  | 'responsable_formation'
  | 'jury'
  | 'doctorant'
  | 'directeur_these'
  | 'responsable_gcd';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cin: string; // Carte d'Identité Nationale
  cne?: string; // Code National de l'Étudiant (pour candidats/doctorants)
  phone: string;
  establishmentId: string;
  laboratoryId?: string;
  roles: UserRole[];
  currentRole: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface Establishment {
  id: string;
  name: string;
  shortName: string;
  city: string;
  code: string;
}

export interface Laboratory {
  id: string;
  name: string;
  code: string;
  establishmentId: string;
  directorName: string;
  disciplines: string[];
}

export type SubjectStatus =
  | 'brouillon'
  | 'soumis'
  | 'en_attente_validation'
  | 'correction_demandee'
  | 'valide'
  | 'rejete';

export interface SubjectValidationEvent {
  id: string;
  subjectId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'soumission' | 'approbation' | 'rejet' | 'demande_correction';
  comment?: string;
  timestamp: string;
}

export interface DoctoralSubject {
  id: string;
  title: string;
  discipline: string;
  establishmentId: string;
  laboratoryId: string;
  supervisorId: string;
  supervisorName: string;
  coSupervisorName?: string;
  abstract: string;
  prerequisites: string;
  objectives: string;
  methodology?: string;
  keywords: string[];
  maxCandidates: number;
  status: SubjectStatus;
  rejectionReason?: string;
  correctionComment?: string;
  submissionDate: string;
  validationDate?: string;
  academicYear: string;
}

export type ApplicationStatus =
  | 'brouillon'
  | 'soumise'
  | 'en_cours_verification'
  | 'incomplete'
  | 'correction_demandee'
  | 'corrigee'
  | 'recevable'
  | 'en_cours_evaluation'
  | 'entretien_programme'
  | 'en_attente_decision'
  | 'admise'
  | 'liste_attente'
  | 'non_admise';

export type DocumentType =
  | 'cin'
  | 'bac'
  | 'licence'
  | 'master'
  | 'releves_notes'
  | 'cv'
  | 'lettre_motivation'
  | 'projet_recherche'
  | 'attestation_non_travail'
  | 'autorisation_employeur';

export interface ApplicationDocument {
  id: string;
  type: DocumentType;
  label: string;
  fileName: string;
  fileSize: number; // in bytes
  fileUrl: string;
  isRequired: boolean;
  status: 'valide' | 'rejete' | 'en_attente' | 'manquant';
  uploadedAt?: string;
  rejectionReason?: string;
}

export interface CorrectionRequest {
  id: string;
  applicationId: string;
  requestedBy: string;
  requestedAt: string;
  deadline: string;
  comment: string;
  missingOrInvalidDocs: DocumentType[];
  isResolved: boolean;
  resolvedAt?: string;
}

export interface ApplicationStatusHistory {
  id: string;
  status: ApplicationStatus;
  comment?: string;
  changedBy: string;
  timestamp: string;
}

export interface CandidateApplication {
  id: string;
  referenceNumber: string; // e.g. USMBA-DOC-2026-7842
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  cin: string;
  cne: string;
  subjectId: string;
  subjectTitle: string;
  laboratoryId: string;
  establishmentId: string;
  supervisorName: string;
  discipline: string;
  masterOriginUniversity: string;
  masterSpecialty: string;
  masterGraduationYear: number;
  masterMention: 'Très Bien' | 'Bien' | 'Assez Bien' | 'Passable';
  status: ApplicationStatus;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  documents: ApplicationDocument[];
  correctionRequests: CorrectionRequest[];
  statusHistory: ApplicationStatusHistory[];
  submittedAt: string;
  updatedAt: string;
  score?: number; // consolidated score 0-20
  rank?: number;
}

export interface InterviewSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  roomOrLink: string;
  juryMemberNames: string[];
  applicationId?: string;
  candidateName?: string;
  subjectTitle?: string;
  isBooked: boolean;
  notificationSent: boolean;
}

export interface CandidateEvaluation {
  id: string;
  applicationId: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorRole: 'enseignant_chercheur' | 'jury';
  academicDossierScore: number; // /5
  researchProposalScore: number; // /5
  interviewScore: number; // /5
  fitWithLaboratoryScore: number; // /5
  totalScore: number; // /20
  recommendation: 'favorable_fort' | 'favorable' | 'reserve' | 'defavorable';
  observations: string;
  submittedAt: string;
}

export interface SelectionReportVersion {
  version: number;
  updatedAt: string;
  updatedBy: string;
  summary: string;
  totalAdmitted: number;
  totalWaiting: number;
  totalRejected: number;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

export interface SelectionReport {
  id: string;
  establishmentId: string;
  laboratoryId: string;
  academicYear: string;
  status: 'brouillon' | 'en_validation' | 'valide' | 'publie';
  currentVersion: number;
  versions: SelectionReportVersion[];
  admittedApplicationIds: string[];
  waitingApplicationIds: string[];
  rejectedApplicationIds: string[];
  publishedAt?: string;
}

export type RegistrationStatus =
  | 'en_attente'
  | 'incomplet'
  | 'en_cours_verification'
  | 'valide'
  | 'rejete';

export interface AdministrativeRegistration {
  id: string;
  applicationId: string;
  candidateId: string;
  studentName: string;
  cin: string;
  cne: string;
  subjectTitle: string;
  laboratoryId: string;
  establishmentId: string;
  supervisorName: string;
  academicYear: string;
  status: RegistrationStatus;
  documents: {
    id: string;
    label: string;
    fileName: string;
    status: 'fourni' | 'manquant' | 'rejete' | 'conforme';
    required: boolean;
  }[];
  notes?: string;
  submittedAt?: string;
  validatedAt?: string;
  validatedBy?: string;
}

export type ReRegistrationStatus =
  | 'en_attente'
  | 'soumis'
  | 'avis_directeur_donne'
  | 'en_cours_verification'
  | 'valide'
  | 'incomplet'
  | 'rejete';

export interface AnnualReRegistration {
  id: string;
  studentId: string;
  studentName: string;
  cin: string;
  cne: string;
  thesisYear: number; // 2, 3, 4, 5, 6
  academicYear: string;
  supervisorId: string;
  supervisorName: string;
  laboratoryId: string;
  thesisTitle: string;
  status: ReRegistrationStatus;
  priority: 'normale' | 'urgente' | 'critique'; // based on deadlines
  submittedAt: string;
  deadlineDate: string;
  progressSummary: string;
  articlesPublishedCount: number;
  conferencesCount: number;
  trainingHoursCompleted: number;
  supervisorApproval: 'en_attente' | 'favorable' | 'defavorable';
  supervisorComment?: string;
  documents: {
    id: string;
    label: string;
    fileName: string;
    status: 'conforme' | 'non_conforme' | 'en_attente';
  }[];
  administrativeCheckComment?: string;
}

export interface InAppNotification {
  id: string;
  userId?: string; // specific user or broadcast
  targetRole?: UserRole;
  title: string;
  message: string;
  category: 'candidature' | 'sujet' | 'entretien' | 'resultat' | 'inscription' | 'reinscription' | 'systeme';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PlatformMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  relatedEntityId?: string; // e.g. application reference
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'candidature' | 'sujet' | 'utilisateur' | 'entretien' | 'pv' | 'inscription' | 'reinscription' | 'systeme';
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface FAQItem {
  id: string;
  category: 'candidature' | 'sujets' | 'selection' | 'inscription' | 'reinscription' | 'technique';
  question: string;
  answer: string;
  officialRef?: string;
  keywords: string[];
}

export interface DoctoralRule {
  id: string;
  code: string;
  title: string;
  category: 'admission' | 'delais' | 'pieces_justificatives' | 'seuils_selection' | 'derogation' | 'reinscription';
  description: string;
  conditionDescription: string;
  minimumScoreThreshold?: number; // e.g. 12/20
  deadlineDate?: string;
  mandatoryDocuments?: DocumentType[];
  isActive: boolean;
  applicableEstablishments?: string[]; // empty means all
  createdBy: string;
  updatedAt: string;
}

export interface DoctoralCampaign {
  id: string;
  code: string;
  title: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'ouverte' | 'cloturee' | 'en_preparation' | 'suspendue';
  totalQuota: number;
  openEstablishments: string[];
  currentApplicationsCount: number;
  admittedCount: number;
  description: string;
  createdAt: string;
}

export interface CINVerificationData {
  cin: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  cardValidUntil?: string;
  rawConfidence?: number;
}

export interface StudentCardVerificationData {
  cne: string;
  massarCode?: string;
  studentFullName: string;
  originEstablishment: string;
  masterSpecialty: string;
  academicYear: string;
  rawConfidence?: number;
}

export interface GoogleAuthPayload {
  googleId: string;
  email: string;
  displayName: string;
  givenName: string;
  familyName: string;
  photoUrl?: string;
  idToken?: string;
}

