-- ====================================================================
-- GCD USMBA — Schema Relationnel de Base de Données (PostgreSQL / Supabase)
-- Plateforme de Gestion du Cycle Doctoral (CEDoc - Université Sidi Mohamed Ben Abdellah)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Établissements & Laboratoires
CREATE TABLE establishments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Fès',
    code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE laboratories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    establishment_id VARCHAR(50) REFERENCES establishments(id) ON DELETE CASCADE,
    director_name VARCHAR(150) NOT NULL,
    disciplines TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Utilisateurs & Gestion RBAC (Activité 1, 33)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cin VARCHAR(20) UNIQUE NOT NULL,
    cne VARCHAR(30),
    phone VARCHAR(30) NOT NULL,
    establishment_id VARCHAR(50) REFERENCES establishments(id),
    laboratory_id VARCHAR(50) REFERENCES laboratories(id),
    roles TEXT[] NOT NULL DEFAULT ARRAY['candidat'],
    current_role VARCHAR(50) NOT NULL DEFAULT 'candidat',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sujets de Recherche Doctorale (Activités 4, 5, 6)
CREATE TYPE subject_status AS ENUM (
    'brouillon',
    'soumis',
    'en_attente_validation',
    'correction_demandee',
    'valide',
    'rejete'
);

CREATE TABLE doctoral_subjects (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    discipline VARCHAR(100) NOT NULL,
    establishment_id VARCHAR(50) REFERENCES establishments(id),
    laboratory_id VARCHAR(50) REFERENCES laboratories(id),
    supervisor_id UUID REFERENCES users(id),
    supervisor_name VARCHAR(150) NOT NULL,
    co_supervisor_name VARCHAR(150),
    abstract TEXT NOT NULL,
    prerequisites TEXT NOT NULL,
    objectives TEXT NOT NULL,
    methodology TEXT,
    keywords TEXT[] NOT NULL,
    max_candidates INT NOT NULL DEFAULT 1,
    status subject_status NOT NULL DEFAULT 'en_attente_validation',
    rejection_reason TEXT,
    correction_comment TEXT,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    validation_date TIMESTAMP WITH TIME ZONE,
    academic_year VARCHAR(20) NOT NULL DEFAULT '2026-2027'
);

-- 4. Candidatures & Contrôle de Conformité (Activités 7, 8, 9, 10, 11, 12, 13)
CREATE TYPE application_status AS ENUM (
    'brouillon',
    'soumise',
    'en_cours_verification',
    'incomplete',
    'correction_demandee',
    'corrigee',
    'recevable',
    'en_cours_evaluation',
    'entretien_programme',
    'en_attente_decision',
    'admise',
    'liste_attente',
    'non_admise'
);

