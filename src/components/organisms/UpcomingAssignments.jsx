import { useMemo } from "react";
import { isToday, isTomorrow, addDays, isWithinInterval, compareAsc } from "date-fns";
import { motion } from "framer-motion";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import Empty from "@/components/ui/Empty";

const UpcomingAssignments = ({ assignments, courses, onEdit, onDelete, onToggleStatus, className = "" }) => {
  const upcomingAssignments = useMemo(() => {
    const today = new Date();
    const weekFromNow = addDays(today, 7);
    
    return assignments
      .filter(assignment => 
        assignment.status !== "completed" && 
        isWithinInterval(new Date(assignment.dueDate), {
          start: today,
          end: weekFromNow
        })
      )
      .sort((a, b) => compareAsc(new Date(a.dueDate), new Date(b.dueDate)))
      .slice(0, 5);
  }, [assignments]);

  const getCourse = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  if (upcomingAssignments.length === 0) {
    return (
      <div className={className}>
        <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Upcoming Assignments</h2>
        <Empty
          title="All caught up!"
          message="No assignments due in the next week. Great job staying on top of your work!"
          icon="CheckCircle"
          className="min-h-[300px]"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 font-display">Upcoming Assignments</h2>
        <span className="text-sm text-gray-500">{upcomingAssignments.length} due this week</span>
      </div>

      <div className="space-y-3">
        {upcomingAssignments.map((assignment, index) => (
          <motion.div
            key={assignment.Id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AssignmentItem
              assignment={assignment}
              course={getCourse(assignment.courseId)}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAssignments;