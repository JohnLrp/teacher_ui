/**
 * AllStudentDetail.jsx
 *
 * This is the detail view when clicking a student from the "All Students" page.
 * It receives student data via React Router's location.state — no extra API call.
 *
 * WHY location.state?
 * - We already have the student data from the list page
 * - Passing it via state avoids an extra API request
 * - If state is missing (e.g., direct URL access), we show a fallback
 */

import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FiMail, FiPhone, FiUser, FiCalendar, FiHash, FiBook } from "react-icons/fi";
import "../styles/student-detail.css";

export default function AllStudentDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get student from router state
  const student = location.state?.student;

  if (!student) {
    return (
      <div className="sd-page">
        <button className="sd-back-btn" onClick={() => navigate("/teacher/students")}>
          <IoChevronBack /> Back
        </button>
        <div className="sd-empty">Student data not available. Go back and try again.</div>
      </div>
    );
  }

  return (
    <div className="sd-page">
      <button className="sd-back-btn" onClick={() => navigate("/teacher/students")}>
        <IoChevronBack /> Back to All Students
      </button>

      <div className="sd-card">
        {/* Profile header with avatar and name */}
        <div className="sd-profile-section">
          <div className="sd-avatar-large">
            {student.avatar_type === "image" && student.avatar ? (
              <img src={student.avatar} alt="" />
            ) : student.avatar_type === "emoji" && student.avatar ? (
              <span>{student.avatar}</span>
            ) : (
              <span>{(student.full_name || "?")[0].toUpperCase()}</span>
            )}
          </div>

          <div className="sd-profile-info">
            <h2>{student.full_name || student.username}</h2>
            {student.course_title && (
              <p className="sd-subject-badge">{student.course_title}</p>
            )}
          </div>
        </div>

        {/* Detail grid — 2 columns on desktop, 1 on mobile */}
        <div className="sd-details-grid">
          <div className="sd-detail-item">
            <FiMail className="sd-detail-icon" />
            <div>
              <span className="sd-detail-label">Email</span>
              <span className="sd-detail-value">{student.email}</span>
            </div>
          </div>

          <div className="sd-detail-item">
            <FiPhone className="sd-detail-icon" />
            <div>
              <span className="sd-detail-label">Phone</span>
              <span className="sd-detail-value">{student.phone || "Not provided"}</span>
            </div>
          </div>

          <div className="sd-detail-item">
            <FiHash className="sd-detail-icon" />
            <div>
              <span className="sd-detail-label">Student ID</span>
              <span className="sd-detail-value">{student.student_id || "Not assigned"}</span>
            </div>
          </div>

          <div className="sd-detail-item">
            <FiUser className="sd-detail-icon" />
            <div>
              <span className="sd-detail-label">Username</span>
              <span className="sd-detail-value">{student.username}</span>
            </div>
          </div>

          <div className="sd-detail-item">
            <FiBook className="sd-detail-icon" />
            <div>
              <span className="sd-detail-label">Course</span>
              <span className="sd-detail-value">{student.course_title}</span>
            </div>
          </div>

          <div className="sd-detail-item">
            <FiCalendar className="sd-detail-icon" />
            <div>
              <span className="sd-detail-label">Enrolled On</span>
              <span className="sd-detail-value">
                {new Date(student.enrolled_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {student.batch_code && (
            <div className="sd-detail-item">
              <FiHash className="sd-detail-icon" />
              <div>
                <span className="sd-detail-label">Batch Code</span>
                <span className="sd-detail-value">{student.batch_code}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
