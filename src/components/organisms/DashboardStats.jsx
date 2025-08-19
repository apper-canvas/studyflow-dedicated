import { useMemo } from "react";
import { isToday, isTomorrow, addDays, isWithinInterval } from "date-fns";
import StatCard from "@/components/molecules/StatCard";

const DashboardStats = ({ assignments, courses, className = "" }) => {
  const stats = useMemo(() => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const weekFromNow = addDays(today, 7);

    const dueToday = assignments.filter(a => 
      a.status !== "completed" && isToday(new Date(a.dueDate))
    ).length;

    const dueTomorrow = assignments.filter(a => 
      a.status !== "completed" && isTomorrow(new Date(a.dueDate))
    ).length;

    const dueThisWeek = assignments.filter(a => 
      a.status !== "completed" && isWithinInterval(new Date(a.dueDate), {
        start: today,
        end: weekFromNow
      })
    ).length;

    const completed = assignments.filter(a => a.status === "completed").length;
    const completionRate = assignments.length > 0 ? (completed / assignments.length * 100) : 0;

    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    
    const weightedGradeSum = courses.reduce((sum, course) => sum + (course.grade * course.credits), 0);
    const currentGPA = totalCredits > 0 ? (weightedGradeSum / totalCredits / 20).toFixed(2) : "0.00";

    return {
      dueToday,
      dueTomorrow,
      dueThisWeek,
      completionRate: completionRate.toFixed(0),
      totalCourses: courses.length,
      currentGPA
    };
  }, [assignments, courses]);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      <StatCard
        title="Due Today"
        value={stats.dueToday}
        icon="Clock"
        color="accent"
        trend={stats.dueToday > 0 ? "up" : "down"}
        trendValue={`${stats.dueToday} items`}
      />
      
      <StatCard
        title="Due Tomorrow"
        value={stats.dueTomorrow}
        icon="Calendar"
        color="warning"
        trend={stats.dueTomorrow > 0 ? "up" : "down"}
        trendValue={`${stats.dueTomorrow} items`}
      />
      
      <StatCard
        title="Due This Week"
        value={stats.dueThisWeek}
        icon="CalendarDays"
        color="primary"
        trend={stats.dueThisWeek > 0 ? "up" : "down"}
        trendValue={`${stats.dueThisWeek} items`}
      />
      
      <StatCard
        title="Completion Rate"
        value={`${stats.completionRate}%`}
        icon="CheckCircle"
        color="success"
        trend={parseInt(stats.completionRate) >= 70 ? "up" : "down"}
        trendValue={`${stats.completionRate}% complete`}
      />
      
      <StatCard
        title="Active Courses"
        value={stats.totalCourses}
        icon="BookOpen"
        color="secondary"
        trend="up"
        trendValue={`${stats.totalCourses} courses`}
      />
      
      <StatCard
        title="Current GPA"
        value={stats.currentGPA}
        icon="TrendingUp"
        color="primary"
        trend={parseFloat(stats.currentGPA) >= 3.5 ? "up" : "down"}
        trendValue={`${stats.currentGPA} GPA`}
      />
    </div>
  );
};

export default DashboardStats;