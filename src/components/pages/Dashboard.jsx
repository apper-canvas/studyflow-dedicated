import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { coursesService } from "@/services/api/coursesService";
import { assignmentsService } from "@/services/api/assignmentsService";
import DashboardStats from "@/components/organisms/DashboardStats";
import UpcomingAssignments from "@/components/organisms/UpcomingAssignments";
import TodaySchedule from "@/components/organisms/TodaySchedule";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Dashboard = ({ onEditAssignment, onDeleteAssignment, onToggleAssignmentStatus }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, assignmentsData] = await Promise.all([
        coursesService.getAll(),
        assignmentsService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">
          Dashboard
        </h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your academic progress.</p>
      </div>

      <DashboardStats assignments={assignments} courses={courses} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <UpcomingAssignments
            assignments={assignments}
            courses={courses}
            onEdit={onEditAssignment}
            onDelete={onDeleteAssignment}
            onToggleStatus={onToggleAssignmentStatus}
          />
        </div>
        
        <div>
          <TodaySchedule
            courses={courses}
            assignments={assignments}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;