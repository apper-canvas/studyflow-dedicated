import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { coursesService } from "@/services/api/coursesService";
import { attachmentService } from "@/services/api/attachmentService";
import CourseGrid from "@/components/organisms/CourseGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import FileAttachment from "@/components/molecules/FileAttachment";

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
const [showAttachments, setShowAttachments] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attachments, setAttachments] = useState({});

  const handleShowAttachments = async (course) => {
    setSelectedCourse(course);
    try {
      const courseAttachments = await attachmentService.getByEntity('course', course.Id);
      setAttachments(prev => ({ ...prev, [course.Id]: courseAttachments }));
      setShowAttachments(true);
    } catch (error) {
      toast.error("Failed to load attachments");
    }
  };

  const handleAttachmentChange = (courseId, newAttachments) => {
    setAttachments(prev => ({ ...prev, [courseId]: newAttachments }));
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
        onShowAttachments={handleShowAttachments}
        attachments={attachments}
      />

      {/* Attachment Modal */}
      {showAttachments && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Attachments - {selectedCourse.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAttachments(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <FileAttachment
                entityType="course"
                entityId={selectedCourse.Id}
                attachments={attachments[selectedCourse.Id] || []}
                onAttachmentChange={(newAttachments) => 
                  handleAttachmentChange(selectedCourse.Id, newAttachments)
                }
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Courses;