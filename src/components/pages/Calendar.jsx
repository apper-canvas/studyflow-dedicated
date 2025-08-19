import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from "date-fns";
import { assignmentsService } from "@/services/api/assignmentsService";
import { coursesService } from "@/services/api/coursesService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");

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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAssignmentsForDay = (day) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), day)
    );
  };

  const getCourse = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

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
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Calendar</h1>
          <p className="text-gray-600 mt-1">View your assignments and class schedule</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "month" ? "primary" : "outline"}
            onClick={() => setViewMode("month")}
            size="sm"
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "primary" : "outline"}
            onClick={() => setViewMode("week")}
            size="sm"
            disabled
          >
            Week
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-b">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={20} className="text-primary-600" />
          </button>
          
          <h2 className="text-xl font-bold text-gray-900 font-display">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <ApperIcon name="ChevronRight" size={20} className="text-primary-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div
              key={day}
              className="p-4 text-center font-medium text-gray-600 bg-gray-50 border-b border-r border-gray-200"
            >
              {day}
            </div>
          ))}

          {monthDays.map((day, index) => {
            const dayAssignments = getAssignmentsForDay(day);
            const isCurrentDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`min-h-[120px] p-2 border-b border-r border-gray-200 ${
                  !isCurrentMonth ? "bg-gray-50" : "bg-white"
                } ${isCurrentDay ? "bg-blue-50" : ""} hover:bg-gray-50 transition-colors`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  !isCurrentMonth ? "text-gray-400" : isCurrentDay ? "text-primary-600" : "text-gray-900"
                }`}>
                  {format(day, "d")}
                </div>

                <div className="space-y-1">
                  {dayAssignments.slice(0, 3).map(assignment => {
                    const course = getCourse(assignment.courseId);
                    return (
                      <motion.div
                        key={assignment.Id}
                        whileHover={{ scale: 1.02 }}
                        className="p-2 rounded text-xs font-medium shadow-sm cursor-pointer"
                        style={{ 
                          backgroundColor: course?.color + "20",
                          borderLeft: `3px solid ${course?.color || "#6B7280"}`
                        }}
                      >
                        <div className="font-semibold text-gray-900 truncate">
                          {assignment.title}
                        </div>
                        <div className="text-gray-600 truncate">
                          {course?.name}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant={assignment.priority} className="text-[10px] px-1 py-0">
                            {assignment.priority}
                          </Badge>
                          <Badge variant={assignment.status} className="text-[10px] px-1 py-0">
                            {assignment.status}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                  
                  {dayAssignments.length > 3 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      +{dayAssignments.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;