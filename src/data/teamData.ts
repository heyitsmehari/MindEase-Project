export interface TeamMember {
    id: number;
    name: string;
    role: string;
    desc: string;
    image: string;
    tags: string[];
    github: string;
    linkedin: string;
    email: string;
    isLeader: boolean;
    color: string;
    light: string;
}

export const TEAM: TeamMember[] = [
    {
        id: 1,
        name: 'Priya ',
        role: 'Team Leader & Full Stack Developer',
        desc: 'Visionary behind MindEase. Leads the product strategy, UI architecture, and backend integration. Passionate about mental health tech and student wellbeing.',
        image: "https://i.ibb.co/tPTbPK6H/Whats-App-Image-2026-03-12-at-16-15-45.jpg",
        tags: ['React', 'TypeScript', 'Firebase', 'UI/UX'],
        github: 'https://github.com/Priyakatariya', linkedin: 'https://www.linkedin.com/in/priya-27a522333/', email: 'priaykatariya2007@gmail.com',
        isLeader: true,
        color: '#D4617A',
        light: '#FFE8ED',
    },
    {
        id: 2,
        name: 'Amica',
        role: 'Frontend Developer & Figma Designer',
        desc: 'Builds the AI chatbot pipeline and server logic. Specializes in NLP models and emotional intelligence systems.',
        image: "https://i.ibb.co/JFMGp1b9/picture.jpg",
        tags: ['Python', 'Frontend', 'Node.js','Figma'],
        github: '#https://github.com/flueres', linkedin: 'https://www.linkedin.com/in/amica-aggarwal-b00918381?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', email: '124303003@nitkkr.ac.in',
        isLeader: false,
        color: '#C44A6A',
        light: '#FFE0E6',
    },
    {
        id: 3,
        name: 'Trishna Saini',
        role: 'UI/UX Designer & Frontend Developer',
        desc: 'Crafts the resources and about page content. Ensures all information is accurate, empathetic, and student-friendly.',
        image: "https://i.ibb.co/j9DWPqFH/Whats-App-Image-2026-03-04-at-14-13-33-1.jpg",
        tags: ['React', 'Tailwind CSS', 'Content Strategy'],
        github: 'https://github.com/trishnaaa22', linkedin: 'https://www.linkedin.com/in/trishna-saini-4b141428a?utm_source=share_via&utm_content=profile&utm_medium=member_ios', email: 'trishnasaini22@gmail.com',
        isLeader: false,
        color: '#EC4899',
        light: '#FCE7F3',
    },
    {
        id: 4,
        name: 'Krishna Kumar',
        role: 'Developer ',
        desc: 'Make mood tracker page, mood tracker engine, emergency helpline content, and deployment pipelines. Keeps the platform secure and performant.',
        image: "https://i.ibb.co/jPp4fWPk/IMG-20260311-WA0010.jpg",
        tags: ['Firebase', 'CI/CD', 'Security','Frontend'],
        github: 'https://github.com/KrishnaKumar1506', linkedin: 'https://www.linkedin.com/in/krishna-kumar-here', email: '124103044@nitkkr.ac.in',
        isLeader: false,
        color: '#10B981',
        light: '#D1FAE5',
    },
    {
        id: 5,
        name: 'Hariram',
        role: 'AI chatbot developer and FAQ Content',
        desc: 'Make AI Chatbot and FAQ Contents.',
        image: "https://i.ibb.co/vxN64GzG/IMG-20260312-WA0053.jpg",
        tags: ['GeminiAPI', 'Artificial Intelligence', 'Content','Chatbot'],
        github: 'https://github.com/heyitsmehari', linkedin: 'https://www.linkedin.com/in/hariram-chembra-77a82b217/?skipRedirect=true', email: 'Chembrahariram5@gmail.com',
        isLeader: false,
        color: '#F59E0B',
        light: '#FEF3C7',
    }
];