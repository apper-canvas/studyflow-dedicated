import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Courses from "@/components/pages/Courses";
import Assignments from "@/components/pages/Assignments";
import Calendar from "@/components/pages/Calendar";
import Grades from "@/components/pages/Grades";
import QuickAddForm from "@/components/molecules/QuickAddForm";
import { assignmentsService } from "@/services/api/assignmentsService";
import { coursesService } from "@/services/api/coursesService";

function App() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [courses, setCourses] = useState([]);

  const loadCourses = async () => {
    try {
      const data = await coursesService.getAll();
      setCourses(data);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };

  const handleQuickAdd = async () => {
    await loadCourses();
    setShowQuickAdd(true);
  };

  const handleQuickAddSubmit = async (assignmentData) => {
    try {
      await assignmentsService.create(assignmentData);
      setShowQuickAdd(false);
      toast.success("Assignment added successfully!");
    } catch (err) {
      toast.error("Failed to add assignment");
    }
  };

  const handleEditAssignment = (assignment) => {
    toast.info(`Edit assignment: ${assignment.title} - Feature coming soon!`);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentsService.delete(assignmentId);
        toast.success("Assignment deleted successfully!");
        // Note: In a real app, you'd want to refresh the data or update state
        window.location.reload();
      } catch (err) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleToggleAssignmentStatus = async (assignmentId) => {
    try {
      // Get current assignment to toggle status
      const assignment = await assignmentsService.getById(assignmentId);
      const newStatus = assignment.status === "completed" ? "pending" : "completed";
      
      await assignmentsService.update(assignmentId, { status: newStatus });
      toast.success(`Assignment marked as ${newStatus}!`);
      // Note: In a real app, you'd want to refresh the data or update state
    } catch (err) {
      toast.error("Failed to update assignment status");
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout onQuickAdd={handleQuickAdd} />}>
            <Route 
              index 
              element={
                <Dashboard 
                  onEditAssignment={handleEditAssignment}
                  onDeleteAssignment={handleDeleteAssignment}
                  onToggleAssignmentStatus={handleToggleAssignmentStatus}
                />
              } 
            />
            <Route path="courses" element={<Courses />} />
            <Route 
              path="assignments" 
              element={
                <Assignments 
                  onAddAssignment={handleQuickAdd}
                />
              } 
            />
            <Route path="calendar" element={<Calendar />} />
            <Route path="grades" element={<Grades />} />
          </Route>
        </Routes>

        <AnimatePresence>
          {showQuickAdd && (
            <QuickAddForm
              courses={courses}
              onSubmit={handleQuickAddSubmit}
              onCancel={() => setShowQuickAdd(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;