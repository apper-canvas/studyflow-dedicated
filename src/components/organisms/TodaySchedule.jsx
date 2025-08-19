import { useMemo } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";

const TodaySchedule = ({ courses, assignments, className = "" }) => {
  const todaySchedule = useMemo(() => {
    const today = new Date();
    const dayName = format(today, "EEEE");
    
    // Get today's classes
    const todaysClasses = courses
      .filter(course => course.schedule.some(s => s.day === dayName))
      .map(course => ({
        ...course,
        todaySchedule: course.schedule.filter(s => s.day === dayName)
      }))
      .sort((a, b) => {
        const timeA = a.todaySchedule[0]?.time || "";
        const timeB = b.todaySchedule[0]?.time || "";
        return timeA.localeCompare(timeB);
      });

    // Get today's assignments
    const todaysAssignments = assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return format(dueDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    });

    return { todaysClasses, todaysAssignments };
  }, [courses, assignments]);

  if (todaySchedule.todaysClasses.length === 0 && todaySchedule.todaysAssignments.length === 0) {
    return (
      <div className={className}>
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Today's Schedule</h2>
        <Empty
          title="Free day!"
          message="No classes or assignments scheduled for today. Perfect time to get ahead or take a well-deserved break!"
          icon="Coffee"
          className="min-h-[300px]"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 font-display">Today's Schedule</h2>
        <span className="text-sm text-gray-500">{format(new Date(), "EEEE, MMMM d")}</span>
      </div>

      <div className="space-y-4">
        {/* Today's Classes */}
        {todaySchedule.todaysClasses.map((course, index) => (
          <motion.div
            key={`class-${course.Id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center space-x-4">
              <div 
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: course.color }}
              ></div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 font-display">{course.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Clock" size={14} />
                    <span>{course.todaySchedule[0]?.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="MapPin" size={14} />
                    <span>{course.room}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="User" size={14} />
                    <span>{course.professor}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <ApperIcon name="BookOpen" size={20} className="text-primary-500" />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Today's Assignments */}
        {todaySchedule.todaysAssignments.map((assignment, index) => {
          const course = courses.find(c => c.Id === assignment.courseId);
          return (
            <motion.div
              key={`assignment-${assignment.Id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (todaySchedule.todaysClasses.length + index) * 0.1 }}
              className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-sm p-4 border border-red-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 font-display">{assignment.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-red-700 mt-1">
                    <div className="flex items-center space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course?.color || "#6B7280" }}
                      ></div>
                      <span>{course?.name || "Unknown Course"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="AlertTriangle" size={14} />
                      <span>Due Today</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <ApperIcon name="AlertCircle" size={20} className="text-red-600" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TodaySchedule;