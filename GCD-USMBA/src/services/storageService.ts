import {
  User,
  DoctoralSubject,
  CandidateApplication,
  InterviewSlot,
  CandidateEvaluation,
  SelectionReport,
  AdministrativeRegistration,
  AnnualReRegistration,
  InAppNotification,
  PlatformMessage,
  AuditLog,
  FAQItem,
  UserRole,
  ApplicationStatus,
  SubjectStatus,
  DoctoralRule,
  DoctoralCampaign
} from '../types';
import {
  DEMO_USERS,
  DOCTORAL_SUBJECTS,
  INITIAL_APPLICATIONS,
  INITIAL_INTERVIEW_SLOTS,
  INITIAL_EVALUATIONS,
  INITIAL_SELECTION_REPORT,
  INITIAL_ADMINISTRATIVE_REGISTRATIONS,
  INITIAL_ANNUAL_RE_REGISTRATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
  FAQ_DATA,
  INITIAL_DOCTORAL_RULES,
  INITIAL_DOCTORAL_CAMPAIGNS
} from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'gcd_usmba_users_v2',
  SUBJECTS: 'gcd_usmba_subjects_v2',
  APPLICATIONS: 'gcd_usmba_applications_v2',
  INTERVIEWS: 'gcd_usmba_interviews_v2',
  EVALUATIONS: 'gcd_usmba_evaluations_v2',
  SELECTION_REPORT: 'gcd_usmba_selection_report_v2',
  ADMIN_REGISTRATIONS: 'gcd_usmba_admin_registrations_v2',
  ANNUAL_RE_REGISTRATIONS: 'gcd_usmba_annual_re_registrations_v2',
  NOTIFICATIONS: 'gcd_usmba_notifications_v2',
  MESSAGES: 'gcd_usmba_messages_v2',
  AUDIT_LOGS: 'gcd_usmba_audit_logs_v2',
  FAQ: 'gcd_usmba_faq_v2',
  RULES: 'gcd_usmba_rules_v2',
  CAMPAIGNS: 'gcd_usmba_campaigns_v2',
  SETTINGS: 'gcd_usmba_settings_v2'
};

export interface PlatformSettings {
  academicYear: string;
  resultsPublished: boolean;
  applicationDeadline: string;
  reRegistrationDeadline: string;
  autoValidateEmail: boolean;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  academicYear: '2026-2027',
  resultsPublished: true,
  applicationDeadline: '2026-11-20',
  reRegistrationDeadline: '2026-11-30',
  autoValidateEmail: true
};