CREATE TABLE applications (
    id VARCHAR(50) PRIMARY KEY,
    reference_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. USMBA-DOC-2026-XXXX
    candidate_id UUID REFERENCES users(id),
    candidate_name VARCHAR(150) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    candidate_phone VARCHAR(30) NOT NULL,
    cin VARCHAR(20) NOT NULL,
    cne VARCHAR(30),
    subject_id VARCHAR(50) REFERENCES doctoral_subjects(id),
    subject_title VARCHAR(500) NOT NULL,
    laboratory_id VARCHAR(50) REFERENCES laboratories(id),
    establishment_id VARCHAR(50) REFERENCES establishments(id),
    supervisor_name VARCHAR(150) NOT NULL,
    discipline VARCHAR(100) NOT NULL,
    master_origin_university VARCHAR(255) NOT NULL,
    master_specialty VARCHAR(255) NOT NULL,
    master_graduation_year INT NOT NULL,
    master_mention VARCHAR(50) NOT NULL,
    status application_status NOT NULL DEFAULT 'soumise',
    assigned_reviewer_id UUID REFERENCES users(id),
    assigned_reviewer_name VARCHAR(150),
    score NUMERIC(4, 2), -- sur 20
    rank INT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE application_documents (
    id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) REFERENCES applications(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    label VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_url TEXT NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'en_attente', -- valide, rejete, manquant, en_attente
    rejection_reason TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Demandes de Correction & Historique des Statuts (Activités 11, 12, 13)
CREATE TABLE correction_requests (
    id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) REFERENCES applications(id) ON DELETE CASCADE,
    requested_by VARCHAR(150) NOT NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    comment TEXT NOT NULL,
    missing_docs TEXT[] NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE application_status_history (
    id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) REFERENCES applications(id) ON DELETE CASCADE,
    status application_status NOT NULL,
    comment TEXT,
    changed_by VARCHAR(150) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Entretiens, Grille d'Évaluation sur 20 & Procès-Verbaux (Activités 15, 16, 17, 18, 19, 20, 21)
CREATE TABLE interview_slots (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_or_link VARCHAR(255) NOT NULL,
    jury_member_names TEXT[] NOT NULL,
    application_id VARCHAR(50) REFERENCES applications(id),
    candidate_name VARCHAR(150),
    subject_title VARCHAR(500),
    is_booked BOOLEAN NOT NULL DEFAULT FALSE,
    notification_sent BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE candidate_evaluations (
    id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) REFERENCES applications(id) ON DELETE CASCADE,
    evaluator_id UUID REFERENCES users(id),
    evaluator_name VARCHAR(150) NOT NULL,
    evaluator_role VARCHAR(50) NOT NULL,
    academic_dossier_score NUMERIC(3, 2) NOT NULL, -- /5
    research_proposal_score NUMERIC(3, 2) NOT NULL, -- /5
    interview_score NUMERIC(3, 2) NOT NULL, -- /5
    fit_with_laboratory_score NUMERIC(3, 2) NOT NULL, -- /5
    total_score NUMERIC(4, 2) NOT NULL, -- /20
    recommendation VARCHAR(50) NOT NULL,
    observations TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE selection_reports (
    id VARCHAR(50) PRIMARY KEY,
    establishment_id VARCHAR(50) REFERENCES establishments(id),
    laboratory_id VARCHAR(50) REFERENCES laboratories(id),
    academic_year VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'brouillon',
    current_version INT NOT NULL DEFAULT 1,
    admitted_application_ids TEXT[] NOT NULL,
    waiting_application_ids TEXT[] NOT NULL,
    rejected_application_ids TEXT[] NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- 7. Inscriptions Administratives & Réinscriptions Annuelles (Activités 23, 24, 25, 26, 27, 28, 29, 30)
CREATE TABLE administrative_registrations (
    id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) REFERENCES applications(id),
    candidate_id UUID REFERENCES users(id),
    student_name VARCHAR(150) NOT NULL,
    cin VARCHAR(20) NOT NULL,
    cne VARCHAR(30),
    subject_title VARCHAR(500) NOT NULL,
    laboratory_id VARCHAR(50) REFERENCES laboratories(id),
    establishment_id VARCHAR(50) REFERENCES establishments(id),
    supervisor_name VARCHAR(150) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'en_cours_verification',
    validated_at TIMESTAMP WITH TIME ZONE,
    validated_by VARCHAR(150)
);

CREATE TABLE annual_re_registrations (
    id VARCHAR(50) PRIMARY KEY,
    student_id UUID REFERENCES users(id),
    student_name VARCHAR(150) NOT NULL,
    cin VARCHAR(20) NOT NULL,
    cne VARCHAR(30),
    thesis_year INT NOT NULL, -- 2 à 6
    academic_year VARCHAR(20) NOT NULL,
    supervisor_id UUID REFERENCES users(id),
    supervisor_name VARCHAR(150) NOT NULL,
    laboratory_id VARCHAR(50) REFERENCES laboratories(id),
    thesis_title VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'soumis',
    priority VARCHAR(50) NOT NULL DEFAULT 'normale',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deadline_date DATE NOT NULL,
    progress_summary TEXT NOT NULL,
    articles_published_count INT NOT NULL DEFAULT 0,
    conferences_count INT NOT NULL DEFAULT 0,
    training_hours_completed INT NOT NULL DEFAULT 0,
    supervisor_approval VARCHAR(50) NOT NULL DEFAULT 'en_attente',
    supervisor_comment TEXT
);

-- 8. Notifications, Messagerie, Journal d'Audit & FAQ (Activités 31, 32, 34)
CREATE TABLE audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE annual_re_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
