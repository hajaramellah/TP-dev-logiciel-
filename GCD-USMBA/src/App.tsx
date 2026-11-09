import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Public pages
import { Home } from './pages/public/Home';
import { Catalog } from './pages/public/Catalog';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { AccountActivation } from './pages/public/AccountActivation';
import { PasswordRecovery } from './pages/public/PasswordRecovery';
import { FaqHelp } from './pages/public/FaqHelp';

// Candidat pages
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { CandidateApplicationForm } from './pages/candidate/CandidateApplicationForm';
import { CandidateApplicationDetail } from './pages/candidate/CandidateApplicationDetail';
import { CandidateCorrectionWorkspace } from './pages/candidate/CandidateCorrectionWorkspace';
import { CandidateInterviewView } from './pages/candidate/CandidateInterviewView';
import { CandidateResultsView } from './pages/candidate/CandidateResultsView';
import { CandidateRegistrationChecklist } from './pages/candidate/CandidateRegistrationChecklist';

// Enseignant-chercheur pages
import { ResearcherDashboard } from './pages/researcher/ResearcherDashboard';
import { ProposeSubjectForm } from './pages/researcher/ProposeSubjectForm';
import { ResearcherApplications } from './pages/researcher/ResearcherApplications';

// Lab Manager pages
import { LabManagerDashboard } from './pages/lab_manager/LabManagerDashboard';

// Administration pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminApplicationsQueue } from './pages/admin/AdminApplicationsQueue';
import { AdminPublishResults } from './pages/admin/AdminPublishResults';
import { AdminRegistrationQueue } from './pages/admin/AdminRegistrationQueue';
import { AdminReRegistrationQueue } from './pages/admin/AdminReRegistrationQueue';
import { AdminMessaging } from './pages/admin/AdminMessaging';

// Formation Doctorale pages
import { InterviewScheduler } from './pages/doctoral_manager/InterviewScheduler';
import { ReportValidation } from './pages/doctoral_manager/ReportValidation';

// Jury pages
import { JuryEvaluationForm } from './pages/jury/JuryEvaluationForm';
import { JuryDeliberationWorkspace } from './pages/jury/JuryDeliberationWorkspace';

// Doctorant pages
import { DoctorantDashboard } from './pages/doctorant/DoctorantDashboard';

// Directeur de thèse pages
import { SupervisorDashboard } from './pages/supervisor/SupervisorDashboard';

// SuperAdmin / Plateforme GCD pages
import { UserRoleManagement } from './pages/platform_admin/UserRoleManagement';
import { AuditLogViewer } from './pages/platform_admin/AuditLogViewer';
import { PlatformIndicators } from './pages/platform_admin/PlatformIndicators';
import { ProcessCoordination } from './pages/platform_admin/ProcessCoordination';
import { RulesManagement } from './pages/platform_admin/RulesManagement';
import { CampaignManagement } from './pages/platform_admin/CampaignManagement';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Hide sidebar on clean landing home page if desired, or keep available everywhere
  const isHome = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex w-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/sujets" element={<Catalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/activation" element={<AccountActivation />} />
            <Route path="/mot-de-passe-oublie" element={<PasswordRecovery />} />
            <Route path="/faq-aide" element={<FaqHelp />} />
            <Route path="/messagerie" element={<AdminMessaging />} />

            {/* Candidat Routes */}
            <Route path="/candidat/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidat/postuler" element={<CandidateApplicationForm />} />
            <Route path="/candidat/mon-dossier" element={<CandidateApplicationDetail />} />
            <Route path="/candidat/corrections" element={<CandidateCorrectionWorkspace />} />
            <Route path="/candidat/convocation" element={<CandidateInterviewView />} />
            <Route path="/candidat/resultats" element={<CandidateResultsView />} />
            <Route path="/candidat/inscription-administrative" element={<CandidateRegistrationChecklist />} />

            {/* Chercheur Routes */}
            <Route path="/chercheur/dashboard" element={<ResearcherDashboard />} />
            <Route path="/chercheur/proposer-sujet" element={<ProposeSubjectForm />} />
            <Route path="/chercheur/candidatures" element={<ResearcherApplications />} />

            {/* Laboratoire Routes */}
            <Route path="/labo/dashboard" element={<LabManagerDashboard />} />
            <Route path="/labo/validation-sujets" element={<LabManagerDashboard />} />

            {/* Administration Routes */}
            <Route path="/administration/dashboard" element={<AdminDashboard />} />
            <Route path="/administration/dossiers" element={<AdminApplicationsQueue />} />
            <Route path="/administration/publication-resultats" element={<AdminPublishResults />} />
            <Route path="/administration/inscriptions" element={<AdminRegistrationQueue />} />
            <Route path="/administration/reinscriptions" element={<AdminReRegistrationQueue />} />

            {/* Formation Doctorale Routes */}
            <Route path="/formation/dashboard" element={<InterviewScheduler />} />
            <Route path="/formation/entretiens" element={<InterviewScheduler />} />
            <Route path="/formation/pv-validation" element={<ReportValidation />} />

            {/* Jury Routes */}
            <Route path="/jury/dashboard" element={<JuryDeliberationWorkspace />} />
            <Route path="/jury/evaluer" element={<JuryEvaluationForm />} />
            <Route path="/jury/deliberations" element={<JuryDeliberationWorkspace />} />

            {/* Doctorant Routes */}
            <Route path="/doctorant/dashboard" element={<DoctorantDashboard />} />
            <Route path="/doctorant/reinscription" element={<DoctorantDashboard />} />

            {/* Directeur de thèse Routes */}
            <Route path="/directeur/dashboard" element={<SupervisorDashboard />} />
            <Route path="/directeur/doctorants" element={<SupervisorDashboard />} />

            {/* SuperAdmin / GCD Routes */}
            <Route path="/superadmin/dashboard" element={<PlatformIndicators />} />
            <Route path="/superadmin/regles" element={<RulesManagement />} />
            <Route path="/superadmin/campagnes" element={<CampaignManagement />} />
            <Route path="/superadmin/utilisateurs" element={<UserRoleManagement />} />
            <Route path="/superadmin/audit-logs" element={<AuditLogViewer />} />
            <Route path="/superadmin/indicateurs" element={<PlatformIndicators />} />
            <Route path="/superadmin/coordination-processus" element={<ProcessCoordination />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
