import LoginPage from "@/pages/LoginPage"
import { Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"
import TaskBoard from "@/pages/Taskboard"
import CalendarPage from "@/pages/CalendarPage"
import { R } from "node_modules/@tanstack/react-query-devtools/build/modern/devtools-5fd5b190"

export const AppRoute = () => {

    return (
        <Routes>
            <Route path="*" element={<Navigate to={"/"} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/board" element={<TaskBoard />} />
                <Route path="/calendar" element={<CalendarPage />} />
            </Route>
        </Routes>
    )
}