class StorageService {
  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.resetToDefaults();
    }
  }

  public resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DOCTORAL_SUBJECTS));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(INITIAL_INTERVIEW_SLOTS));
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(INITIAL_EVALUATIONS));
    localStorage.setItem(STORAGE_KEYS.SELECTION_REPORT, JSON.stringify(INITIAL_SELECTION_REPORT));
    localStorage.setItem(STORAGE_KEYS.ADMIN_REGISTRATIONS, JSON.stringify(INITIAL_ADMINISTRATIVE_REGISTRATIONS));
    localStorage.setItem(STORAGE_KEYS.ANNUAL_RE_REGISTRATIONS, JSON.stringify(INITIAL_ANNUAL_RE_REGISTRATIONS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.FAQ, JSON.stringify(FAQ_DATA));
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(INITIAL_DOCTORAL_RULES));
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(INITIAL_DOCTORAL_CAMPAIGNS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }

  // Generic getter & setter
  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage full or error', e);
    }
  }

  // Audit Logs (Activity 34)
  public logAction(
    user: { id: string; name: string; role: UserRole },
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '196.200.142.' + Math.floor(Math.random() * 200 + 10),
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 300));
  }

  public getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  // Users & RBAC (Activity 1, 33)
  public getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  // Subjects (Activity 4, 5, 6)
  public getSubjects(): DoctoralSubject[] {
    return this.getItem<DoctoralSubject[]>(STORAGE_KEYS.SUBJECTS, DOCTORAL_SUBJECTS);
  }

  public getSubjectById(id: string): DoctoralSubject | undefined {
    return this.getSubjects().find((s) => s.id === id);
  }

  public saveSubject(subject: DoctoralSubject, actor: { id: string; name: string; role: UserRole }): void {
    const subjects = this.getSubjects();
    const index = subjects.findIndex((s) => s.id === subject.id);
    const isNew = index === -1;
    if (isNew) {
      subjects.unshift(subject);
      this.logAction(actor, 'PROPOSITION_SUJET', 'sujet', subject.id, `Nouveau sujet proposé : "${subject.title.substring(0, 50)}..."`);
    } else {
      subjects[index] = subject;
      this.logAction(actor, 'MISE_A_JOUR_SUJET', 'sujet', subject.id, `Mise à jour statut : ${subject.status}`);
    }
    this.setItem(STORAGE_KEYS.SUBJECTS, subjects);
  }

  // Applications (Activity 7, 8, 9, 10, 11, 12, 13)
  public getApplications(): CandidateApplication[] {
    return this.getItem<CandidateApplication[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  }

  // Strict Candidate Application Isolation — never returns another candidate's application
  public getCandidateApplicationStrict(candidateId?: string, email?: string, cin?: string): CandidateApplication | undefined {
    if (!candidateId && !email && !cin) return undefined;
    const apps = this.getApplications();
    return apps.find((a) => {
      if (candidateId && a.candidateId === candidateId) return true;
      if (email && a.candidateEmail?.toLowerCase() === email.toLowerCase()) return true;
      if (cin && a.cin?.toUpperCase() === cin.toUpperCase()) return true;
      return false;
    });
  }

  public getApplicationById(id: string): CandidateApplication | undefined {
    return this.getApplications().find((a) => a.id === id);
  }

  public getApplicationByReference(ref: string): CandidateApplication | undefined {
    return this.getApplications().find((a) => a.referenceNumber === ref);
  }

  public saveApplication(application: CandidateApplication, actor: { id: string; name: string; role: UserRole }): void {
    const applications = this.getApplications();
    const index = applications.findIndex((a) => a.id === application.id);
    if (index >= 0) {
      applications[index] = application;
      this.logAction(actor, 'MISE_A_JOUR_CANDIDATURE', 'candidature', application.referenceNumber, `Statut : ${application.status}`);
    } else {
      applications.unshift(application);
      this.logAction(actor, 'NOUVELLE_CANDIDATURE', 'candidature', application.referenceNumber, `Dossier créé et soumis.`);
    }
    this.setItem(STORAGE_KEYS.APPLICATIONS, applications);
  }

  // Interview Slots (Activity 15, 16)
  public getInterviews(): InterviewSlot[] {
    return this.getItem<InterviewSlot[]>(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEW_SLOTS);
  }

  public saveInterviewSlot(slot: InterviewSlot, actor: { id: string; name: string; role: UserRole }): void {
    const slots = this.getInterviews();
    const idx = slots.findIndex((s) => s.id === slot.id);
    if (idx >= 0) {
      slots[idx] = slot;
    } else {
      slots.push(slot);
    }
    this.setItem(STORAGE_KEYS.INTERVIEWS, slots);
    this.logAction(actor, 'GESTION_CRENEAU_ENTRETIEN', 'entretien', slot.id, `Créneau ${slot.date} ${slot.startTime} mis à jour.`);
  }

  // Evaluations (Activity 17, 18)
  public getEvaluations(): CandidateEvaluation[] {
    return this.getItem<CandidateEvaluation[]>(STORAGE_KEYS.EVALUATIONS, INITIAL_EVALUATIONS);
  }

  public saveEvaluation(evaluation: CandidateEvaluation, actor: { id: string; name: string; role: UserRole }): void {
    const evals = this.getEvaluations();
    const idx = evals.findIndex((e) => e.id === evaluation.id);
    if (idx >= 0) {
      evals[idx] = evaluation;
    } else {
      evals.push(evaluation);
    }
    this.setItem(STORAGE_KEYS.EVALUATIONS, evals);
    this.logAction(actor, 'SAISIE_EVALUATION', 'candidature', evaluation.applicationId, `Note attribuée : ${evaluation.totalScore}/20.`);
  }

  // Selection Report / Procès-Verbal (Activity 19, 20, 21)
  public getSelectionReport(): SelectionReport {
    return this.getItem<SelectionReport>(STORAGE_KEYS.SELECTION_REPORT, INITIAL_SELECTION_REPORT);
  }

  public saveSelectionReport(report: SelectionReport, actor: { id: string; name: string; role: UserRole }): void {
    this.setItem(STORAGE_KEYS.SELECTION_REPORT, report);
    this.logAction(actor, 'VALIDATION_PV', 'pv', report.id, `Statut PV : ${report.status}, Version : ${report.currentVersion}`);
  }

  // Administrative Registrations (Activity 23, 24, 25, 26)
  public getAdministrativeRegistrations(): AdministrativeRegistration[] {
    return this.getItem<AdministrativeRegistration[]>(STORAGE_KEYS.ADMIN_REGISTRATIONS, INITIAL_ADMINISTRATIVE_REGISTRATIONS);
  }

  public saveAdministrativeRegistration(reg: AdministrativeRegistration, actor: { id: string; name: string; role: UserRole }): void {
    const regs = this.getAdministrativeRegistrations();
    const idx = regs.findIndex((r) => r.id === reg.id);
    if (idx >= 0) {
      regs[idx] = reg;
    } else {
      regs.unshift(reg);
    }
    this.setItem(STORAGE_KEYS.ADMIN_REGISTRATIONS, regs);
    this.logAction(actor, 'INSCRIPTION_ADMINISTRATIVE', 'inscription', reg.id, `Statut inscription : ${reg.status}`);
  }

  // Annual Re-Registrations (Activity 27, 28, 29, 30)
  public getAnnualReRegistrations(): AnnualReRegistration[] {
    return this.getItem<AnnualReRegistration[]>(STORAGE_KEYS.ANNUAL_RE_REGISTRATIONS, INITIAL_ANNUAL_RE_REGISTRATIONS);
  }

  public saveAnnualReRegistration(reReg: AnnualReRegistration, actor: { id: string; name: string; role: UserRole }): void {
    const list = this.getAnnualReRegistrations();
    const idx = list.findIndex((r) => r.id === reReg.id);
    if (idx >= 0) {
      list[idx] = reReg;
    } else {
      list.unshift(reReg);
    }
    this.setItem(STORAGE_KEYS.ANNUAL_RE_REGISTRATIONS, list);
    this.logAction(actor, 'REINSCRIPTION_ANNUELLE', 'reinscription', reReg.id, `Statut : ${reReg.status}`);
  }

  // Notifications (Activity 8, 11, 16, 22, 31)
  public getNotifications(): InAppNotification[] {
    return this.getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  public addNotification(notification: Omit<InAppNotification, 'id' | 'createdAt' | 'isRead'>): void {
    const list = this.getNotifications();
    const newNotif: InAppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    list.unshift(newNotif);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  public markNotificationAsRead(id: string): void {
    const list = this.getNotifications();
    const notif = list.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  }

  public markAllNotificationsAsRead(userOrRole?: { userId?: string; role?: UserRole }): void {
    const list = this.getNotifications();
    list.forEach((n) => {
      if (!userOrRole || n.userId === userOrRole.userId || n.targetRole === userOrRole.role) {
        n.isRead = true;
      }
    });
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // Messages (Activity 31)
  public getMessages(): PlatformMessage[] {
    return this.getItem<PlatformMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  }

  public sendMessage(msg: Omit<PlatformMessage, 'id' | 'createdAt' | 'isRead'>): void {
    const messages = this.getMessages();
    const newMsg: PlatformMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    messages.unshift(newMsg);
    this.setItem(STORAGE_KEYS.MESSAGES, messages);
  }

  // FAQ (Activity 32)
  public getFAQ(): FAQItem[] {
    return this.getItem<FAQItem[]>(STORAGE_KEYS.FAQ, FAQ_DATA);
  }

  public saveFAQItem(item: FAQItem): void {
    const faqs = this.getFAQ();
    const idx = faqs.findIndex((f) => f.id === item.id);
    if (idx >= 0) {
      faqs[idx] = item;
    } else {
      faqs.push(item);
    }
    this.setItem(STORAGE_KEYS.FAQ, faqs);
  }

  // Doctoral Operational Rules Management
  public getRules(): DoctoralRule[] {
    return this.getItem<DoctoralRule[]>(STORAGE_KEYS.RULES, INITIAL_DOCTORAL_RULES);
  }

  public saveRule(rule: DoctoralRule, actor?: { id: string; name: string; role: UserRole }): void {
    const rules = this.getRules();
    const idx = rules.findIndex((r) => r.id === rule.id);
    if (idx >= 0) {
      rules[idx] = { ...rule, updatedAt: new Date().toISOString() };
    } else {
      rules.push({ ...rule, updatedAt: new Date().toISOString() });
    }
    this.setItem(STORAGE_KEYS.RULES, rules);
    if (actor) {
      this.logAction(actor, 'GESTION_REGLE_DOCTORALE', 'systeme', rule.id, `Règle ${rule.code} : ${rule.title} enregistrée.`);
    }
  }

  public deleteRule(id: string, actor?: { id: string; name: string; role: UserRole }): void {
    const rules = this.getRules().filter((r) => r.id !== id);
    this.setItem(STORAGE_KEYS.RULES, rules);
    if (actor) {
      this.logAction(actor, 'SUPPRESSION_REGLE', 'systeme', id, `Suppression de la règle ${id}`);
    }
  }

  public toggleRuleStatus(id: string, actor?: { id: string; name: string; role: UserRole }): void {
    const rules = this.getRules();
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      rule.isActive = !rule.isActive;
      rule.updatedAt = new Date().toISOString();
      this.setItem(STORAGE_KEYS.RULES, rules);
      if (actor) {
        this.logAction(actor, 'MODIFICATION_REGLE', 'systeme', id, `Règle ${rule.code} désormais ${rule.isActive ? 'ACTIVE' : 'INACTIVE'}`);
      }
    }
  }

  // Doctoral Campaigns Management
  public getCampaigns(): DoctoralCampaign[] {
    return this.getItem<DoctoralCampaign[]>(STORAGE_KEYS.CAMPAIGNS, INITIAL_DOCTORAL_CAMPAIGNS);
  }

  public getActiveCampaign(): DoctoralCampaign | undefined {
    return this.getCampaigns().find((c) => c.status === 'ouverte');
  }

  public saveCampaign(campaign: DoctoralCampaign, actor?: { id: string; name: string; role: UserRole }): void {
    const campaigns = this.getCampaigns();
    const idx = campaigns.findIndex((c) => c.id === campaign.id);
    if (idx >= 0) {
      campaigns[idx] = campaign;
    } else {
      campaigns.unshift(campaign);
    }
    this.setItem(STORAGE_KEYS.CAMPAIGNS, campaigns);
    if (actor) {
      this.logAction(actor, 'GESTION_CAMPAGNE_DOCTORALE', 'systeme', campaign.id, `Campagne ${campaign.code} mise à jour (Statut: ${campaign.status})`);
    }
  }

  // Settings (Activity 35, 36)
  public getSettings(): PlatformSettings {
    return this.getItem<PlatformSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public updateSettings(settings: Partial<PlatformSettings>): void {
    const current = this.getSettings();
    this.setItem(STORAGE_KEYS.SETTINGS, { ...current, ...settings });
  }

  // Platform Metrics & Bottleneck Analysis (Activity 35)
  public getPlatformMetrics() {
    const subjects = this.getSubjects();
    const applications = this.getApplications();
    const interviews = this.getInterviews();
    const registrations = this.getAdministrativeRegistrations();
    const reRegistrations = this.getAnnualReRegistrations();

    // Bottlenecks calculation
    const pendingSubjectsCount = subjects.filter((s) => s.status === 'en_attente_validation').length;
    const incompleteApplicationsCount = applications.filter((a) => a.status === 'incomplete' || a.status === 'correction_demandee').length;
    const pendingAdminVerificationCount = applications.filter((a) => a.status === 'soumise' || a.status === 'en_cours_verification' || a.status === 'corrigee').length;
    const unassignedInterviewsCount = applications.filter((a) => a.status === 'recevable').length;
    const pendingRegistrationsCount = registrations.filter((r) => r.status === 'en_cours_verification' || r.status === 'en_attente').length;
    const pendingReRegistrationsCount = reRegistrations.filter((r) => r.status === 'avis_directeur_donne' || r.status === 'en_cours_verification').length;

    return {
      totalSubjects: subjects.length,
      validatedSubjects: subjects.filter((s) => s.status === 'valide').length,
      pendingSubjects: pendingSubjectsCount,
      totalApplications: applications.length,
      applicationsByStatus: {
        soumise: applications.filter((a) => a.status === 'soumise').length,
        en_verification: applications.filter((a) => a.status === 'en_cours_verification').length,
        correction_demandee: applications.filter((a) => a.status === 'correction_demandee').length,
        recevable: applications.filter((a) => a.status === 'recevable').length,
        entretien: applications.filter((a) => a.status === 'entretien_programme').length,
        admise: applications.filter((a) => a.status === 'admise').length
      },
      interviewsTotal: interviews.length,
      interviewsBooked: interviews.filter((i) => i.isBooked).length,
      registrationsTotal: registrations.length,
      reRegistrationsTotal: reRegistrations.length,
      bottlenecks: [
        {
          id: 'bn-1',
          severity: pendingSubjectsCount > 0 ? 'warning' : 'ok',
          title: 'Sujets doctoraux en attente de visa de laboratoire',
          count: pendingSubjectsCount,
          description: `${pendingSubjectsCount} sujet(s) soumis par des chercheurs attendent la validation formelle des directeurs de labo.`
        },
        {
          id: 'bn-2',
          severity: incompleteApplicationsCount > 0 ? 'alert' : 'ok',
          title: 'Dossiers incomplets nécessitant régularisation',
          count: incompleteApplicationsCount,
          description: `${incompleteApplicationsCount} candidat(s) doivent déposer des pièces conformes avant la date limite.`
        },
        {
          id: 'bn-3',
          severity: pendingAdminVerificationCount > 2 ? 'warning' : 'ok',
          title: 'File d\'instruction administrative',
          count: pendingAdminVerificationCount,
          description: `${pendingAdminVerificationCount} dossier(s) déposé(s) en attente de vérification formelle par la scolarité.`
        },
        {
          id: 'bn-4',
          severity: unassignedInterviewsCount > 0 ? 'info' : 'ok',
          title: 'Candidats recevables sans convocation d\'audition',
          count: unassignedInterviewsCount,
          description: `${unassignedInterviewsCount} dossier(s) recevable(s) prêt(s) pour la programmation des créneaux de jury.`
        }
      ]
    };
  }
}

export const storageService = new StorageService();
