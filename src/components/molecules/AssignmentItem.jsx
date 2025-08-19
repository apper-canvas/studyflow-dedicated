import { motion } from "framer-motion";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
const AssignmentItem = ({ assignment, course, onEdit, onDelete, onToggleStatus, onShowAttachments, attachments = [] }) => {
  const formatDueDate = (date) => {
    const dueDate = new Date(date);
    if (isToday(dueDate)) return "Today";
    if (isTomorrow(dueDate)) return "Tomorrow";
    return format(dueDate, "MMM d");
  };

  const getUrgencyColor = (date, status) => {
    if (status === "completed") return "text-emerald-600";
    const dueDate = new Date(date);
    if (isPast(dueDate)) return "text-red-600";
    if (isToday(dueDate) || isTomorrow(dueDate)) return "text-amber-600";
    return "text-gray-600";
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": return "AlertTriangle";
      case "medium": return "Circle";
      case "low": return "Minus";
      default: return "Circle";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <button
            onClick={() => onToggleStatus(assignment.Id)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200 ${
              assignment.status === "completed"
                ? "bg-emerald-500 border-emerald-500"
                : "border-gray-300 hover:border-primary-500"
            }`}
          >
            {assignment.status === "completed" && (
              <ApperIcon name="Check" size={12} className="text-white" />
            )}
          </button>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-semibold text-gray-900 font-display ${
                assignment.status === "completed" ? "line-through text-gray-500" : ""
              }`}>
                {assignment.title}
              </h3>
              <ApperIcon 
                name={getPriorityIcon(assignment.priority)} 
                size={14} 
                className={`text-${assignment.priority === "high" ? "red" : assignment.priority === "medium" ? "amber" : "emerald"}-500`} 
              />
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: course?.color || "#6B7280" }}
                ></div>
                <span>{course?.name || "Unknown Course"}</span>
              </div>
              <div className={`flex items-center space-x-1 ${getUrgencyColor(assignment.dueDate, assignment.status)}`}>
                <ApperIcon name="Calendar" size={14} />
                <span>{formatDueDate(assignment.dueDate)}</span>
              </div>
            </div>

            {assignment.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {assignment.description}
              </p>
            )}

            <div className="flex items-center space-x-2">
              <Badge variant={assignment.priority}>
                {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
              </Badge>
              <Badge variant={assignment.status}>
                {assignment.status === "in-progress" ? "In Progress" : 
                 assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </Badge>
              {assignment.grade && (
                <Badge variant="success">
                  {assignment.grade}%
                </Badge>
              )}
{/* Attachments Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShowAttachments?.(assignment)}
                className={`text-xs ${attachments.length > 0 ? 'text-primary-600 bg-primary-50' : 'text-gray-500'} hover:text-primary-700 hover:bg-primary-100`}
              >
                <ApperIcon name="Paperclip" size={14} className="mr-1" />
                {attachments.length > 0 ? attachments.length : 'Attach'}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 ml-4">
          <button
            onClick={() => onEdit(assignment)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit" size={16} className="text-gray-500 hover:text-primary-600" />
          </button>
          <button
            onClick={() => onDelete(assignment.Id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={16} className="text-gray-500 hover:text-red-600" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AssignmentItem;