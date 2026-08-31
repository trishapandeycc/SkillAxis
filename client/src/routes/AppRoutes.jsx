import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../Pages/landingPage/LandingPage";
import Login from "../Pages/Auth/Login";
import Layout from "../components/layout";
import ProtectedRoute from "../components/ProtectedRoute";

// =========================
// ADMIN
// =========================

import AdminDashboard from "../Pages/Admin/AdminDashboard";
import FeatureTrainer from "../Pages/Admin/feature-trainer";
import FeatureTrainee from "../Pages/Admin/feature-trainee";
import FeatureAttendance from "../Pages/Admin/feature-attendance";
import FeatureAssesment from "../Pages/Admin/feature-assesment";
import FeatureSessions from "../Pages/Admin/feature-sessions";
import FeatureProgress from "../Pages/Admin/feature-progress";
import FeatureReports from "../Pages/Admin/feature-report";
import AdminProfile from "../Pages/Admin/feature-profile";

// =========================
// TRAINER
// =========================

import TrainerDashboard from "../Pages/Trainer/TrainerDashboard";
import TrainerSessions from "../Pages/Trainer/TrainerSession";
import TrainerTeams from "../Pages/Trainer/TrainerTeams";
import TrainerTrainees from "../Pages/Trainer/TrainerTrainees";
import TrainerAttendance from "../Pages/Trainer/TrainerAttendance";
import TrainerAssessments from "../Pages/Trainer/TrainerAssessments";
import TrainerResources from "../Pages/Trainer/TrainerResources";
import TrainerAllAssessments from "../Pages/Trainer/TrainerAllAssessments";
import TrainerProgress from "../Pages/Trainer/TrainerProgress";
import TrainerProfile from "../Pages/Trainer/TrainerProfile";

// =========================
// TRAINEE
// =========================

import TraineeDashboard from "../Pages/Trainee/TraineeDashboard";
import TraineeSessions from "../Pages/Trainee/TraineeSessions";
import TraineeAttendance from "../Pages/Trainee/TraineeAttendance";
import TraineeAssessments from "../Pages/Trainee/TraineeAssessments";
import TraineeTeams from "../Pages/Trainee/TraineeTeams";
import TraineeResources from "../Pages/Trainee/TraineeResources";
import TraineeProfile from "../Pages/Trainee/TraineeProfile";

function AppRoutes() {
  return (
    <Routes>
      <>
        // ========================= // LANDING PAGE //
        =========================
        <Route path="/" element={<LandingPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
      </>
      {/* =========================
          LOGIN
      ========================= */}

      <Route path="/login" element={<Login />} />

      {/* =========================
          ADMIN ROUTES
      ========================= */}

      <Route element={<ProtectedRoute allowedRole="Admin" />}>
        <Route
          path="/admin"
          element={
            <Layout role="Admin">
              <AdminDashboard />
            </Layout>
          }
        />

        <Route
          path="/admin/trainers"
          element={
            <Layout role="Admin">
              <FeatureTrainer />
            </Layout>
          }
        />

        <Route
          path="/admin/trainees"
          element={
            <Layout role="Admin">
              <FeatureTrainee />
            </Layout>
          }
        />

        <Route
          path="/admin/attendance"
          element={
            <Layout role="Admin">
              <FeatureAttendance />
            </Layout>
          }
        />

        <Route
          path="/admin/assessments"
          element={
            <Layout role="Admin">
              <FeatureAssesment />
            </Layout>
          }
        />

        <Route
          path="/admin/sessions"
          element={
            <Layout role="Admin">
              <FeatureSessions />
            </Layout>
          }
        />

        <Route
          path="/admin/progress"
          element={
            <Layout role="Admin">
              <FeatureProgress />
            </Layout>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <Layout role="Admin">
              <FeatureReports />
            </Layout>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <Layout role="Admin">
              <AdminProfile />
            </Layout>
          }
        />
      </Route>

      {/* =========================
          TRAINER ROUTES
      ========================= */}

      <Route element={<ProtectedRoute allowedRole="Trainer" />}>
        <Route
          path="/trainer/dashboard"
          element={
            <Layout role="Trainer">
              <TrainerDashboard />
            </Layout>
          }
        />

        <Route
          path="/trainer/sessions"
          element={
            <Layout role="Trainer">
              <TrainerSessions />
            </Layout>
          }
        />

        <Route
          path="/trainer/teams"
          element={
            <Layout role="Trainer">
              <TrainerTeams />
            </Layout>
          }
        />

        <Route
          path="/trainer/trainees"
          element={
            <Layout role="Trainer">
              <TrainerTrainees />
            </Layout>
          }
        />

        <Route
          path="/trainer/attendance"
          element={
            <Layout role="Trainer">
              <TrainerAttendance />
            </Layout>
          }
        />

        <Route
          path="/trainer/assessments"
          element={
            <Layout role="Trainer">
              <TrainerAssessments />
            </Layout>
          }
        />

        <Route
          path="/trainer/resources"
          element={
            <Layout role="Trainer">
              <TrainerResources />
            </Layout>
          }
        />

        <Route
          path="/trainer/assessments/all"
          element={
            <Layout role="Trainer">
              <TrainerAllAssessments />
            </Layout>
          }
        />

        <Route
          path="/trainer/progress"
          element={
            <Layout role="Trainer">
              <TrainerProgress />
            </Layout>
          }
        />

        <Route
          path="/trainer/profile"
          element={
            <Layout role="Trainer">
              <TrainerProfile />
            </Layout>
          }
        />
      </Route>

      {/* =========================
          TRAINEE ROUTES
      ========================= */}

      <Route element={<ProtectedRoute allowedRole="Trainee" />}>
        <Route
          path="/trainee/dashboard"
          element={
            <Layout role="Trainee">
              <TraineeDashboard />
            </Layout>
          }
        />

        <Route
          path="/trainee/sessions"
          element={
            <Layout role="Trainee">
              <TraineeSessions />
            </Layout>
          }
        />

        <Route
          path="/trainee/attendance"
          element={
            <Layout role="Trainee">
              <TraineeAttendance />
            </Layout>
          }
        />

        <Route
          path="/trainee/assessments"
          element={
            <Layout role="Trainee">
              <TraineeAssessments />
            </Layout>
          }
        />

        <Route
          path="/trainee/teams"
          element={
            <Layout role="Trainee">
              <TraineeTeams />
            </Layout>
          }
        />

        <Route
          path="/trainee/resources"
          element={
            <Layout role="Trainee">
              <TraineeResources />
            </Layout>
          }
        />

        <Route
          path="/trainee/profile"
          element={
            <Layout role="Trainee">
              <TraineeProfile />
            </Layout>
          }
        />
      </Route>

      {/* =========================
          DEFAULT ROUTE
      ========================= */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
