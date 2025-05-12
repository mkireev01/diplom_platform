import Home from "./pages/Home";
import VacancyList from "./pages/VacancyList";
import VacancyDetail from "./pages/VacancyDetail";
import ResumeList from "./pages/ResumeList";
import ResumeDetail from "./pages/ResumeDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Profile from "./pages/seeker/Profile";
import MyResumes from "./pages/seeker/MyResumes";
import Applications from "./pages/seeker/Applications";
import Chat from "./pages/Chat";
import CompanyProfile from "./pages/employer/CompanyProfile";
import PostVacancy from "./pages/employer/PostVacancy";
import MyVacancies from "./pages/employer/MyVacancies";
import Applicants from "./pages/employer/Applicants";


export const publicRoutes = [
  { path: "/", Component: Home },
  { path: "/login", Component: Auth },
  { path: "/register", Component: Auth},
  { path: "/vacancies", Component: VacancyList },
  { path: "/vacancy/:id", Component: VacancyDetail },
  { path: "/resumes", Component: ResumeList },
  { path: "/resume/:id", Component: ResumeDetail },
  { path: "*", Component: NotFound },
];

export const seekerRoutes = [
    { path: "/profile", Component: Profile },
    { path: "/my-resumes", Component: MyResumes },
    { path: "/applications", Component: Applications },
    { path: "/chat", Component: Chat},
];

export const employerRoutes = [
  { path: "/company", Component: CompanyProfile },
  { path: "/post-vacancy", Component: PostVacancy },
  { path: "/my-vacancies", Component: MyVacancies},
  { path: "/applicants", Component: Applicants },
  { path: "/chat", Component: Chat },
];