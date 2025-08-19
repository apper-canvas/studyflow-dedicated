import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { coursesService } from "@/services/api/coursesService";
import CourseGrid from "@/components/organisms/CourseGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await coursesService.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleAddCourse = () => {
    toast.info("Course creation feature coming soon!");
  };

  const handleEditCourse = (course) => {
    toast.info(`Edit course: ${course.name} - Feature coming soon!`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await coursesService.delete(courseId);
        setCourses(courses.filter(course => course.Id !== courseId));
        toast.success("Course deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete course");
      }
    }
  };

  if (loading) {
    return <Loading variant="card" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCourses} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Courses</h1>
          <p className="text-gray-600 mt-1">{courses.length} active courses</p>
        </div>
        <Button onClick={handleAddCourse}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Course
        </Button>
      </div>

      <CourseGrid
        courses={courses}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
        onAdd={handleAddCourse}
      />
    </motion.div>
  );
};

export default Courses;