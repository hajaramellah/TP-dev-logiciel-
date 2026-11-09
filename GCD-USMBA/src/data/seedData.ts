import {
  User,
  Establishment,
  Laboratory,
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
  DoctoralRule,
  DoctoralCampaign
} from '../types';

export const ESTABLISHMENTS: Establishment[] = [
  {
    id: 'fsdm',
    name: 'Faculté des Sciences Dhar El Mahraz',
    shortName: 'FSDM',
    city: 'Fès',
    code: 'USMBA-FSDM'
  },
  {
    id: 'ensa',
    name: 'École Nationale des Sciences Appliquées de Fès',
    shortName: 'ENSA',
    city: 'Fès',
    code: 'USMBA-ENSA'
  },
  {
    id: 'fsjes',
    name: 'Faculté des Sciences Juridiques, Économiques et Sociales',
    shortName: 'FSJES',
    city: 'Fès',
    code: 'USMBA-FSJES'
  },
  {
    id: 'flsh',
    name: 'Faculté des Lettres et des Sciences Humaines Saïs',
    shortName: 'FLSH',
    city: 'Fès',
    code: 'USMBA-FLSH'
  },
  {
    id: 'fmpf',
    name: 'Faculté de Médecine, de Pharmacie et de Médecine Dentaire',
    shortName: 'FMPF',
    city: 'Fès',
    code: 'USMBA-FMPF'
  },
  {
    id: 'est',
    name: 'École Supérieure de Technologie de Fès',
    shortName: 'EST',
    city: 'Fès',
    code: 'USMBA-EST'
  }
];

export const LABORATORIES: Laboratory[] = [
  {
    id: 'lisac',
    name: 'Laboratoire d\'Ingénierie des Systèmes, d\'Automatique et de Calcul (LISAC)',
    code: 'LAB-LISAC-01',
    establishmentId: 'fsdm',
    directorName: 'Pr. Abdelhafid EL ALAOUI',
    disciplines: ['Informatique & IA', 'Génie Électrique', 'Automatique & Robotique']
  },
  {
    id: 'lerma',
    name: 'Laboratoire d\'Énergies Renouvelables et Matériaux Avancés (LERMA)',
    code: 'LAB-LERMA-02',
    establishmentId: 'ensa',
    directorName: 'Pr. Fatima-Zahra BENCHEIKH',
    disciplines: ['Physique des Matériaux', 'Énergie Solaire', 'Nanotechnologies']
  },
  {
    id: 'lim',
    name: 'Laboratoire d\'Informatique et Modélisation (LIM)',
    code: 'LAB-LIM-03',
    establishmentId: 'fsdm',
    directorName: 'Pr. Mohammed ZOUHAIR',
    disciplines: ['Data Science', 'Cybersécurité', 'Cloud Computing']
  },
  {
    id: 'leg',
    name: 'Laboratoire d\'Économie, Gestion et Intelligence Décisionnelle (LEGID)',
    code: 'LAB-LEGID-04',
    establishmentId: 'fsjes',
    directorName: 'Pr. Meryem KABBAJ',
    disciplines: ['Économie Appliquée', 'Finance Participative', 'Management Stratégique']
  },
  {
    id: 'lbmb',
    name: 'Laboratoire de Biomédecine et Biotechnologies Médicales',
    code: 'LAB-LBMB-05',
    establishmentId: 'fmpf',
    directorName: 'Pr. Yassine TAZI',
    disciplines: ['Biologie Moléculaire', 'Pharmacologie', 'Immunologie']
  }
];

export const DEMO_USERS: User[] = [
  {
    id: 'usr-candidat-1',
    email: 'hajar.amellah@usmba.ac.ma',
    firstName: 'Hajar',
    lastName: 'Amellah',
    cin: 'CD654321',
    cne: 'N134098765',
    phone: '+212 6 61 23 45 67',
    establishmentId: 'fsdm',
    roles: ['candidat'],
    currentRole: 'candidat',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2026-09-15T08:30:00Z'
  },
  {
    id: 'usr-candidat-2',
    email: 'mehdi.benjelloun@usmba.ac.ma',
    firstName: 'Mehdi',
    lastName: 'Benjelloun',
    cin: 'CD712390',
    cne: 'N138129845',
    phone: '+212 6 70 88 99 00',
    establishmentId: 'ensa',
    roles: ['candidat'],
    currentRole: 'candidat',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2026-09-20T10:15:00Z'
  },
  {
    id: 'usr-chercheur-1',
    email: 'abdelhafid.elalaoui@usmba.ac.ma',
    firstName: 'Abdelhafid',
    lastName: 'El Alaoui',
    cin: 'C102938',
    phone: '+212 5 35 60 80 10',
    establishmentId: 'fsdm',
    laboratoryId: 'lisac',
    roles: ['enseignant_chercheur', 'directeur_these', 'jury'],
    currentRole: 'enseignant_chercheur',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2020-01-10T09:00:00Z'
  },
  {
    id: 'usr-labo-1',
    email: 'fatimazahra.bencheikh@usmba.ac.ma',
    firstName: 'Fatima-Zahra',
    lastName: 'Bencheikh',
    cin: 'C987123',
    phone: '+212 5 35 60 80 12',
    establishmentId: 'ensa',
    laboratoryId: 'lerma',
    roles: ['responsable_labo', 'enseignant_chercheur'],
    currentRole: 'responsable_labo',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2019-06-15T11:00:00Z'
  },
  {
    id: 'usr-admin-1',
    email: 'administration.scolarite@usmba.ac.ma',
    firstName: 'Karim',
    lastName: 'Mansouri',
    cin: 'C456789',
    phone: '+212 5 35 60 99 00',
    establishmentId: 'fsdm',
    roles: ['administration'],
    currentRole: 'administration',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2018-09-01T08:00:00Z'
  },
  {
    id: 'usr-formation-1',
    email: 'formation.doctorale@usmba.ac.ma',
    firstName: 'Mustapha',
    lastName: 'El Ouazzani',
    cin: 'C223344',
    phone: '+212 5 35 60 70 80',
    establishmentId: 'fsdm',
    roles: ['responsable_formation'],
    currentRole: 'responsable_formation',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2019-02-14T14:00:00Z'
  },
  {
    id: 'usr-jury-1',
    email: 'jury.informatique@usmba.ac.ma',
    firstName: 'Rachid',
    lastName: 'Choukri',
    cin: 'C556677',
    phone: '+212 6 62 11 22 33',
    establishmentId: 'fsdm',
    roles: ['jury', 'enseignant_chercheur'],
    currentRole: 'jury',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2021-03-10T10:00:00Z'
  },
  {
    id: 'usr-doctorant-1',
    email: 'yassine.bennani@usmba.ac.ma',
    firstName: 'Yassine',
    lastName: 'Bennani',
    cin: 'CD554433',
    cne: 'N130099881',
    phone: '+212 6 63 99 88 77',
    establishmentId: 'fsdm',
    laboratoryId: 'lisac',
    roles: ['doctorant'],
    currentRole: 'doctorant',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2024-10-01T08:00:00Z'
  },
  {
    id: 'usr-directeur-1',
    email: 'directeur.these@usmba.ac.ma',
    firstName: 'Mohammed',
    lastName: 'Zouhair',
    cin: 'C334455',
    phone: '+212 5 35 60 85 90',
    establishmentId: 'fsdm',
    laboratoryId: 'lim',
    roles: ['directeur_these', 'enseignant_chercheur'],
    currentRole: 'directeur_these',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2017-09-01T08:00:00Z'
  },
  {
    id: 'usr-superadmin-1',
    email: 'superadmin.gcd@usmba.ac.ma',
    firstName: 'Driss',
    lastName: 'Tahiri',
    cin: 'C112233',
    phone: '+212 5 35 60 99 99',
    establishmentId: 'fsdm',
    roles: ['responsable_gcd', 'administration'],
    currentRole: 'responsable_gcd',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2016-01-01T08:00:00Z'
  }
];

