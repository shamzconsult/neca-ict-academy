import {
  FiAirplay,
  FiCpu,
  FiLayers,
  FiServer,
  FiSliders,
} from "react-icons/fi";
import { VscInbox } from "react-icons/vsc";

export type CourseType = {
  id: string;
  slug?: string;
  image: string;
  title: string;
  description: string;
  ratings?: string;
  reviews?: string;
  lessons?: string;
  duration?: string;
  skillLevel?: string;
  mode?: string;
  category?: string;
};

// export const courses: CourseType[] = [
//   {
//     id: "1",
//     image:
//       "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324797/photo-1610563166150-b34df4f3bcd6_gcmqes.png",
//     title: "Software Engineering Track",
//     description:
//       "This track covers various aspects of the software development lifecycle, from writing clean code to testing, debugging, and deploying applications, preparing participants for careers as software engineers in diverse industries.",
//   },
//   {
//     id: "2",
//     image:
//       "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324797/machine-learning1020114645_yhbng9.png",
//     title: "AI & Machine Learning Track",
//     description:
//       "Dive into the world of Artificial Intelligence and Machine Learning. This track covers key concepts, algorithms, and applications, equipping you with the skills to build intelligent systems and develop machine learning models for real-world challenges.",
//   },
//   {
//     id: "3",
//     image:
//       "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324797/data-anayatics-image_cuamla.png",
//     title: "Data Analytics Track",
//     description:
//       "A specialized program designed to equip learners with essential skills in data collection, processing, analysis, and visualization. This track covers tools like Excel, SQL, Python, and data visualization platforms.",
//   },
//   {
//     id: "4",
//     image:
//       "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324797/1725738547232_jcx0us.png",
//     title: "Product Management Track",
//     description:
//       "A comprehensive program designed to equip individuals with the essential skills and knowledge needed to excel in product management.",
//   },
//   {
//     id: "5",
//     image:
//       "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324797/Implementing-DevSecOps-in-Your-Organization-Blog-Fetaured-Image_tbujvf.png",
//     title: "DevSecOps Engineering Track",
//     description:
//       "A specialized program focused on integrating security practices into every stage of the software development lifecycle.",
//   },
//   {
//     id: "6",
//     image:
//       "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324796/Cloud-Computing-course-in-Noida_bw9wjp.png",
//     title: "Cloud Computing Track",
//     description:
//       "A specialized learning path focused on the principles and architecture of cloud computing. Gain hands-on experience in managing cloud-based solutions and optimizing performance.",
//   },
// ];

