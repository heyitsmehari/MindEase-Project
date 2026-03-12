// Shared mentor data — used in Home.tsx, Mentor.tsx, and MentorDetail.tsx

export interface Mentor {
    id: number;
    name: string;
    role: string;
    specialty: string;
    experience: string;
    rating: number;
    sessions: number;
    image: string;
    email: string;
    bio: string;
    tags: string[];
}

export const MENTORS: Mentor[] = [
    {
        id: 1,
        name: "Priya",
        role: "Team Leader",
        specialty: "Developer",
        experience: "12+ Years",
        rating: 4.9,
        sessions: 340,
        image: "https://i.ibb.co/tPTbPK6H/Whats-App-Image-2026-03-12-at-16-15-45.jpg",
        email: "mentor1@mindease.edu", // Replace with real mentor email
        bio: "Led the project.",
        tags: ["Mindfulness", "CBT", "Anxiety Relief", "Academic Stress", "Breathing Techniques"],
    },
    {
        id: 2,
        name: "Amica Aggarwal",
        role: "Team Member",
        specialty: "Developer",
        experience: "8 Years",
        rating: 4.8,
        sessions: 210,
        image: "https://ibb.co/rKGjPdpL",
        email: "mentor2@mindease.edu", // Replace with real mentor email
        bio: "Worked on the project.",
        tags: ["Work-Life Balance", "Habit Building", "Time Management", "Burnout Prevention"],
    },
    {
        id: 3,
        name: "Trishna Saini",
        role: "Team Member",
        specialty: "Developer",
        experience: "10 Years",
        rating: 5.0,
        sessions: 280,
        image: "https://i.ibb.co/j9DWPqFH/Whats-App-Image-2026-03-04-at-14-13-33-1.jpg",
        email: "mentor3@mindease.edu", // Replace with real mentor email
        bio: "Worked on the project.",
        tags: ["Cognitive Behavioral Therapy", "Stress Reduction", "Thought Patterns", "Exam Anxiety"],
    },
    {
        id: 4,
        name: "Krishna Kumar",
        role: "Team Member",
        specialty: "Developer",
        experience: "15 Years",
        rating: 4.7,
        sessions: 420,
        image: "https://i.ibb.co/jPp4fWPk/IMG-20260311-WA0010.jpg",
        email: "mentor4@mindease.edu", // Replace with real mentor email
        bio: "Worked on the project.",
        tags: ["Conflict Resolution", "Communication", "Relationships", "Social Skills", "Peer Dynamics"],
    },
    {
        id: 5,
        name: "Hariram Chembra",
        role: "Team Member",
        specialty: "Emotional Healing",
        experience: "9 Years",
        rating: 4.9,
        sessions: 195,
        image: "https://i.ibb.co/vxN64GzG/IMG-20260312-WA0053.jpg",
        email: "mentor5@mindease.edu", // Replace with real mentor email
        bio: "Worked on the project.",
        tags: ["Trauma Healing", "Emotional Safety", "Self-Compassion", "Resilience Building"],
    },
]
