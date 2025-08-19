import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "./store/userSlice";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import { assignmentsService } from "@/services/api/assignmentsService";
import { coursesService } from "@/services/api/coursesService";
import Assignments from "@/components/pages/Assignments";
import Dashboard from "@/components/pages/Dashboard";
import Grades from "@/components/pages/Grades";
import Calendar from "@/components/pages/Calendar";
import Courses from "@/components/pages/Courses";
import Loading from "@/components/ui/Loading";
import QuickAddForm from "@/components/molecules/QuickAddForm";
import Layout from "@/components/organisms/Layout";

export const AuthContext = createContext(null)

function AppContent() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [courses, setCourses] = useState([])
  
  const userState = useSelector((state) => state.user)
  const isAuthenticated = userState?.isAuthenticated || false

  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true)
        let currentPath = window.location.pathname + window.location.search
        let redirectPath = new URLSearchParams(window.location.search).get('redirect')
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password')
        
        if (user) {
          if (redirectPath) {
            navigate(redirectPath)
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath)
            } else {
              navigate('/')
            }
          } else {
            navigate('/')
          }
          dispatch(setUser(JSON.parse(JSON.stringify(user))))
        } else {
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            )
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`)
            } else {
              navigate(currentPath)
            }
          } else if (isAuthPage) {
            navigate(currentPath)
          } else {
            navigate('/login')
          }
          dispatch(clearUser())
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error)
        setIsInitialized(true)
      }
    })
  }, [navigate, dispatch])

  const loadCourses = async () => {
    try {
      const data = await coursesService.getAll()
      setCourses(data)
    } catch (err) {
      toast.error("Failed to load courses")
    }
  }

  const handleQuickAdd = async () => {
    await loadCourses()
    setShowQuickAdd(true)
  }

  const handleQuickAddSubmit = async (assignmentData) => {
    try {
      await assignmentsService.create(assignmentData)
      setShowQuickAdd(false)
      toast.success("Assignment added successfully!")
    } catch (err) {
      toast.error("Failed to add assignment")
    }
  }

  const handleEditAssignment = (assignment) => {
    toast.info(`Edit assignment: ${assignment.title_c || assignment.title} - Feature coming soon!`)
  }

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentsService.delete(assignmentId)
        toast.success("Assignment deleted successfully!")
        window.location.reload()
      } catch (err) {
        toast.error("Failed to delete assignment")
      }
    }
  }

  const handleToggleAssignmentStatus = async (assignmentId) => {
    try {
      const assignment = await assignmentsService.getById(assignmentId)
      const currentStatus = assignment.status_c || assignment.status
      const newStatus = currentStatus === "completed" ? "pending" : "completed"
      
      await assignmentsService.update(assignmentId, { status_c: newStatus })
      toast.success(`Assignment marked as ${newStatus}!`)
    } catch (err) {
      toast.error("Failed to update assignment status")
    }
  }

  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK
        await ApperUI.logout()
        dispatch(clearUser())
        navigate('/login')
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
          <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
          <Route path="/" element={<Layout onQuickAdd={handleQuickAdd} />}>
            <Route 
              index 
              element={
                <Dashboard 
                  onEditAssignment={handleEditAssignment}
                  onDeleteAssignment={handleDeleteAssignment}
                  onToggleAssignmentStatus={handleToggleAssignmentStatus}
                />
              } 
            />
            <Route path="courses" element={<Courses />} />
            <Route 
              path="assignments" 
              element={
                <Assignments 
                  onAddAssignment={handleQuickAdd}
                />
              } 
            />
            <Route path="calendar" element={<Calendar />} />
            <Route path="grades" element={<Grades />} />
          </Route>
        </Routes>
        <AnimatePresence>
          {showQuickAdd && (
            <QuickAddForm 
              courses={courses} 
              onSubmit={handleQuickAddSubmit} 
              onCancel={() => setShowQuickAdd(false)} 
            />
          )}
        </AnimatePresence>
      </div>
    </AuthContext.Provider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App