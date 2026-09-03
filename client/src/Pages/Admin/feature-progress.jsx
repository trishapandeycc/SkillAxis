
import { useMemo, useState } from "react";
import {
  FaChartLine,
  FaUsers,
  FaChalkboardTeacher,
  FaCalendarCheck,
  FaClipboardCheck,
  FaSearch,
  FaEye,
  FaTimes,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import { sessions } from "../../Info/sessionData";
import { assessments } from "../../Info/assessmentData";

import "./feature-progress.css";

function Progress({ role = "Admin" }) {
  const [activeTab, setActiveTab] = useState("trainees");
  const [search, setSearch] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);

  /* =====================================================
     TRAINER PROGRESS
     ===================================================== */

  const trainerProgress = useMemo(() => {
    const trainerIds = [
      ...new Set(sessions.map((session) => session.trainerId)),
    ];

    return trainerIds.map((trainerId) => {
      const trainerSessions = sessions.filter(
        (session) => session.trainerId === trainerId
      );

      const completedSessions = trainerSessions.filter(
        (session) => session.status === "Completed"
      ).length;

      const upcomingSessions = trainerSessions.filter(
        (session) => session.status === "Upcoming"
      ).length;

      const trainees = [
        ...new Set(
          trainerSessions.flatMap((session) => session.traineeIds || [])
        ),
      ];

      const progress =
        trainerSessions.length > 0
          ? Math.round(
              (completedSessions / trainerSessions.length) * 100
            )
          : 0;

      return {
        id: trainerId,
        name: `Trainer #${trainerId}`,
        sessions: trainerSessions.length,
        completed: completedSessions,
        upcoming: upcomingSessions,
        trainees: trainees.length,
        progress,
      };
    });
  }, []);

  /* =====================================================
     TRAINEE PROGRESS
     ===================================================== */

  const traineeProgress = useMemo(() => {
    const traineeIds = [
      ...new Set(
        sessions.flatMap((session) => session.traineeIds || [])
      ),
    ];

    return traineeIds.map((traineeId) => {
      const traineeSessions = sessions.filter((session) =>
        session.traineeIds?.includes(traineeId)
      );

      const completedSessions = traineeSessions.filter(
        (session) => session.status === "Completed"
      ).length;

      const upcomingSessions = traineeSessions.filter(
        (session) => session.status === "Upcoming"
      ).length;

      const traineeAssessments = assessments.filter((assessment) =>
        assessment.performance?.some(
          (item) => item.traineeId === traineeId
        )
      );

      let attempted = 0;
      let totalAssessments = traineeAssessments.length;

      traineeAssessments.forEach((assessment) => {
        const result = assessment.performance?.find(
          (item) => item.traineeId === traineeId
        );

        if (result && result.score !== null) {
          attempted++;
        }
      });

      const sessionProgress =
        traineeSessions.length > 0
          ? (completedSessions / traineeSessions.length) * 100
          : 0;

      const assessmentProgress =
        totalAssessments > 0
          ? (attempted / totalAssessments) * 100
          : 0;

      const overallProgress =
        totalAssessments > 0
          ? Math.round(
              sessionProgress * 0.6 +
                assessmentProgress * 0.4
            )
          : Math.round(sessionProgress);

      return {
        id: traineeId,
        name: `Trainee #${traineeId}`,
        sessions: traineeSessions.length,
        completed: completedSessions,
        upcoming: upcomingSessions,
        assessments: totalAssessments,
        attempted,
        progress: overallProgress,
      };
    });
  }, []);

  /* =====================================================
     STATISTICS
     ===================================================== */

  const totalTrainers = trainerProgress.length;
  const totalTrainees = traineeProgress.length;

  const totalSessions = sessions.length;

  const completedSessions = sessions.filter(
    (session) => session.status === "Completed"
  ).length;

  const totalAssessments = assessments.length;

  const completedAssessments = assessments.filter(
    (assessment) => assessment.status === "Completed"
  ).length;

  const overallProgress =
    totalSessions > 0
      ? Math.round(
          (completedSessions / totalSessions) * 100
        )
      : 0;

  /* =====================================================
     SEARCH
     ===================================================== */

  const filteredTrainers = trainerProgress.filter((trainer) =>
    trainer.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTrainees = traineeProgress.filter((trainee) =>
    trainee.name.toLowerCase().includes(search.toLowerCase())
  );

  /* =====================================================
     VIEW DETAILS
     ===================================================== */

  const handleViewTrainer = (trainer) => {
    setSelectedPerson({
      type: "Trainer",
      data: trainer,
    });
  };

  const handleViewTrainee = (trainee) => {
    setSelectedPerson({
      type: "Trainee",
      data: trainee,
    });
  };

  /* =====================================================
     PROGRESS COLOR
     ===================================================== */

  const getProgressClass = (progress) => {
    if (progress >= 80) return "progress-high";
    if (progress >= 50) return "progress-medium";
    return "progress-low";
  };

  /* =====================================================
     PAGE TITLE
     ===================================================== */

  const getPageTitle = () => {
    if (role === "Trainer") {
      return "Training Progress";
    }

    if (role === "Trainee") {
      return "My Progress";
    }

    return "Progress Overview";
  };

  const getPageDescription = () => {
    if (role === "Trainer") {
      return "Track the progress of your assigned trainees and sessions.";
    }

    if (role === "Trainee") {
      return "Track your sessions, assessments and overall learning progress.";
    }

    return "Monitor trainer and trainee performance across SkillAxis.";
  };

  return (
    <div className="progress-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="progress-header">
        <div>
          <h1>{getPageTitle()}</h1>
          <p>{getPageDescription()}</p>
        </div>
      </div>

      {/* =====================================================
          STAT CARDS
          ===================================================== */}

      <div className="progress-stats">

        {(role === "Admin" || role === "Trainer") && (
          <div className="progress-stat-card">
            <div className="progress-stat-icon trainer-icon">
              <FaChalkboardTeacher />
            </div>

            <div>
              <span>Trainers</span>
              <strong>{totalTrainers}</strong>
              <small>Active trainers</small>
            </div>
          </div>
        )}

        <div className="progress-stat-card">
          <div className="progress-stat-icon trainee-icon">
            <FaUsers />
          </div>

          <div>
            <span>
              {role === "Trainee"
                ? "My Sessions"
                : "Trainees"}
            </span>

            <strong>
              {role === "Trainee"
                ? traineeProgress.find(
                    (item) => item.id === 1
                  )?.sessions || 0
                : totalTrainees}
            </strong>

            <small>
              {role === "Trainee"
                ? "Assigned sessions"
                : "Registered trainees"}
            </small>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-icon session-icon">
            <FaCalendarCheck />
          </div>

          <div>
            <span>Completed Sessions</span>
            <strong>{completedSessions}</strong>
            <small>Out of {totalSessions}</small>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-icon assessment-icon">
            <FaClipboardCheck />
          </div>

          <div>
            <span>Assessments</span>
            <strong>{completedAssessments}</strong>
            <small>Completed assessments</small>
          </div>
        </div>

      </div>

      {/* =====================================================
          OVERVIEW CARDS
          ===================================================== */}

      <div className="progress-overview-grid">

        <div className="progress-overview-card">
          <div className="overview-card-header">
            <div>
              <h2>Overall Progress</h2>
              <p>Training completion across SkillAxis</p>
            </div>

            <FaChartLine />
          </div>

          <div className="overall-progress">

            <div className="overall-progress-number">
              {overallProgress}%
            </div>

            <div className="progress-bar-large">
              <div
                style={{
                  width: `${overallProgress}%`,
                }}
              ></div>
            </div>

            <div className="progress-labels">
              <span>Training completed</span>
              <strong>
                {completedSessions}/{totalSessions} sessions
              </strong>
            </div>

          </div>
        </div>

        <div className="progress-overview-card">
          <div className="overview-card-header">
            <div>
              <h2>Assessment Progress</h2>
              <p>Assessment completion overview</p>
            </div>

            <FaClipboardCheck />
          </div>

          <div className="assessment-overview">

            <div className="assessment-circle">
              <strong>
                {totalAssessments > 0
                  ? Math.round(
                      (completedAssessments /
                        totalAssessments) *
                        100
                    )
                  : 0}
                %
              </strong>
            </div>

            <div className="assessment-overview-text">
              <strong>
                {completedAssessments} Completed
              </strong>

              <span>
                {totalAssessments -
                  completedAssessments}{" "}
                pending
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* =====================================================
          TABLE SECTION
          ===================================================== */}

      <section className="progress-section">

        <div className="progress-section-header">

          <div>
            <h2>Progress Details</h2>

            <p>
              View trainer and trainee performance
            </p>
          </div>

          <div className="progress-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </div>

        {/* TABS */}

        <div className="progress-tabs">

          {(role === "Admin" || role === "Trainer") && (
            <button
              className={
                activeTab === "trainers"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("trainers")
              }
            >
              <FaChalkboardTeacher />
              Trainer Progress
            </button>
          )}

          <button
            className={
              activeTab === "trainees"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("trainees")
            }
          >
            <FaUsers />
            Trainee Progress
          </button>

        </div>

        {/* =================================================
            TRAINER TABLE
            ================================================= */}

        {activeTab === "trainers" &&
          (role === "Admin" || role === "Trainer") && (

            <div className="progress-table-container">

              <table className="progress-table">

                <thead>
                  <tr>
                    <th>Trainer</th>
                    <th>Sessions</th>
                    <th>Completed</th>
                    <th>Upcoming</th>
                    <th>Trainees</th>
                    <th>Progress</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredTrainers.length > 0 ? (
                    filteredTrainers.map((trainer) => (
                      <tr key={trainer.id}>

                        <td>
                          <div className="person-cell">
                            <div className="person-avatar trainer-avatar">
                              T
                            </div>

                            <div>
                              <strong>
                                {trainer.name}
                              </strong>

                              <small>
                                Trainer ID:{" "}
                                {trainer.id}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          {trainer.sessions}
                        </td>

                        <td>
                          <span className="completed-text">
                            <FaCheckCircle />
                            {trainer.completed}
                          </span>
                        </td>

                        <td>
                          <span className="upcoming-text">
                            <FaClock />
                            {trainer.upcoming}
                          </span>
                        </td>

                        <td>
                          {trainer.trainees}
                        </td>

                        <td>
                          <div className="table-progress">

                            <div className="table-progress-top">
                              <span>
                                {trainer.progress}%
                              </span>
                            </div>

                            <div className="table-progress-bar">
                              <div
                                className={getProgressClass(
                                  trainer.progress
                                )}
                                style={{
                                  width: `${trainer.progress}%`,
                                }}
                              ></div>
                            </div>

                          </div>
                        </td>

                        <td>
                          <button
                            className="progress-view-btn"
                            onClick={() =>
                              handleViewTrainer(
                                trainer
                              )
                            }
                          >
                            <FaEye />
                            View
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="progress-empty"
                      >
                        No trainers found.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          )}

        {/* =================================================
            TRAINEE TABLE
            ================================================= */}

        {activeTab === "trainees" && (

          <div className="progress-table-container">

            <table className="progress-table">

              <thead>
                <tr>
                  <th>Trainee</th>
                  <th>Sessions</th>
                  <th>Completed</th>
                  <th>Upcoming</th>
                  <th>Assessments</th>
                  <th>Progress</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredTrainees.length > 0 ? (
                  filteredTrainees.map((trainee) => (
                    <tr key={trainee.id}>

                      <td>
                        <div className="person-cell">

                          <div className="person-avatar trainee-avatar">
                            T
                          </div>

                          <div>
                            <strong>
                              {trainee.name}
                            </strong>

                            <small>
                              Trainee ID:{" "}
                              {trainee.id}
                            </small>
                          </div>

                        </div>
                      </td>

                      <td>
                        {trainee.sessions}
                      </td>

                      <td>
                        <span className="completed-text">
                          <FaCheckCircle />
                          {trainee.completed}
                        </span>
                      </td>

                      <td>
                        <span className="upcoming-text">
                          <FaClock />
                          {trainee.upcoming}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {trainee.attempted}/
                          {trainee.assessments}
                        </strong>
                      </td>

                      <td>

                        <div className="table-progress">

                          <div className="table-progress-top">
                            <span>
                              {trainee.progress}%
                            </span>
                          </div>

                          <div className="table-progress-bar">
                            <div
                              className={getProgressClass(
                                trainee.progress
                              )}
                              style={{
                                width: `${trainee.progress}%`,
                              }}
                            ></div>
                          </div>

                        </div>

                      </td>

                      <td>

                        <button
                          className="progress-view-btn"
                          onClick={() =>
                            handleViewTrainee(
                              trainee
                            )
                          }
                        >
                          <FaEye />
                          View
                        </button>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="progress-empty"
                    >
                      No trainees found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>
{/* =====================================================
    VIEW MODAL
===================================================== */}

{selectedPerson && (
  <div
    className="progress-modal-overlay"
    onClick={() => setSelectedPerson(null)}
  >
    <div
      className="progress-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* =================================================
          HEADER - FIXED
      ================================================= */}

      <div className="progress-modal-header">

        <div className="modal-person-info">

          <div className="modal-avatar">
            {selectedPerson.data.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h2>
              {selectedPerson.data.name}
            </h2>

            <p>
              {selectedPerson.type} Progress Details
            </p>
          </div>

        </div>

        <button
          className="modal-close-btn"
          onClick={() => setSelectedPerson(null)}
        >
          <FaTimes />
        </button>

      </div>


      {/* =================================================
          SCROLLABLE CONTENT
      ================================================= */}

      <div className="progress-modal-content">


        {/* =================================================
            PROGRESS SECTION
        ================================================= */}

        <div className="modal-progress-section">

          {/* Progress Circle */}

          <div
            className="modal-progress-ring"
            style={{
              "--progress":
                `${selectedPerson.data.progress}%`,
            }}
          >
            <div className="modal-progress-inner">

              <strong>
                {selectedPerson.data.progress}%
              </strong>

              <span>
                Complete
              </span>

            </div>
          </div>


          {/* Progress Information */}

          <div className="modal-progress-info">

            <span className="progress-small-title">
              OVERALL PROGRESS
            </span>


            <div className="progress-title-row">

              <h3>
                {selectedPerson.data.progress >= 75
                  ? "Excellent Progress"
                  : selectedPerson.data.progress >= 50
                  ? "Good Progress"
                  : "Needs Improvement"}
              </h3>

              <span className="progress-status">
                ↗ On Track
              </span>

            </div>


            <p>
              Current training completion percentage
              based on assigned sessions.
            </p>


            {/* Progress Bar */}

            <div className="progress-bar-container">

              <div
                className="progress-bar-fill"
                style={{
                  width:
                    `${selectedPerson.data.progress}%`,
                }}
              ></div>

            </div>


            <div className="progress-bar-value">
              {selectedPerson.data.progress}%
            </div>


            {/* Encouragement */}

            <div className="progress-message">

              <span className="progress-message-icon">
                ★
              </span>

              <span>
                Keep it up! You're making steady progress.
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            DETAIL CARDS
        ================================================= */}

        <div className="modal-detail-grid">


          {/* ================= TOTAL SESSIONS ================= */}

          <div className="modal-stat-card sessions-card">

            <div className="stat-icon">
              📅
            </div>

            <div className="stat-content">

              <span>
                Total Sessions
              </span>

              <strong>
                {selectedPerson.data.sessions}
              </strong>

              <small>
                All assigned sessions
              </small>

            </div>

          </div>


          {/* ================= COMPLETED ================= */}

          <div className="modal-stat-card completed-card">

            <div className="stat-icon">
              ✓
            </div>

            <div className="stat-content">

              <span>
                Completed
              </span>

              <strong>
                {selectedPerson.data.completed}
              </strong>

              <small>
                Sessions completed
              </small>

            </div>

            <div className="stat-percentage green">

              {selectedPerson.data.sessions
                ? Math.round(
                    (selectedPerson.data.completed /
                      selectedPerson.data.sessions) *
                      100
                  )
                : 0}%

            </div>

          </div>


          {/* ================= UPCOMING ================= */}

          <div className="modal-stat-card upcoming-card">

            <div className="stat-icon">
              ◷
            </div>

            <div className="stat-content">

              <span>
                Upcoming
              </span>

              <strong>
                {selectedPerson.data.upcoming}
              </strong>

              <small>
                Sessions remaining
              </small>

            </div>

            <div className="stat-percentage orange">

              {selectedPerson.data.sessions
                ? Math.round(
                    (selectedPerson.data.upcoming /
                      selectedPerson.data.sessions) *
                      100
                  )
                : 0}%

            </div>

          </div>


          {/* ================= ASSESSMENTS ================= */}

          {selectedPerson.type === "Trainee" && (

            <div className="modal-stat-card assessment-card">

              <div className="stat-icon">
                ☑
              </div>

              <div className="stat-content">

                <span>
                  Assessments
                </span>

                <strong>
                  {selectedPerson.data.attempted}/
                  {selectedPerson.data.assessments}
                </strong>

                <small>
                  Assessments completed
                </small>

              </div>

              <div className="stat-percentage purple">

                {selectedPerson.data.assessments
                  ? Math.round(
                      (selectedPerson.data.attempted /
                        selectedPerson.data.assessments) *
                        100
                    )
                  : 0}%

              </div>

            </div>

          )}


          {/* ================= TRAINER ================= */}

          {selectedPerson.type === "Trainer" && (

            <div className="modal-stat-card assessment-card">

              <div className="stat-icon">
                👥
              </div>

              <div className="stat-content">

                <span>
                  Assigned Trainees
                </span>

                <strong>
                  {selectedPerson.data.trainees}
                </strong>

                <small>
                  Active trainees
                </small>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          FOOTER - FIXED
      ================================================= */}

      <div className="progress-modal-footer">

        <button
          className="modal-close-main-btn"
          onClick={() => setSelectedPerson(null)}
        >
          ✓ &nbsp; Close
        </button>

      </div>

    </div>
  </div>
)}
</div> 
);
 } 
export default Progress;