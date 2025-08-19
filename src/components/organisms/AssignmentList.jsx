import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import AssignmentItem from "@/components/molecules/AssignmentItem";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const AssignmentList = ({ assignments, courses, onEdit, onDelete, onToggleStatus, onAdd, className = "" }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const filteredAndSortedAssignments = useMemo(() => {
    let filtered = assignments;

    // Apply filters
    if (filter !== "all") {
      if (filter === "course") {
        // For course filter, we'll show all assignments (this could be extended to filter by specific course)
        filtered = assignments;
      } else {
        filtered = assignments.filter(a => a.status === filter);
      }
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "priority":
          const priorityOrder = { "high": 3, "medium": 2, "low": 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "course":
          const courseA = courses.find(c => c.Id === a.courseId)?.name || "";
          const courseB = courses.find(c => c.Id === b.courseId)?.name || "";
          return courseA.localeCompare(courseB);
        case "status":
          const statusOrder = { "pending": 3, "in-progress": 2, "completed": 1 };
          return statusOrder[b.status] - statusOrder[a.status];
        default:
          return 0;
      }
    });

    return filtered;
  }, [assignments, courses, filter, sortBy]);

  const getCourse = (courseId) => {
    return courses.find(course => course.Id === courseId);
  };

  if (assignments.length === 0) {
    return (
      <div className={className}>
        <Empty
          title="No assignments yet"
          message="Start tracking your academic workload by adding your first assignment. Stay organized and never miss a deadline!"
          actionLabel="Add First Assignment"
          onAction={onAdd}
          icon="CheckSquare"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Assignments</h1>
          <p className="text-gray-600 mt-1">{filteredAndSortedAssignments.length} assignments</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="sm:w-40"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sm:w-40"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="course">Course</option>
            <option value="status">Status</option>
          </Select>

          <Button onClick={onAdd} className="whitespace-nowrap">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Assignment
          </Button>
        </div>
      </div>

      {filteredAndSortedAssignments.length === 0 ? (
        <Empty
          title={`No ${filter} assignments`}
          message={`There are no assignments with ${filter} status. Try adjusting your filter or add a new assignment.`}
          actionLabel="Add Assignment"
          onAction={onAdd}
          icon="Filter"
        />
      ) : (
        <div className="space-y-4">
          {filteredAndSortedAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
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
      )}
    </div>
  );
};

export default AssignmentList;