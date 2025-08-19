import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { assignmentsService } from "@/services/api/assignmentsService";
import { coursesService } from "@/services/api/coursesService";
import AssignmentList from "@/components/organisms/AssignmentList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Assignments = ({ onAddAssignment }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentsService.getAll(),
        coursesService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditAssignment = (assignment) => {
    toast.info(`Edit assignment: ${assignment.title} - Feature coming soon!`);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentsService.delete(assignmentId);
        setAssignments(assignments.filter(assignment => assignment.Id !== assignmentId));
        toast.success("Assignment deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleToggleAssignmentStatus = async (assignmentId) => {
    try {
      const assignment = assignments.find(a => a.Id === assignmentId);
      const newStatus = assignment.status === "completed" ? "pending" : "completed";
      
      const updatedAssignment = await assignmentsService.update(assignmentId, { 
        status: newStatus 
      });
      
      setAssignments(assignments.map(a => 
        a.Id === assignmentId ? updatedAssignment : a
      ));
      
      toast.success(`Assignment marked as ${newStatus}!`);
    } catch (err) {
      toast.error("Failed to update assignment status");
    }
  };

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AssignmentList
        assignments={assignments}
        courses={courses}
        onEdit={handleEditAssignment}
        onDelete={handleDeleteAssignment}
        onToggleStatus={handleToggleAssignmentStatus}
        onAdd={onAddAssignment}
      />
    </motion.div>
  );
};

export default Assignments;