export const DOCTORAL_SUBJECTS: DoctoralSubject[] = [
  {
    id: 'suj-001',
    title: 'Architectures d\'Apprentissage Profond et Vision par Ordinateur pour la Détection Précoce des Maladies des Cultures d\'Olivier au Maroc',
    discipline: 'Informatique & IA',
    establishmentId: 'fsdm',
    laboratoryId: 'lisac',
    supervisorId: 'usr-chercheur-1',
    supervisorName: 'Pr. Abdelhafid EL ALAOUI',
    coSupervisorName: 'Pr. Mohammed ZOUHAIR',
    abstract: 'Cette thèse explore la mise en œuvre de modèles de Deep Learning légers (Edge AI / Vision Transformers) déployables sur drones et capteurs IoT pour le monitoring agricole intelligent dans la région Fès-Meknès.',
    prerequisites: 'Master ou diplôme d\'Ingénieur en Informatique, Intelligence Artificielle ou Vision par Ordinateur. Maîtrise de Python, PyTorch et OpenCV.',
    objectives: '1. Élaboration d\'un dataset annoté spécifique aux oliveraies marocaines. 2. Conception d\'un modèle Transformer optimisé pour l\'embarqué. 3. Déploiement pilote et validation in situ.',
    methodology: 'Acquisition multispectrale, modélisation supervisée et auto-supervisée, benchmarks sur architectures GPU/NPU.',
    keywords: ['Deep Learning', 'Edge AI', 'Agriculture Intelligente', 'Vision par Ordinateur', 'Transformers'],
    maxCandidates: 1,
    status: 'valide',
    submissionDate: '2026-09-01T10:00:00Z',
    validationDate: '2026-09-05T14:30:00Z',
    academicYear: '2026-2027'
  },
  {
    id: 'suj-002',
    title: 'Optimisation Thermomécanique et Modélisation Numérique de Nouveaux Matériaux à Changement de Phase pour le Stockage Énergétique Solaire',
    discipline: 'Physique des Matériaux',
    establishmentId: 'ensa',
    laboratoryId: 'lerma',
    supervisorId: 'usr-labo-1',
    supervisorName: 'Pr. Fatima-Zahra BENCHEIKH',
    abstract: 'Conception et caractérisation de nanocomposites innovants à base d\'argiles marocaines et de paraffines pour l\'efficacité thermique des bâtiments passifs.',
    prerequisites: 'Master ou Ingénieur en Génie Énergétique, Science des Matériaux ou Mécanique des Fluides.',
    objectives: 'Développer des matériaux à haute diffusivité thermique, tester la cyclabilité sur 1000 cycles et modéliser sur COMSOL Multiphysics.',
    methodology: 'Synthèse en laboratoire, caractérisations DSC/DRX/MEB et simulation numérique.',
    keywords: ['Énergie Solaire', 'Stockage Thermique', 'Nanomatériaux', 'Argiles', 'COMSOL'],
    maxCandidates: 2,
    status: 'valide',
    submissionDate: '2026-09-02T11:00:00Z',
    validationDate: '2026-09-06T09:15:00Z',
    academicYear: '2026-2027'
  },
  {
    id: 'suj-003',
    title: 'Protocoles Cryptographiques Post-Quantiques et Architectures Zero-Trust pour la Sécurisation des Systèmes d\'Information Hospitaliers',
    discipline: 'Cybersécurité',
    establishmentId: 'fsdm',
    laboratoryId: 'lim',
    supervisorId: 'usr-directeur-1',
    supervisorName: 'Pr. Mohammed ZOUHAIR',
    abstract: 'Étude et intégration des algorithmes de cryptographie post-quantique (ML-KEM, Falcon) au sein des dossiers patients électroniques pour garantir la confidentialité et la résilience.',
    prerequisites: 'Master en Sécurité des Systèmes d\'Information, Cryptographie ou Réseaux.',
    objectives: 'Évaluer l\'impact sur la latence des échanges hospitaliers et implémenter une passerelle Zero-Trust quantique-résistante.',
    methodology: 'Benchmarking matériel, audit cryptographique, implémentation OpenSSL 3.0 / liboqs.',
    keywords: ['Cybersécurité', 'Cryptographie Post-Quantique', 'Zero-Trust', 'Santé Numérique'],
    maxCandidates: 1,
    status: 'valide',
    submissionDate: '2026-09-03T15:00:00Z',
    validationDate: '2026-09-07T16:00:00Z',
    academicYear: '2026-2027'
  },
  {
    id: 'suj-004',
    title: 'Gouvernance des Données et Impact de l\'Intelligence Artificielle sur la Résilience Bancaire : Cas des Banques Marocaines et Africaines',
    discipline: 'Économie Appliquée',
    establishmentId: 'fsjes',
    laboratoryId: 'leg',
    supervisorId: 'usr-chercheur-1',
    supervisorName: 'Pr. Meryem KABBAJ',
    abstract: 'Analyse économétrique des déterminants de l\'adoption de l\'IA dans le scoring de crédit et gestion des risques de liquidité sous la directive Bâle III/IV.',
    prerequisites: 'Master en Économétrie, Banque & Finance ou Systèmes d\'Information Financiers.',
    objectives: 'Mesurer empiriquement l\'incidence de l\'IA sur le coût du risque et formuler des recommandations prudentielles pour Bank Al-Maghrib.',
    methodology: 'Données de panel dynamiques (GMM de Blundell-Bond), analyse textuelle des rapports annuels.',
    keywords: ['Banque', 'Fintech', 'Scoring de Crédit', 'Économétrie', 'Régulation'],
    maxCandidates: 1,
    status: 'en_attente_validation',
    submissionDate: '2026-09-28T14:00:00Z',
    academicYear: '2026-2027'
  },
  {
    id: 'suj-005',
    title: 'Découverte de Biomarqueurs Circulants par Intelligence Artificielle pour le Dépistage du Carcinome Hépatocellulaire',
    discipline: 'Biologie Moléculaire',
    establishmentId: 'fmpf',
    laboratoryId: 'lbmb',
    supervisorId: 'usr-chercheur-1',
    supervisorName: 'Pr. Yassine TAZI',
    abstract: 'Exploitation des données transcriptomiques et métabolomiques par réseaux neuronaux convolutionnels pour isoler des panels d\'ARN non-codants diagnostiques.',
    prerequisites: 'Master en Biotechnologie Médicale, Bioinformatique ou Biologie Cellulaire.',
    objectives: 'Validation d\'une signature moléculaire non invasive à partir de biopsies liquides.',
    keywords: ['Oncologie', 'Biomarqueurs', 'Bioinformatique', 'Médecine de Précision'],
    maxCandidates: 1,
    status: 'correction_demandee',
    correctionComment: 'Merci de préciser la convention de collaboration avec le CHU Hassan II de Fès pour l\'accès aux cohortes de patients.',
    submissionDate: '2026-09-25T09:30:00Z',
    academicYear: '2026-2027'
  }
];

