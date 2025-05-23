import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import MyResumes from "./pages/seeker/MyResumes";
import Applications from "./pages/seeker/Applications";
import CompanyProfile from "./pages/employer/CompanyProfile";
import MyVacancies from "./pages/employer/MyVacancies";
import Applicants from "./pages/employer/Applicants";
import ItemDetailPage from "./pages/ItemDetailPage";
import UserProfile from "./pages/UserProfile";
import Resumes from "./pages/Resumes";
import Vacancies from "./pages/Vacancies";
import Users from "./pages/Users";
import Companies from "./pages/Companies";
import UserDetail from "./pages/UserDetail";


export const publicRoutes = [
  { path: "/", Component: Home },
  { path: "/login", Component: Auth },
  { path: "/registration", Component: Auth},
  { path: "/vacancies", Component: Vacancies },
  { path: "/vacancy/:id", Component: ItemDetailPage },
  { path: "/resumes", Component: Resumes},
  { path: "/resume/:id", Component: ItemDetailPage },
  { path: "*", Component: NotFound },
  { path: "/users", Component: Users},
  { path: "/users/:id", Component: UserDetail },
  { path: "/profile", Component: UserProfile },
  { path: "/companies", Component: Companies}
];

export const seekerRoutes = [
    { path: "/my-resumes", Component: MyResumes },
    { path: "/applications", Component: Applications },
];

export const employerRoutes = [
  { path: "/my-companies", Component: CompanyProfile },
  { path: "/my-vacancies", Component: MyVacancies},
  { path: "/applicants", Component: Applicants },
];