import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../api/apiClient";
import "../styles/submission-view.css";

export default function SubmissionView() {
  const navigate = useNavigate();
  const { subjectId, assignmentId } = useParams();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW STATES
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | submitted | pending
  const [sortSubmittedFirst, setSortSubmittedFirst] = useState(true);

  const backPath = `/teacher/classes/${subjectId}/assignments`;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await api.get(
          `/assignments/teacher/${assignmentId}/submissions/`
        );

        const formatted = res.data.map((s) => ({
          id: s.id,
          name: s.student_name,
          submittedOn: s.submitted_at,
          status: s.submitted_file ? "Submitted" : "Pending",
          file: s.submitted_file,
        }));

        setStudents(formatted);
      } catch (err) {
        console.error("Failed to load submissions", err);
      } finally {
        setLoading(false);
      }
    }

    if (assignmentId) fetchSubmissions();
  }, [assignmentId]);

  // COUNTS
  const total = students.length;
  const submittedCount = students.filter(
    (s) => s.status === "Submitted"
  ).length;
  const pendingCount = total - submittedCount;

  // FILTER + SEARCH + SORT
  const filteredStudents = students
    .filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((s) => {
      if (filter === "submitted") return s.status === "Submitted";
      if (filter === "pending") return s.status === "Pending";
      return true;
    })
    .sort((a, b) => {
      if (sortSubmittedFirst) {
        return a.status === b.status
          ? 0
          : a.status === "Submitted"
          ? -1
          : 1;
      } else {
        return a.status === b.status
          ? 0
          : a.status === "Pending"
          ? -1
          : 1;
      }
    });

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="sv-page">

      <button
        className="sv-back-btn"
        onClick={() => navigate(backPath)}
      >
        <IoChevronBack /> Back
      </button>

      <div className="sv-header">
        <h2 className="sv-title">Assignment Submissions</h2>

        <div className="sv-search">
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FiSearch className="sv-search-icon" />
        </div>
      </div>

      <div className="sv-content-card">

        {/* SUMMARY (NOW CLICKABLE) */}
        <div className="sv-summary">

          <span
            className={`sv-submitted-count ${filter === "submitted" ? "active" : ""}`}
            onClick={() => setFilter("submitted")}
          >
            {submittedCount}/{total} Submitted
          </span>

          <span
            className={`sv-pending-count ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            {pendingCount}/{total} Pending
          </span>

          <button
            className="sv-clear-filter"
            onClick={() => setFilter("all")}
          >
            Reset
          </button>

        </div>

        {/* SORT BUTTON */}
        <div className="sv-sort-row">
          <button
            className="sv-sort-btn"
            onClick={() => setSortSubmittedFirst((prev) => !prev)}
          >
            Sort: {sortSubmittedFirst ? "Submitted First" : "Pending First"}
          </button>
        </div>

        <table className="sv-table">
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Name</th>
              <th>Submitted On</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No matching results
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr key={student.id}>

                  <td>{index + 1}</td>

                  <td>{student.name}</td>

                  <td>{formatDate(student.submittedOn)}</td>

                  <td>
                    <span
                      className={
                        student.status === "Submitted"
                          ? "sv-status-submitted"
                          : "sv-status-pending"
                      }
                    >
                      {student.status}
                    </span>
                  </td>

                  <td>
                    {student.file && (
                      <a
                        href={student.file}
                        target="_blank"
                        rel="noreferrer"
                        className="sv-review-btn"
                      >
                        Review
                      </a>
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}