import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { assignmentsService } from "@/services/api/assignmentsService";
import { coursesService } from "@/services/api/coursesService";
import { attachmentService } from "@/services/api/attachmentService";
import FileAttachment from "@/components/molecules/FileAttachment";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import AssignmentList from "@/components/organisms/AssignmentList";
import Button from "@/components/atoms/Button";

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

  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [attachments, setAttachments] = useState({});

  const handleShowAttachments = async (assignment) => {
    setSelectedAssignment(assignment);
    try {
      const assignmentAttachments = await attachmentService.getByEntity('assignment', assignment.Id);
      setAttachments(prev => ({ ...prev, [assignment.Id]: assignmentAttachments }));
      setShowAttachments(true);
    } catch (error) {
      toast.error("Failed to load attachments");
    }
  };

  const handleAttachmentChange = (assignmentId, newAttachments) => {
    setAttachments(prev => ({ ...prev, [assignmentId]: newAttachments }));
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
        onShowAttachments={handleShowAttachments}
        attachments={attachments}
      />

      {/* Attachment Modal */}
      {showAttachments && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Attachments - {selectedAssignment.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAttachments(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <FileAttachment
                entityType="assignment"
                entityId={selectedAssignment.Id}
                attachments={attachments[selectedAssignment.Id] || []}
                onAttachmentChange={(newAttachments) => 
                  handleAttachmentChange(selectedAssignment.Id, newAttachments)
                }
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Assignments;