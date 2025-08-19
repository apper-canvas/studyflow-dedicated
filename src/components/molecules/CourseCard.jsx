import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
const CourseCard = ({ course, onEdit, onDelete, onShowAttachments, attachments = [], className = "" }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-emerald-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const formatSchedule = (schedule) => {
    return schedule.map(s => `${s.day.slice(0, 3)} ${s.time}`).join(", ");
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-100 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-4 h-4 rounded-full shadow-sm"
          style={{ backgroundColor: course.color }}
        ></div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(course)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit" size={16} className="text-gray-500 hover:text-primary-600" />
          </button>
          <button
            onClick={() => onDelete(course.Id)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={16} className="text-gray-500 hover:text-red-600" />
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 font-display line-clamp-2">
        {course.name}
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <ApperIcon name="User" size={16} className="mr-2 text-gray-400" />
          <span className="text-sm">{course.professor}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <ApperIcon name="MapPin" size={16} className="mr-2 text-gray-400" />
          <span className="text-sm">{course.room}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <ApperIcon name="Clock" size={16} className="mr-2 text-gray-400" />
          <span className="text-sm">{formatSchedule(course.schedule)}</span>
        </div>
{/* Attachments Section */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowAttachments?.(course)}
            className={`w-full justify-center text-xs ${attachments.length > 0 ? 'text-primary-600 bg-primary-50' : 'text-gray-500'} hover:text-primary-700 hover:bg-primary-100`}
          >
            <ApperIcon name="Paperclip" size={14} className="mr-2" />
            {attachments.length > 0 
              ? `${attachments.length} Attachment${attachments.length > 1 ? 's' : ''}` 
              : 'Add Attachments'
            }
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="default">
          {course.credits} Credits
        </Badge>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getGradeColor(course.grade)} font-display`}>
            {course.grade.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Current Grade</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;