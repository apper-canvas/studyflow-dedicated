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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    professor: "",
    room: "",
    schedule: [{ day: "Monday", time: "9:00 AM" }],
    color: "#4F46E5",
    credits: 3,
    semester: "Fall 2024"
  });

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
    console.log('Add Course button clicked'); // Debug log
    setShowAddModal(true);
    console.log('Modal should be showing now'); // Debug log
  };

  const handleSaveCourse = async () => {
    if (!newCourse.name.trim() || !newCourse.professor.trim()) {
      toast.error("Please fill in course name and professor");
      return;
    }

    try {
      setLoading(true);
      await coursesService.create(newCourse);
      toast.success("Course created successfully!");
      setShowAddModal(false);
      setNewCourse({
        name: "",
        professor: "",
        room: "",
        schedule: [{ day: "Monday", time: "9:00 AM" }],
        color: "#4F46E5",
        credits: 3,
        semester: "Fall 2024"
      });
      await loadCourses();
    } catch (error) {
      toast.error("Failed to create course");
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewCourse({
      name: "",
      professor: "",
      room: "",
      schedule: [{ day: "Monday", time: "9:00 AM" }],
      color: "#4F46E5",
      credits: 3,
      semester: "Fall 2024"
    });
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...newCourse.schedule];
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
    setNewCourse(prev => ({ ...prev, schedule: updatedSchedule }));
  };

  const addScheduleSlot = () => {
    setNewCourse(prev => ({
      ...prev,
      schedule: [...prev.schedule, { day: "Monday", time: "9:00 AM" }]
    }));
  };

  const removeScheduleSlot = (index) => {
    if (newCourse.schedule.length > 1) {
      const updatedSchedule = newCourse.schedule.filter((_, i) => i !== index);
      setNewCourse(prev => ({ ...prev, schedule: updatedSchedule }));
    }
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

      {/* Add Course Modal */}
{showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Course</h3>
              <button
                onClick={handleCancelAdd}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name *
                </label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter course name"
                />
              </div>

              {/* Professor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professor *
                </label>
                <input
                  type="text"
                  value={newCourse.professor}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, professor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter professor name"
                />
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room
                </label>
                <input
                  type="text"
                  value={newCourse.room}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, room: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter room number"
                />
              </div>

              {/* Credits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credits
                </label>
                <select
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={1}>1 Credit</option>
                  <option value={2}>2 Credits</option>
                  <option value={3}>3 Credits</option>
                  <option value={4}>4 Credits</option>
                  <option value={5}>5 Credits</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester
                </label>
                <select
                  value={newCourse.semester}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, semester: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2024">Spring 2024</option>
                  <option value="Summer 2024">Summer 2024</option>
                  <option value="Fall 2025">Fall 2025</option>
                  <option value="Spring 2025">Spring 2025</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  {["#4F46E5", "#7C3AED", "#EC4899", "#10B981", "#F59E0B", "#EF4444"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCourse(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCourse.color === color ? "border-gray-600" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                {newCourse.schedule.map((slot, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={slot.day}
                      onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    <select
                      value={slot.time}
                      onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {Array.from({ length: 14 }, (_, i) => {
                        const hour = i + 8;
                        const time12 = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
                        return (
                          <option key={time12} value={time12}>
                            {time12}
                          </option>
                        );
                      })}
                    </select>
                    {newCourse.schedule.length > 1 && (
                      <button
                        onClick={() => removeScheduleSlot(index)}
                        className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addScheduleSlot}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                >
                  <ApperIcon name="Plus" size={14} />
                  Add Schedule Slot
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCancelAdd}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCourse}
                className="flex-1"
                disabled={!newCourse.name.trim() || !newCourse.professor.trim()}
              >
                Create Course
              </Button>
            </div>
          </motion.div>
        </div>
      )}

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