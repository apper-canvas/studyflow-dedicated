import { motion } from "framer-motion";
import CourseCard from "@/components/molecules/CourseCard";
import Empty from "@/components/ui/Empty";

const CourseGrid = ({ courses, onEdit, onDelete, onAdd, className = "" }) => {
  if (courses.length === 0) {
    return (
      <div className={className}>
        <Empty
          title="No courses yet"
          message="Start organizing your academic life by adding your first course. You can track assignments, grades, and schedules all in one place."
          actionLabel="Add First Course"
          onAction={onAdd}
          icon="BookOpen"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CourseCard
              course={course}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;