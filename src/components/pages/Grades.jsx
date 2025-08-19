import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { coursesService } from "@/services/api/coursesService";
import { gradeCategoriesService } from "@/services/api/gradeCategoriesService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [gradeCategories, setGradeCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, categoriesData] = await Promise.all([
        coursesService.getAll(),
        gradeCategoriesService.getAll()
      ]);
      setCourses(coursesData);
      setGradeCategories(categoriesData);
      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateCategoryGrade = (category) => {
    if (category.grades.length === 0) return 0;
    const totalPoints = category.grades.reduce((sum, grade) => sum + grade.value, 0);
    const maxPoints = category.grades.reduce((sum, grade) => sum + grade.maxValue, 0);
    return maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
  };

  const calculateOverallGPA = () => {
    if (courses.length === 0) return 0;
    const totalPoints = courses.reduce((sum, course) => sum + (course.grade * course.credits), 0);
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits / 20).toFixed(2) : "0.00";
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-emerald-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-amber-600";
    return "text-red-600";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 font-display">Grades</h1>
        <Empty
          title="No grades to display"
          message="Once you add courses and assignments, your grades will appear here. Track your academic progress all in one place."
          icon="TrendingUp"
        />
      </div>
    );
  }

  const selectedCourseCategories = gradeCategories.filter(
    cat => cat.courseId === selectedCourse?.Id
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-display">Grades</h1>
        <p className="text-gray-600 mt-1">Track your academic performance across all courses</p>
      </div>

      {/* Overall GPA Card */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-primary-100 mb-1">Current GPA</h2>
            <div className="text-4xl font-bold font-display">{calculateOverallGPA()}</div>
            <p className="text-primary-100 mt-1">{courses.length} courses • {courses.reduce((sum, c) => sum + c.credits, 0)} credits</p>
          </div>
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <ApperIcon name="Award" size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 font-display">Course Grades</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {courses.map(course => (
            <motion.button
              key={course.Id}
              onClick={() => setSelectedCourse(course)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedCourse?.Id === course.Id
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: course.color }}
                ></div>
                <div className={`text-xl font-bold ${getGradeColor(course.grade)} font-display`}>
                  {course.grade.toFixed(1)}%
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 font-display">{course.name}</h3>
              <p className="text-sm text-gray-600">{course.professor}</p>
              <Badge variant="default" className="mt-2">
                {course.credits} Credits
              </Badge>
            </motion.button>
          ))}
        </div>

        {/* Selected Course Details */}
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-gray-200 pt-6"
          >
            <div className="flex items-center space-x-4 mb-6">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: selectedCourse.color }}
              ></div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-display">{selectedCourse.name}</h3>
                <p className="text-gray-600">{selectedCourse.professor} • {selectedCourse.room}</p>
              </div>
              <div className="ml-auto text-right">
                <div className={`text-3xl font-bold ${getGradeColor(selectedCourse.grade)} font-display`}>
                  {selectedCourse.grade.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500">Current Grade</p>
              </div>
            </div>

            {selectedCourseCategories.length === 0 ? (
              <Empty
                title="No grade categories"
                message="Grade breakdown will appear here once categories are added for this course."
                icon="BarChart3"
                className="min-h-[200px]"
              />
            ) : (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 font-display">Grade Breakdown</h4>
                {selectedCourseCategories.map(category => {
                  const categoryGrade = calculateCategoryGrade(category);
                  return (
                    <div key={category.Id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">{category.name}</h5>
                          <p className="text-sm text-gray-600">{category.weight}% of total grade</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${getGradeColor(categoryGrade)} font-display`}>
                            {categoryGrade.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      {category.grades.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {category.grades.map((grade, index) => (
                            <div key={index} className="bg-white rounded p-3 border border-gray-200">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Grade {index + 1}</span>
                                <div className={`font-semibold ${getGradeColor((grade.value / grade.maxValue) * 100)}`}>
                                  {grade.value}/{grade.maxValue}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {((grade.value / grade.maxValue) * 100).toFixed(1)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Grades;