export const maincourses: CourseType[] = [
  {
    id: "1",
    image:
      "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324797/photo-1610563166150-b34df4f3bcd6_gcmqes.png",
    title: "Software Engineering Track",
    slug: "software-engineering-track",
    description:
      "This track covers various aspects of the software development lifecycle, from writing clean code to testing, debugging, and deploying applications, preparing participants for careers as software engineers in diverse industries.",
    ratings: "5.0",
    reviews: "24 reviews",
    lessons: "128",
    duration: "3 Months",
    skillLevel: "Beginner",
    mode: "Physical",
    category: "technical",
  },
  {
    id: "2",
    image:
      "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324797/machine-learning1020114645_yhbng9.png",
    title: "AI & Machine Learning Track",
    slug: "ai-and-machine-learning",
    description:
      "Dive into the world of Artificial Intelligence and Machine Learning. This track covers key concepts, algorithms, and applications, equipping you with the skills to build intelligent systems and develop machine learning models for real-world challenges.",
    ratings: "4.8",
    reviews: "19 reviews",
    lessons: "128",
    duration: "3 weeks",
    skillLevel: "Beginner",
    mode: "Physical",
    category: "technical",
  },
  {
    id: "3",
    image:
      "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324797/data-anayatics-image_cuamla.png",
    title: "Data Analytics Track",
    slug: "data-analytics",
    description:
      "A specialized program designed to equip learners with essential skills in data collection, processing, analysis, and visualization. This track covers tools like Excel, SQL, Python, and data visualization platforms.",
    ratings: "4.9",
    reviews: "22 reviews",
    lessons: "128",
    duration: "48hrs 10mins",
    skillLevel: "Beginner",
    mode: "Physical",
    category: "technical",
  },
  {
    id: "4",
    image:
      "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324797/1725738547232_jcx0us.png",
    title: "Product Management Track",
    slug: "product-management",
    description:
      "A comprehensive program designed to equip individuals with the essential skills and knowledge needed to excel in product management.",
    ratings: "4.7 ",
    reviews: "18 reviews",
    lessons: "128",
    duration: "2 Month",
    skillLevel: "Beginner",
    mode: "Physical",
    category: "professional",
  },
  {
    id: "5",
    image:
      "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324797/Implementing-DevSecOps-in-Your-Organization-Blog-Fetaured-Image_tbujvf.png",
    title: "DevSecOps Engineering Track",
    slug: "devSecOps-engineering",
    description:
      "A specialized program focused on integrating security practices into every stage of the software development lifecycle.",
    ratings: "4.8",
    reviews: "21 reviews",
    lessons: "128",
    duration: "10 weeks",
    skillLevel: "Beginner",
    mode: "Physical",
    category: "professional",
  },
  {
    id: "6",
    image:
      "https://res.cloudinary.com/dcgghkk7q/image/upload/v1741324796/Cloud-Computing-course-in-Noida_bw9wjp.png",
    title: "Cloud Computing Track",
    slug: "cloud-computing",
    description:
      "A specialized learning path focused on the principles and architecture of cloud computing. Gain hands-on experience in managing cloud-based solutions and optimizing performance.",
    ratings: "4.9",
    reviews: "20 reviews",
    lessons: "128",
    duration: "2hrs 20mins",
    skillLevel: "Beginner",
    mode: "Physical",
    category: "professional",
  },
];

export const courseModules = [
  {
    month: "Month 1",
    title: "Web Development Foundations",
    items: [
      "HTML, CSS, JavaScript",
      "Responsive design & accessibility",
      "Git & GitHub workflow",
      "Personal Project: Build a personal portfolio website",
    ],
    icon: FiLayers,
  },
  {
    month: "Month 2",
    title: "Frontend Development (React.js & UI Design)",
    items: [
      "React.js fundamentals",
      "State management (useState, useEffect, Context API)",
      "Tailwind CSS, Chakra UI, or Material UI",
      "Personal Project: Build an interactive dashboard",
    ],
    icon: FiAirplay,
  },
  {
    month: "Month 3",
    title: "Backend Development & APIs",
    items: [
      "Node.js, Express.js",
      "RESTful & GraphQL APIs",
      "Database management (PostgreSQL, MongoDB)",
      "Personal Project: Build a task management API",
    ],
    icon: FiCpu,
  },
  {
    month: "Month 4",
    title: "Authentication, Testing & DevOps",
    items: [
      "JWT authentication, OAuth, Role-based Access Control (RBAC)",
      "Unit & integration testing with Jest",
      "CI/CD pipelines, Docker basics",
      "Personal Project: Deploy a secure SaaS application",
    ],
    icon: VscInbox,
  },
  {
    month: "Month 5",
    title: "Advanced Full-Stack & System Design",
    items: [
      "Microservices architecture",
      "Serverless computing & cloud deployments",
      "Performance optimization & caching strategies",
      "Personal Project: Scalable real-world application",
    ],
    icon: FiServer,
  },
  {
    month: "Month 6",
    title: "Group Project & Job-Readiness",
    items: [
      "Group Project: Build a full-fledged SaaS platform",
      "Agile workflow, version control, PR reviews",
      "Resume writing, LinkedIn optimization, mock interviews",
    ],
    icon: FiSliders,
  },
];
