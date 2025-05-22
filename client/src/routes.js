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


export const publicRoutes = [
  { path: "/", Component: Home },
  { path: "/login", Component: Auth },
  { path: "/registration", Component: Auth},
  { path: "/vacancies", Component: Home },
  { path: "/vacancy/:id", Component: ItemDetailPage },
  { path: "/resumes", Component: Home},
  { path: "/resume/:id", Component: ItemDetailPage },
  { path: "*", Component: NotFound },
  { path: "/profile", Component: UserProfile },
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