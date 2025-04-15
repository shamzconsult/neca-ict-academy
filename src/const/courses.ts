import { BsPlayBtn } from "react-icons/bs";
import {
  FiAirplay,
  FiBarChart,
  FiCpu,
  FiLayers,
  FiServer,
  FiSliders,
} from "react-icons/fi";
import { MdAccessTime } from "react-icons/md";
import { VscInbox } from "react-icons/vsc";

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

export const courseDetails = [
  {
    title: "Lessons",
    value: "128",
    description:
      "Carefully structured lessons designed to take you from the basics of software engineering to advanced development skills. Each lesson is crafted to provide hands-on experience, covering front-end and back-end development, API integration, version control, testing, and deployment.",
    icon: BsPlayBtn,
  },
  {
    title: "Duration",
    value: "6 Months",
    description:
      "Flexible and self-paced with live sessions and hands-on projects. You’ll have access to live sessions, recorded classes, and hands-on projects throughout the course. Learn at your own pace while receiving real-time support from instructors and peers.",
    icon: MdAccessTime,
  },
  {
    title: "Skill Level",
    value: "Beginner to Advanced",
    description:
      "This course is designed for learners at all levels. Whether you’re a complete beginner or someone looking to advance your software engineering skills, the structured lessons and hands-on projects will take you from the fundamentals to mastering full-stack development.",
    icon: FiBarChart,
  },
];
