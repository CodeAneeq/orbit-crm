import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import  Loader  from "../components/loader/loader";

const LoginPage = lazy(()=> import("../pages/auth/login"));
const MembersPage = lazy(()=> import("../pages/members/members"));
const DashboardPage = lazy(()=> import("../pages/dashboard/dashboard"));
const AddMemberPage = lazy(()=> import("../pages/add-member/add-member"));
const AddClientPage = lazy(()=> import("../pages/add-client/add-client"));
const ClientsPage = lazy(()=> import("../pages/clients/clients"));
const LeadsPage = lazy(()=> import("../pages/leads/leads"));
const AddLeadPage = lazy(()=> import("../pages/add-lead/add-lead"));
const TasksPage = lazy(()=> import("../pages/tasks/tasks"));
const UpdateClientPage = lazy(()=> import("../pages/update-client/update-client"));
const AddTaskPage = lazy(()=> import("../pages/add-task/add-task"));
const UpdateTaskPage = lazy(()=> import("../pages/update-task/update-task"));
const ViewTaskPage = lazy(()=> import("../pages/view-task/view-task"));
const AddDepartmentPage = lazy(()=> import("../pages/add-department/add-department"));
const AssignClientPage = lazy(()=> import("../pages/assign-client/assign-client"));
const DepartmentsPage = lazy(()=> import("../pages/departments/departments"));
const AssignLeadPage = lazy(()=> import("../pages/assign-lead/assign-lead"));
const AssignTaskPage = lazy(()=> import("../pages/assign-task/assign-task"));
const LogsPage = lazy(()=> import("../pages/logs/logs.jsx"));
const NotificationsPage = lazy(()=> import("../pages/notifications/notifications"));

export const publicRoutes = createBrowserRouter([
    {
        path: '/',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><LoginPage></LoginPage></Suspense>,
    }
])

export const adminRoutes = createBrowserRouter([
    {
        path: '/',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><LoginPage></LoginPage></Suspense>,
    },
    {
        path: '/dashboard',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><DashboardPage></DashboardPage></Suspense>
    },
    {
        path: '/members',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><MembersPage></MembersPage></Suspense>
    },
    {
        path: '/add-member',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AddMemberPage></AddMemberPage></Suspense>
    },
    {
        path: '/add-client',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AddClientPage></AddClientPage></Suspense>
    },
    {
        path: '/add-lead',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AddLeadPage></AddLeadPage></Suspense>
    },
    {
        path: '/add-task',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AddTaskPage></AddTaskPage></Suspense>
    },
    {
        path: '/add-department',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AddDepartmentPage></AddDepartmentPage></Suspense>
    },
    {
        path: '/clients',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><ClientsPage></ClientsPage></Suspense>
    },
    {
        path: '/departments',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><DepartmentsPage></DepartmentsPage></Suspense>
    },
    {
        path: '/leads',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><LeadsPage></LeadsPage></Suspense>
    },
    {
        path: '/tasks',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><TasksPage></TasksPage></Suspense>
    },
    {
        path: `/update-client/:id`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><UpdateClientPage></UpdateClientPage></Suspense>
    },
    {
        path: `/update-task/:id`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><UpdateTaskPage></UpdateTaskPage></Suspense>
    },
    {
        path: `/view-task/:id`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><ViewTaskPage></ViewTaskPage></Suspense>
    },
      {
        path: `/logs`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><LogsPage></LogsPage></Suspense>
    },
])

export const managerRoutes = createBrowserRouter([
    {
        path: '/',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><LoginPage></LoginPage></Suspense>,
    },
    {
        path: '/dashboard',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><DashboardPage></DashboardPage></Suspense>
    },
    {
        path: '/members',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><MembersPage></MembersPage></Suspense>
    },
    {
        path: '/add-client',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AddClientPage></AddClientPage></Suspense>
    },
    {
        path: '/add-lead',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AddLeadPage></AddLeadPage></Suspense>
    },
    {
        path: '/add-task',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AddTaskPage></AddTaskPage></Suspense>
    },
    {
        path: '/clients',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><ClientsPage></ClientsPage></Suspense>
    },
    {
        path: '/leads',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><LeadsPage></LeadsPage></Suspense>
    },
    {
        path: '/tasks',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><TasksPage></TasksPage></Suspense>
    },
    {
        path: `/update-client/:id`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><UpdateClientPage></UpdateClientPage></Suspense>
    },
    {
        path: `/update-task/:id`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><UpdateTaskPage></UpdateTaskPage></Suspense>
    },
    {
        path: `/view-task/:id`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><ViewTaskPage></ViewTaskPage></Suspense>
    },
    {
        path: `/assign-client/:id`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AssignClientPage></AssignClientPage></Suspense>
    },
    {
        path: `/assign-lead/:id`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AssignLeadPage></AssignLeadPage></Suspense>
    },
    {
        path: `/assign-task/:id`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><AssignTaskPage></AssignTaskPage></Suspense>
    },
    {
        path: `/logs`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><LogsPage></LogsPage></Suspense>
    },
    {
        path: `/notifications`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><NotificationsPage></NotificationsPage></Suspense>
    },
])

export const memberRoutes = createBrowserRouter([
     {
        path: '/',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><LoginPage></LoginPage></Suspense>,
    },
    {
        path: `/leads`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><LeadsPage></LeadsPage></Suspense>
    },
    {
        path: `/tasks`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><TasksPage></TasksPage></Suspense>
    },
    {
        path: `/view-task/:id`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><ViewTaskPage></ViewTaskPage></Suspense>
    },
      {
        path: '/clients',
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><ClientsPage></ClientsPage></Suspense>
    },
      {
        path: `/logs`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><LogsPage></LogsPage></Suspense>
    },
      {
        path: `/notifications`,
        element: <Suspense fallback={<Loader fullScreen={true}></Loader>}><NotificationsPage></NotificationsPage></Suspense>
    },
])