export const INITIAL_APPLICATIONS: CandidateApplication[] = [
  {
    id: 'app-001',
    referenceNumber: 'USMBA-DOC-2026-7842',
    candidateId: 'usr-candidat-1',
    candidateName: 'Hajar Amellah',
    candidateEmail: 'hajar.amellah@usmba.ac.ma',
    candidatePhone: '+212 6 61 23 45 67',
    cin: 'CD654321',
    cne: 'N134098765',
    subjectId: 'suj-001',
    subjectTitle: 'Architectures d\'Apprentissage Profond et Vision par Ordinateur pour la Détection Précoce des Maladies des Cultures d\'Olivier au Maroc',
    laboratoryId: 'lisac',
    establishmentId: 'fsdm',
    supervisorName: 'Pr. Abdelhafid EL ALAOUI',
    discipline: 'Informatique & IA',
    masterOriginUniversity: 'Université Sidi Mohamed Ben Abdellah - FSDM',
    masterSpecialty: 'Informatique Décisionnelle et Systèmes Intelligents (IDSI)',
    masterGraduationYear: 2026,
    masterMention: 'Très Bien',
    status: 'entretien_programme',
    assignedReviewerId: 'usr-admin-1',
    assignedReviewerName: 'Karim Mansouri (Scolarité)',
    submittedAt: '2026-09-18T10:20:00Z',
    updatedAt: '2026-10-02T15:40:00Z',
    score: 18.25,
    rank: 1,
    documents: [
      { id: 'doc-1', type: 'cin', label: 'Carte d\'Identité Nationale (CIN)', fileName: 'CIN_CD654321.pdf', fileSize: 1048576, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-18T10:15:00Z' },
      { id: 'doc-2', type: 'bac', label: 'Baccalauréat', fileName: 'Baccalaureat_2021.pdf', fileSize: 1248576, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-18T10:15:00Z' },
      { id: 'doc-3', type: 'licence', label: 'Diplôme de Licence', fileName: 'Diplome_Licence_SMI.pdf', fileSize: 1548576, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-18T10:16:00Z' },
      { id: 'doc-4', type: 'master', label: 'Diplôme de Master ou Attestation de Réussite', fileName: 'Attestation_Master_IDSI.pdf', fileSize: 1848576, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-18T10:16:00Z' },
      { id: 'doc-5', type: 'releves_notes', label: 'Relevés de notes de l\'ensemble du cursus (S1 à S4)', fileName: 'Releves_Notes_Complets.pdf', fileSize: 3148576, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-18T10:17:00Z' },
      { id: 'doc-6', type: 'cv', label: 'Curriculum Vitae détaillé', fileName: 'CV_Hajar_Amellah.pdf', fileSize: 848576, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-18T10:17:00Z' },
      { id: 'doc-7', type: 'lettre_motivation', label: 'Lettre de motivation', fileName: 'Lettre_Motivation.pdf', fileSize: 748576, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-18T10:18:00Z' },
      { id: 'doc-8', type: 'projet_recherche', label: 'Avant-projet de recherche de thèse (3 à 5 pages)', fileName: 'Projet_Recherche_Vision_Olivier.pdf', fileSize: 2248576, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-18T10:19:00Z' },
      { id: 'doc-9', type: 'attestation_non_travail', label: 'Attestation de non travail ou autorisation employeur', fileName: 'Attestation_Non_Travail.pdf', fileSize: 648576, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-18T10:19:00Z' }
    ],
    correctionRequests: [],
    statusHistory: [
      { id: 'sh-1', status: 'soumise', comment: 'Dossier soumis par la candidate avec accusé de réception.', changedBy: 'Hajar Amellah', timestamp: '2026-09-18T10:20:00Z' },
      { id: 'sh-2', status: 'en_cours_verification', comment: 'Instruction des pièces justificatives par le bureau doctoral.', changedBy: 'Karim Mansouri', timestamp: '2026-09-22T09:00:00Z' },
      { id: 'sh-3', status: 'recevable', comment: 'Dossier complet et certifié conforme. Éligibilité académique validée.', changedBy: 'Karim Mansouri', timestamp: '2026-09-25T11:30:00Z' },
      { id: 'sh-4', status: 'entretien_programme', comment: 'Candidature retenue pour l\'audition orale devant le jury de sélection.', changedBy: 'Pr. Mustapha El Ouazzani', timestamp: '2026-10-02T15:40:00Z' }
    ]
  },
  {
    id: 'app-002',
    referenceNumber: 'USMBA-DOC-2026-5120',
    candidateId: 'usr-candidat-2',
    candidateName: 'Mehdi Benjelloun',
    candidateEmail: 'mehdi.benjelloun@usmba.ac.ma',
    candidatePhone: '+212 6 70 88 99 00',
    cin: 'CD712390',
    cne: 'N138129845',
    subjectId: 'suj-002',
    subjectTitle: 'Optimisation Thermomécanique et Modélisation Numérique de Nouveaux Matériaux à Changement de Phase pour le Stockage Énergétique Solaire',
    laboratoryId: 'lerma',
    establishmentId: 'ensa',
    supervisorName: 'Pr. Fatima-Zahra BENCHEIKH',
    discipline: 'Physique des Matériaux',
    masterOriginUniversity: 'Université Sidi Mohamed Ben Abdellah - ENSA Fès',
    masterSpecialty: 'Génie Énergétique et Systèmes Solaires',
    masterGraduationYear: 2026,
    masterMention: 'Bien',
    status: 'correction_demandee',
    assignedReviewerId: 'usr-admin-1',
    assignedReviewerName: 'Karim Mansouri',
    submittedAt: '2026-09-22T16:00:00Z',
    updatedAt: '2026-09-27T10:00:00Z',
    documents: [
      { id: 'doc-21', type: 'cin', label: 'Carte d\'Identité Nationale (CIN)', fileName: 'CIN_Mehdi.pdf', fileSize: 948576, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-22T15:50:00Z' },
      { id: 'doc-22', type: 'bac', label: 'Baccalauréat', fileName: 'Bac.pdf', fileSize: 1100000, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-22T15:51:00Z' },
      { id: 'doc-23', type: 'licence', label: 'Diplôme de Licence', fileName: 'Licence.pdf', fileSize: 1300000, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-22T15:52:00Z' },
      { id: 'doc-24', type: 'master', label: 'Diplôme de Master ou Attestation', fileName: 'Attestation_Master.pdf', fileSize: 1200000, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-22T15:53:00Z' },
      { id: 'doc-25', type: 'releves_notes', label: 'Relevés de notes de l\'ensemble du cursus (S1 à S4)', fileName: 'releves_incomplets.pdf', fileSize: 500000, fileUrl: '#', isRequired: true, status: 'rejete', rejectionReason: 'Le relevé du semestre S4 manque le cachet officiel de l\'établissement d\'origine.', uploadedAt: '2026-09-22T15:54:00Z' },
      { id: 'doc-26', type: 'cv', label: 'Curriculum Vitae', fileName: 'CV.pdf', fileSize: 400000, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-22T15:55:00Z' },
      { id: 'doc-27', type: 'lettre_motivation', label: 'Lettre de motivation', fileName: 'Motivation.pdf', fileSize: 500000, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-22T15:56:00Z' },
      { id: 'doc-28', type: 'projet_recherche', label: 'Avant-projet de recherche de thèse', fileName: 'Projet.pdf', fileSize: 1500000, fileUrl: '#', isRequired: true, status: 'valide', uploadedAt: '2026-09-22T15:57:00Z' },
      { id: 'doc-29', type: 'attestation_non_travail', label: 'Attestation de non travail', fileName: '', fileSize: 0, fileUrl: '#', isRequired: true, status: 'manquant', rejectionReason: 'Document manquant obligatoire pour les étudiants non-salariés.' }
    ],
    correctionRequests: [
      {
        id: 'corr-001',
        applicationId: 'app-002',
        requestedBy: 'Karim Mansouri (Administration Scolarité)',
        requestedAt: '2026-09-27T10:00:00Z',
        deadline: '2026-11-15T23:59:59Z',
        comment: 'Pièce justificative non conforme et document manquant : veuillez impérativement fournir le relevé officiel S4 cacheté et l\'attestation de non travail délivrée par les autorités compétentes.',
        missingOrInvalidDocs: ['releves_notes', 'attestation_non_travail'],
        isResolved: false
      }
    ],
    statusHistory: [
      { id: 'sh-21', status: 'soumise', comment: 'Dépôt initial.', changedBy: 'Mehdi Benjelloun', timestamp: '2026-09-22T16:00:00Z' },
      { id: 'sh-22', status: 'incomplete', comment: 'Anomalies détectées lors du contrôle formel.', changedBy: 'Karim Mansouri', timestamp: '2026-09-27T09:45:00Z' },
      { id: 'sh-23', status: 'correction_demandee', comment: 'Demande officielle de régularisation adressée au candidat avec délai de 15 jours.', changedBy: 'Karim Mansouri', timestamp: '2026-09-27T10:00:00Z' }
    ]
  },
  {
    id: 'app-003',
    referenceNumber: 'USMBA-DOC-2026-9041',
    candidateId: 'usr-candidat-3',
    candidateName: 'Salma El Fassi',
    candidateEmail: 'salma.elfassi@gmail.com',
    candidatePhone: '+212 6 64 55 66 77',
    cin: 'CD908123',
    cne: 'N132456789',
    subjectId: 'suj-003',
    subjectTitle: 'Protocoles Cryptographiques Post-Quantiques et Architectures Zero-Trust pour la Sécurisation des Systèmes d\'Information Hospitaliers',
    laboratoryId: 'lim',
    establishmentId: 'fsdm',
    supervisorName: 'Pr. Mohammed ZOUHAIR',
    discipline: 'Cybersécurité',
    masterOriginUniversity: 'Université Sidi Mohamed Ben Abdellah - FSDM',
    masterSpecialty: 'Réseaux, Systèmes et Sécurité Informatique',
    masterGraduationYear: 2026,
    masterMention: 'Très Bien',
    status: 'admise',
    submittedAt: '2026-09-16T14:10:00Z',
    updatedAt: '2026-10-15T18:00:00Z',
    score: 19.0,
    rank: 1,
    documents: [
      { id: 'doc-31', type: 'cin', label: 'Carte d\'Identité Nationale (CIN)', fileName: 'CIN.pdf', fileSize: 800000, fileUrl: '#', isRequired: true, status: 'valide' },
      { id: 'doc-32', type: 'bac', label: 'Baccalauréat', fileName: 'Bac.pdf', fileSize: 900000, fileUrl: '#', isRequired: true, status: 'valide' },
      { id: 'doc-33', type: 'licence', label: 'Diplôme de Licence', fileName: 'Licence.pdf', fileSize: 1200000, fileUrl: '#', isRequired: true, status: 'valide' },
      { id: 'doc-34', type: 'master', label: 'Diplôme de Master', fileName: 'Master.pdf', fileSize: 1400000, fileUrl: '#', isRequired: true, status: 'valide' },
      { id: 'doc-35', type: 'releves_notes', label: 'Relevés de notes', fileName: 'Releves.pdf', fileSize: 2500000, fileUrl: '#', isRequired: true, status: 'valide' },
      { id: 'doc-36', type: 'cv', label: 'Curriculum Vitae', fileName: 'CV.pdf', fileSize: 600000, fileUrl: '#', isRequired: true, status: 'valide' },
      { id: 'doc-37', type: 'lettre_motivation', label: 'Lettre de motivation', fileName: 'Motivation.pdf', fileSize: 500000, fileUrl: '#', isRequired: true, status: 'valide' },
      { id: 'doc-38', type: 'projet_recherche', label: 'Projet de recherche', fileName: 'Projet_PostQuantique.pdf', fileSize: 1800000, fileUrl: '#', isRequired: true, status: 'valide' },
      { id: 'doc-39', type: 'attestation_non_travail', label: 'Attestation de non travail', fileName: 'NonTravail.pdf', fileSize: 400000, fileUrl: '#', isRequired: true, status: 'valide' }
    ],
    correctionRequests: [],
    statusHistory: [
      { id: 'sh-31', status: 'soumise', comment: 'Dossier soumis.', changedBy: 'Salma El Fassi', timestamp: '2026-09-16T14:10:00Z' },
      { id: 'sh-32', status: 'recevable', comment: 'Conformité validée.', changedBy: 'Karim Mansouri', timestamp: '2026-09-20T10:00:00Z' },
      { id: 'sh-33', status: 'entretien_programme', comment: 'Audition passée le 05/10/2026.', changedBy: 'Jury', timestamp: '2026-10-05T12:00:00Z' },
      { id: 'sh-34', status: 'admise', comment: 'Candidate classée 1ère sur liste principale (Admise).', changedBy: 'Jury / Pr. Mustapha El Ouazzani', timestamp: '2026-10-15T18:00:00Z' }
    ]
  }
];

export const INITIAL_INTERVIEW_SLOTS: InterviewSlot[] = [
  {
    id: 'slot-001',
    date: '2026-11-12',
    startTime: '09:00',
    endTime: '09:45',
    roomOrLink: 'Salle des Thèses 2 — Bâtiment Recherche FSDM / Google Meet : meet.google.com/gcd-fsdm-aud1',
    juryMemberNames: ['Pr. Abdelhafid EL ALAOUI', 'Pr. Mohammed ZOUHAIR', 'Pr. Rachid CHOUKRI'],
    applicationId: 'app-001',
    candidateName: 'Hajar Amellah',
    subjectTitle: 'Architectures d\'Apprentissage Profond et Vision par Ordinateur pour la Détection Précoce des Maladies des Cultures d\'Olivier au Maroc',
    isBooked: true,
    notificationSent: true
  },
  {
    id: 'slot-002',
    date: '2026-11-12',
    startTime: '10:00',
    endTime: '10:45',
    roomOrLink: 'Salle des Thèses 2 — Bâtiment Recherche FSDM',
    juryMemberNames: ['Pr. Abdelhafid EL ALAOUI', 'Pr. Mohammed ZOUHAIR', 'Pr. Rachid CHOUKRI'],
    isBooked: false,
    notificationSent: false
  },
  {
    id: 'slot-003',
    date: '2026-11-12',
    startTime: '11:00',
    endTime: '11:45',
    roomOrLink: 'Salle des Thèses 2 — Bâtiment Recherche FSDM',
    juryMemberNames: ['Pr. Abdelhafid EL ALAOUI', 'Pr. Mohammed ZOUHAIR', 'Pr. Rachid CHOUKRI'],
    isBooked: false,
    notificationSent: false
  },
  {
    id: 'slot-004',
    date: '2026-11-13',
    startTime: '14:30',
    endTime: '15:15',
    roomOrLink: 'Amphi Ibn Al-Banna — ENSA Fès',
    juryMemberNames: ['Pr. Fatima-Zahra BENCHEIKH', 'Pr. Karim ALAMI'],
    isBooked: false,
    notificationSent: false
  }
];

export const INITIAL_EVALUATIONS: CandidateEvaluation[] = [
  {
    id: 'eval-001',
    applicationId: 'app-001',
    evaluatorId: 'usr-chercheur-1',
    evaluatorName: 'Pr. Abdelhafid EL ALAOUI',
    evaluatorRole: 'enseignant_chercheur',
    academicDossierScore: 4.75,
    researchProposalScore: 4.5,
    interviewScore: 4.5,
    fitWithLaboratoryScore: 4.5,
    totalScore: 18.25,
    recommendation: 'favorable_fort',
    observations: 'Excellente candidate, maîtrise impressionnante des Vision Transformers et très forte motivation pour le terrain agronomique de la région Fès-Meknès.',
    submittedAt: '2026-10-10T16:00:00Z'
  },
  {
    id: 'eval-002',
    applicationId: 'app-003',
    evaluatorId: 'usr-jury-1',
    evaluatorName: 'Pr. Rachid CHOUKRI',
    evaluatorRole: 'jury',
    academicDossierScore: 4.8,
    researchProposalScore: 4.7,
    interviewScore: 4.8,
    fitWithLaboratoryScore: 4.7,
    totalScore: 19.0,
    recommendation: 'favorable_fort',
    observations: 'Parcours académique remarquable, maîtrise mathématique des algorithmes post-quantiques.',
    submittedAt: '2026-10-12T11:30:00Z'
  }
];

export const INITIAL_SELECTION_REPORT: SelectionReport = {
  id: 'pv-cedoc-2026-01',
  establishmentId: 'fsdm',
  laboratoryId: 'lisac',
  academicYear: '2026-2027',
  status: 'valide',
  currentVersion: 1,
  publishedAt: '2026-10-16T09:00:00Z',
  versions: [
    {
      version: 1,
      updatedAt: '2026-10-15T17:00:00Z',
      updatedBy: 'Pr. Abdelhafid EL ALAOUI (Président du Jury)',
      summary: 'Procès-verbal de délibération du concours doctoral 2026-2027 - Discipline Informatique & IA. Audition de 12 candidats, délibération conforme aux critères académiques.',
      totalAdmitted: 3,
      totalWaiting: 2,
      totalRejected: 7,
      isApproved: true,
      approvedBy: 'Pr. Mustapha El Ouazzani (Resp. Formation Doctorale)',
      approvedAt: '2026-10-15T18:30:00Z'
    }
  ],
  admittedApplicationIds: ['app-003', 'app-001'],
  waitingApplicationIds: [],
  rejectedApplicationIds: ['app-002']
};

export const INITIAL_ADMINISTRATIVE_REGISTRATIONS: AdministrativeRegistration[] = [
  {
    id: 'reg-001',
    applicationId: 'app-003',
    candidateId: 'usr-candidat-3',
    studentName: 'Salma El Fassi',
    cin: 'CD908123',
    cne: 'N132456789',
    subjectTitle: 'Protocoles Cryptographiques Post-Quantiques et Architectures Zero-Trust pour la Sécurisation des Systèmes d\'Information Hospitaliers',
    laboratoryId: 'lim',
    establishmentId: 'fsdm',
    supervisorName: 'Pr. Mohammed ZOUHAIR',
    academicYear: '2026-2027',
    status: 'en_cours_verification',
    documents: [
      { id: 'rd-1', label: 'Originaux des Diplômes (Baccalauréat, Licence, Master)', fileName: 'Originaux_Diplomes_Certifies.pdf', status: 'conforme', required: true },
      { id: 'rd-2', label: 'Charte des Thèses de l\'USMBA signée par les parties', fileName: 'Charte_Theses_Signee.pdf', status: 'conforme', required: true },
      { id: 'rd-3', label: 'Photos d\'identité récentes (Format passeport)', fileName: 'Photos_Identite.jpg', status: 'conforme', required: true },
      { id: 'rd-4', label: 'Attestation d\'assurance responsabilité civile étudiant', fileName: 'Attestation_Assurance_2026.pdf', status: 'fourni', required: true },
      { id: 'rd-5', label: 'Engagement sur l\'honneur de respect du règlement intérieur', fileName: 'Engagement_Reglement.pdf', status: 'fourni', required: true }
    ],
    notes: 'Dossier physique déposé le 20/10/2026. Contrôle de cohérence avec le dossier Apogée en cours.'
  }
];

export const INITIAL_ANNUAL_RE_REGISTRATIONS: AnnualReRegistration[] = [
  {
    id: 're-reg-001',
    studentId: 'usr-doctorant-1',
    studentName: 'Yassine Bennani',
    cin: 'CD554433',
    cne: 'N130099881',
    thesisYear: 3,
    academicYear: '2026-2027',
    supervisorId: 'usr-directeur-1',
    supervisorName: 'Pr. Mohammed ZOUHAIR',
    laboratoryId: 'lisac',
    thesisTitle: 'Apprentissage Fédéré pour la Préservation de la Confidentialité dans les Objets Connectés Médicaux',
    status: 'avis_directeur_donne',
    priority: 'normale',
    submittedAt: '2026-10-10T11:00:00Z',
    deadlineDate: '2026-11-30',
    progressSummary: 'Rédaction du 3ème chapitre de la thèse. Publication acceptée à la conférence internationale IEEE ISCC 2026.',
    articlesPublishedCount: 2,
    conferencesCount: 3,
    trainingHoursCompleted: 90,
    supervisorApproval: 'favorable',
    supervisorComment: 'Excellent travail de recherche. Les résultats expérimentaux sont solides et le doctorant respecte parfaitement l\'échéancier prévisionnel.',
    documents: [
      { id: 'rrd-1', label: 'Rapport d\'avancement annuel de recherche', fileName: 'Rapport_Avancement_An3_Yassine.pdf', status: 'conforme' },
      { id: 'rrd-2', label: 'Avis motivé du directeur de thèse signé', fileName: 'Avis_Directeur_Signe.pdf', status: 'conforme' },
      { id: 'rrd-3', label: 'Justificatif des 90 heures de formations transversales et scientifiques validées', fileName: 'Attestation_Formations_CEDoc.pdf', status: 'conforme' },
      { id: 'rrd-4', label: 'Reçu de paiement des frais d\'assurance', fileName: 'Recu_Assurance_2026.pdf', status: 'conforme' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    targetRole: 'candidat',
    userId: 'usr-candidat-1',
    title: 'Convocation à l\'entretien oral de sélection',
    message: 'Votre candidature pour le sujet "Architectures d\'Apprentissage Profond..." a été retenue pour l\'audition orale du 12 Novembre 2026 à 09h00.',
    category: 'entretien',
    link: '/candidat/convocation',
    isRead: false,
    createdAt: '2026-10-02T15:45:00Z'
  },
  {
    id: 'notif-2',
    targetRole: 'candidat',
    userId: 'usr-candidat-2',
    title: 'Demande urgente de correction de dossier',
    message: 'Votre dossier USMBA-DOC-2026-5120 comporte des pièces non conformes. Vous avez jusqu\'au 15 Novembre 2026 pour soumettre les justificatifs.',
    category: 'candidature',
    link: '/candidat/corrections',
    isRead: false,
    createdAt: '2026-09-27T10:05:00Z'
  },
  {
    id: 'notif-3',
    targetRole: 'responsable_labo',
    userId: 'usr-labo-1',
    title: 'Nouveau sujet doctoral en attente de validation',
    message: 'Le Pr. Meryem KABBAJ a soumis le sujet "Gouvernance des Données et Impact de l\'IA...". Veuillez valider ou demander des corrections.',
    category: 'sujet',
    link: '/labo/validation-sujets',
    isRead: false,
    createdAt: '2026-09-28T14:05:00Z'
  },
  {
    id: 'notif-4',
    targetRole: 'administration',
    title: 'Régularisation de dossier reçue',
    message: '3 nouveaux dossiers de candidature ont été déposés sur la plateforme et sont prêts pour le contrôle de recevabilité.',
    category: 'candidature',
    link: '/administration/dossiers',
    isRead: true,
    createdAt: '2026-10-01T08:00:00Z'
  }
];

export const INITIAL_MESSAGES: PlatformMessage[] = [
  {
    id: 'msg-1',
    senderId: 'usr-admin-1',
    senderName: 'Karim Mansouri (Administration Scolarité)',
    senderRole: 'administration',
    recipientId: 'usr-candidat-2',
    recipientName: 'Mehdi Benjelloun',
    subject: 'Objet : Rectification Relevé de Notes S4 — Dossier USMBA-DOC-2026-5120',
    content: 'Bonjour M. Benjelloun,\n\nNous avons bien reçu votre dossier de candidature. Toutefois, le document téléversé pour le semestre 4 ne comporte pas le cachet sec de votre faculté d\'origine. Merci de le re-scanner et de le déposer dans votre Espace Corrections avant l\'expiration du délai légal.\n\nCordialement,\nService des Études Doctorales — USMBA Fès',
    relatedEntityId: 'USMBA-DOC-2026-5120',
    isRead: false,
    createdAt: '2026-09-27T10:15:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    userId: 'usr-candidat-1',
    userName: 'Hajar Amellah',
    userRole: 'candidat',
    action: 'DÉPÔT_CANDIDATURE',
    entityType: 'candidature',
    entityId: 'USMBA-DOC-2026-7842',
    details: 'Soumission du dossier complet avec 9 pièces justificatives conformes pour le sujet suj-001.',
    ipAddress: '196.200.142.50',
    timestamp: '2026-09-18T10:20:00Z'
  },
  {
    id: 'log-002',
    userId: 'usr-admin-1',
    userName: 'Karim Mansouri',
    userRole: 'administration',
    action: 'VALIDATION_RECEVABILITE',
    entityType: 'candidature',
    entityId: 'USMBA-DOC-2026-7842',
    details: 'Contrôle des pièces justificatives effectué avec succès. Statut passé à "Recevable".',
    ipAddress: '10.20.1.45',
    timestamp: '2026-09-25T11:30:00Z'
  },
  {
    id: 'log-003',
    userId: 'usr-formation-1',
    userName: 'Pr. Mustapha El Ouazzani',
    userRole: 'responsable_formation',
    action: 'PROGRAMMATION_ENTRETIEN',
    entityType: 'entretien',
    entityId: 'slot-001',
    details: 'Attribution du créneau d\'audition le 12/11/2026 à 09h00 pour la candidate Hajar Amellah. Convocation générée.',
    ipAddress: '10.20.1.18',
    timestamp: '2026-10-02T15:40:00Z'
  },
  {
    id: 'log-004',
    userId: 'usr-labo-1',
    userName: 'Pr. Fatima-Zahra BENCHEIKH',
    userRole: 'responsable_labo',
    action: 'VALIDATION_SUJET_THESE',
    entityType: 'sujet',
    entityId: 'suj-002',
    details: 'Approbation formelle du sujet proposé pour le laboratoire LERMA.',
    ipAddress: '196.200.140.12',
    timestamp: '2026-09-06T09:15:00Z'
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'candidature',
    question: 'Quelles sont les conditions requises pour postuler à un doctorat à l\'USMBA ?',
    answer: 'Être titulaire d\'un Master, Master Spécialisé, Diplôme d\'Ingénieur d\'État ou équivalent reconnu par le Ministère, avec une mention minimale "Assez Bien" ou un cursus académique validé selon les critères du Centre d\'Études Doctorales (CEDoc).',
    officialRef: 'Cahier des Normes Pédagogiques Nationales du Cycle Doctoral (Décret n° 2-23-64)',
    keywords: ['conditions', 'diplômes', 'master', 'ingénieur', 'mention']
  },
  {
    id: 'faq-2',
    category: 'candidature',
    question: 'Combien de sujets de thèse un candidat peut-il choisir ?',
    answer: 'La réglementation autorise un candidat à déposer un maximum de DEUX (2) dossiers de candidature sur deux sujets distincts au sein des laboratoires de l\'USMBA pour une même session annuelle.',
    officialRef: 'Règlement Intérieur du CEDoc USMBA 2026',
    keywords: ['sujets', 'limite', 'candidature', 'choix']
  },
  {
    id: 'faq-3',
    category: 'selection',
    question: 'Comment se déroule la sélection et le calcul de la note finale ?',
    answer: 'La sélection comprend : 1) Examen du dossier académique (sur 5 pts), 2) Pertinence et rigueur du projet de recherche (sur 5 pts), 3) Audition orale devant le jury (sur 5 pts), 4) Adéquation avec les axes du laboratoire (sur 5 pts). Total sur 20 points. Le seuil de recevabilité pour la liste principale est fixé par délibération du jury.',
    officialRef: 'Grille d\'évaluation commune CEDoc USMBA',
    keywords: ['selection', 'grille', 'notes', 'audition', 'jury', 'bareme']
  },
  {
    id: 'faq-4',
    category: 'inscription',
    question: 'Quelles pièces fournir lors de l\'inscription administrative définitive ?',
    answer: 'Les admis doivent fournir : les diplômes originaux (Bac, Licence, Master), 4 photos d\'identité récentes, la Charte de Thèse signée par le candidat, le directeur de thèse et le directeur du laboratoire, l\'attestation d\'assurance civile et l\'engagement sur l\'honneur.',
    officialRef: 'Guide d\'accueil du Doctorant USMBA 2026',
    keywords: ['inscription', 'pieces', 'originaux', 'charte', 'assurance']
  },
  {
    id: 'faq-5',
    category: 'reinscription',
    question: 'Quand a lieu la campagne de réinscription annuelle pour les doctorants ?',
    answer: 'La campagne se déroule chaque année entre le 15 Septembre et le 30 Novembre. Elle nécessite obligatoirement un rapport d\'avancement visé par le directeur de thèse et la justification des formations doctorales suivies (au moins 200 heures au cours des 3 ans).',
    officialRef: 'Procédure CEDoc USMBA — Réinscriptions 2e à 6e année',
    keywords: ['reinscription', 'delai', 'rapport', 'directeur', 'heures', 'formations']
  },
  {
    id: 'faq-6',
    category: 'technique',
    question: 'Que faire en cas de rejet d\'un document ou si mon dossier est marqué "Incomplet" ?',
    answer: 'Rendez-vous dans votre espace candidat sous l\'onglet "Mes Corrections". Vous y trouverez la notification administrative précisant le motif de rejet et la date limite pour remplacer le fichier non conforme.',
    officialRef: 'Service Technique GCD USMBA',
    keywords: ['correction', 'rejet', 'dossier', 'document', 'remplacement']
  }
];

export const INITIAL_DOCTORAL_RULES: DoctoralRule[] = [
  {
    id: 'rule-1',
    code: 'REG-DIP-MASTER',
    title: 'Condition d\'éligibilité du diplôme d\'accès',
    category: 'admission',
    description: 'Le candidat doit être titulaire d\'un Master, Master Recherche ou Master Spécialisé délivré par une université marocaine ou d\'un diplôme reconnu équivalent.',
    conditionDescription: 'Diplôme de Master ou diplôme étranger avec arrêté d\'équivalence ministériel publié au BO.',
    minimumScoreThreshold: 12.0,
    isActive: true,
    createdBy: 'CEDoc USMBA',
    updatedAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'rule-2',
    code: 'REG-DELAI-CORRECTION',
    title: 'Délai maximum de régularisation des pièces manquantes',
    category: 'delais',
    description: 'En cas de notification de dossier incomplet ou non conforme par le service de scolarité, le candidat dispose de 5 jours ouvrés pour soumettre les justificatifs corrigés.',
    conditionDescription: 'Au-delà de 5 jours ouvrés sans correction, le dossier passe automatiquement au statut "Non recevable".',
    deadlineDate: '2026-11-25',
    isActive: true,
    createdBy: 'Commission d\'Instruction Administrative',
    updatedAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'rule-3',
    code: 'REG-PIECES-OBLIGATOIRES',
    title: 'Nomenclature des pièces obligatoires pour la recevabilité',
    category: 'pieces_justificatives',
    description: 'Le dossier en ligne doit comporter obligatoirement : CIN scannée, Diplômes du Bac/Licence/Master, Relevés de notes S1 à S4, CV actualisé et Projet de recherche.',
    conditionDescription: 'Tout dossier dépourvu de relevés de notes complets ou de projet de recherche est rejeté sans examen par le jury.',
    mandatoryDocuments: ['cin', 'bac', 'licence', 'master', 'releves_notes', 'cv', 'projet_recherche'],
    isActive: true,
    createdBy: 'CEDoc USMBA',
    updatedAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'rule-4',
    code: 'REG-SEUIL-ADMISSION',
    title: 'Seuil minimal d\'admission sur liste principale',
    category: 'seuils_selection',
    description: 'La note globale attribuée par le jury de sélection (dossier académique + projet + audition orale) doit être strictement supérieure ou égale à 14/20 pour une admission directe.',
    conditionDescription: 'Note finale >= 14/20 pour la Liste Principale. Les notes entre 12/20 et 13.99/20 sont classées sur Liste d\'Attente.',
    minimumScoreThreshold: 14.0,
    isActive: true,
    createdBy: 'Conseil du CEDoc',
    updatedAt: '2026-10-01T12:00:00Z'
  },
  {
    id: 'rule-5',
    code: 'REG-REINSCRIPTION-HEURES',
    title: 'Volume horaire de formation complémentaire pour réinscription',
    category: 'reinscription',
    description: 'Chaque doctorant doit justifier d\'au moins 60 heures de formations transversales et scientifiques validées pour être autorisé à se réinscrire en 3e année.',
    conditionDescription: 'Validation obligatoire du rapport annuel d\'avancement par le directeur de thèse et attestation des heures de formation.',
    isActive: true,
    createdBy: 'Pôle Doctorat USMBA',
    updatedAt: '2026-09-10T09:00:00Z'
  }
];

export const INITIAL_DOCTORAL_CAMPAIGNS: DoctoralCampaign[] = [
  {
    id: 'camp-2026-2027',
    code: 'CAMP-USMBA-2026-2027',
    title: 'Campagne Doctorale Officielle 2026-2027',
    academicYear: '2026-2027',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    status: 'ouverte',
    totalQuota: 240,
    openEstablishments: ['fsdm', 'ensa', 'fsjes', 'flsh', 'fmpf', 'est'],
    currentApplicationsCount: 48,
    admittedCount: 22,
    description: 'Campagne annuelle d\'admission et d\'inscription au cycle doctoral des formations doctorales rattachées au CEDoc USMBA.',
    createdAt: '2026-09-15T08:00:00Z'
  },
  {
    id: 'camp-2025-2026',
    code: 'CAMP-USMBA-2025-2026',
    title: 'Campagne Doctorale 2025-2026 (Archivée)',
    academicYear: '2025-2026',
    startDate: '2025-10-01',
    endDate: '2025-11-30',
    status: 'cloturee',
    totalQuota: 220,
    openEstablishments: ['fsdm', 'ensa', 'fsjes', 'flsh', 'fmpf', 'est'],
    currentApplicationsCount: 310,
    admittedCount: 198,
    description: 'Campagne doctorale précédente archivée.',
    createdAt: '2025-09-15T08:00:00Z'
  }
];
