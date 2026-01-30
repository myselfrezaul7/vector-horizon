import { Award, Clock, Briefcase, Globe, GraduationCap, Users, Landmark, Sun, BookOpen, MapPin, DollarSign } from "lucide-react";

export type Destination = {
    slug: string;
    name: string;
    hero: {
        title: string;
        description: string;
        icon: any; // Lucide Icon
    };
    benefits: {
        title: string;
        description: string;
        icon: any;
    }[];
    universities: {
        name: string;
        campusImage: string;
        atmosphereImage: string;
    }[];
};

export const destinations: Record<string, Destination> = {
    uk: {
        slug: "uk",
        name: "United Kingdom",
        hero: {
            title: "Study in the UK",
            description: "There's a reason people have been flocking to British universities for centuries. The education is solid, the culture is rich, and honestly? That accent doesn't hurt either.",
            icon: Landmark,
        },
        benefits: [
            {
                title: "Degrees That Open Doors",
                description: "A UK degree carries weight everywhere. Employers worldwide recognize the rigorous standards.",
                icon: Award,
            },
            {
                title: "Finish Faster",
                description: "Three-year bachelor's degrees and one-year master's programs mean saving time and money.",
                icon: Clock,
            },
            {
                title: "Stay and Work",
                description: "The Graduate Route visa lets you stick around for 2 years after graduating to find work.",
                icon: Briefcase,
            },
            {
                title: "Cultural Melting Pot",
                description: "London alone has people from over 180 countries. You'll make friends from everywhere.",
                icon: Globe,
            },
        ],
        universities: [
            { name: "University of Oxford", campusImage: "/assets/uk-uni.png", atmosphereImage: "/assets/uk-atm.png" },
            { name: "University of Cambridge", campusImage: "/assets/uk-uni.png", atmosphereImage: "/assets/uk-atm.png" },
            { name: "Imperial College London", campusImage: "/assets/uk-uni.png", atmosphereImage: "/assets/uk-atm.png" },
            { name: "UCL (University College London)", campusImage: "/assets/uk-uni.png", atmosphereImage: "/assets/uk-atm.png" },
            { name: "University of Edinburgh", campusImage: "/assets/uk-uni.png", atmosphereImage: "/assets/uk-atm.png" },
            { name: "King's College London", campusImage: "/assets/uk-uni.png", atmosphereImage: "/assets/uk-atm.png" },
            { name: "University of Manchester", campusImage: "/assets/uk-uni.png", atmosphereImage: "/assets/uk-atm.png" },
        ],
    },
    usa: {
        slug: "usa",
        name: "USA",
        hero: {
            title: "Study in the USA",
            description: "Home to the Ivy League and Silicon Valley. If you want to dream big and hustle hard, this is the place to be.",
            icon: GraduationCap,
        },
        benefits: [
            {
                title: "World-Class Education",
                description: "US universities dominate global rankings. You're getting a brand name on your resume.",
                icon: Award,
            },
            {
                title: "Flexibility",
                description: "Change your major, double major, take weird electives. Explore before you commit.",
                icon: BookOpen,
            },
            {
                title: "Campus Life",
                description: "Sports, clubs, Greek life... US campuses are their own little cities.",
                icon: Users,
            },
            {
                title: "OPT Opportunities",
                description: "Work for up to 3 years after graduation in STEM fields. A massive career boost.",
                icon: Briefcase,
            },
        ],
        universities: [
            { name: "Harvard University", campusImage: "/assets/usa-uni.png", atmosphereImage: "/assets/usa-atm.png" },
            { name: "Stanford University", campusImage: "/assets/usa-uni.png", atmosphereImage: "/assets/usa-atm.png" },
            { name: "MIT", campusImage: "/assets/usa-uni.png", atmosphereImage: "/assets/usa-atm.png" },
            { name: "UCLA", campusImage: "/assets/usa-uni.png", atmosphereImage: "/assets/usa-atm.png" },
            { name: "Columbia University", campusImage: "/assets/usa-uni.png", atmosphereImage: "/assets/usa-atm.png" },
        ],
    },
    australia: {
        slug: "australia",
        name: "Australia",
        hero: {
            title: "Study in Australia",
            description: "World-class education meets an unbeatable lifestyle. Surf before class, barbecue after.",
            icon: Sun,
        },
        benefits: [
            {
                title: "Top Universities",
                description: "Australia has 7 of the top 100 universities in the world.",
                icon: Award,
            },
            {
                title: "Work While Studying",
                description: "Generous work rights for international students.",
                icon: Briefcase,
            },
            {
                title: "Quality of Life",
                description: "Consistently ranked as one of the best places to live in the world.",
                icon: Globe,
            },
            {
                title: "Post-Study Work",
                description: "Stay and work in Australia for up to 4-6 years depending on your degree.",
                icon: Clock,
            },
        ],
        universities: [
            { name: "University of Melbourne", campusImage: "/assets/australia-uni.png", atmosphereImage: "/assets/australia-atm.png" },
            { name: "Australian National University", campusImage: "/assets/australia-uni.png", atmosphereImage: "/assets/australia-atm.png" },
            { name: "University of Sydney", campusImage: "/assets/australia-uni.png", atmosphereImage: "/assets/australia-atm.png" },
        ],
    },
    canada: {
        slug: "canada",
        name: "Canada",
        hero: {
            title: "Study in Canada",
            description: "Friendly people, stunning nature, and a welcoming environment for international students.",
            icon: MapPin,
        },
        benefits: [
            {
                title: "Affordable Excellence",
                description: "High academic standards with lower tuition fees than the US or UK.",
                icon: DollarSign,
            },
            {
                title: "Path to PR",
                description: "One of the most straightforward pathways to permanent residency.",
                icon: Briefcase,
            },
            {
                title: "Multicultural",
                description: "A truly diverse society where meaningful inclusion is the norm.",
                icon: Globe,
            },
            {
                title: "Tech Hubs",
                description: "Growing tech scenes in Toronto, Vancouver, and Montreal.",
                icon: Briefcase,
            },
        ],
        universities: [
            { name: "University of Toronto", campusImage: "/assets/canada-uni.png", atmosphereImage: "/assets/canada-atm.png" },
            { name: "University of British Columbia", campusImage: "/assets/canada-uni.png", atmosphereImage: "/assets/canada-atm.png" },
            { name: "McGill University", campusImage: "/assets/canada-uni.png", atmosphereImage: "/assets/canada-atm.png" },
        ],
    },
    germany: {
        slug: "germany",
        name: "Germany",
        hero: {
            title: "Study in Germany",
            description: "Innovation, engineering, and (often) tuition-free education at public universities.",
            icon: Landmark,
        },
        benefits: [
            {
                title: "No Tuition Fees",
                description: "Most public universities are tuition-free for international students.",
                icon: DollarSign,
            },
            {
                title: "Strong Economy",
                description: "The largest economy in Europe with endless career opportunities.",
                icon: Briefcase,
            },
            {
                title: "English Programs",
                description: "Many master's programs are taught entirely in English.",
                icon: BookOpen,
            },
            {
                title: "Central Europe",
                description: "Travel easily to France, Netherlands, Austria, and more.",
                icon: MapPin,
            },
        ],
        universities: [
            { name: "Technical University of Munich", campusImage: "/assets/germany-uni.png", atmosphereImage: "/assets/germany-atm.png" },
            { name: "Ludwig Maximilian University", campusImage: "/assets/germany-uni.png", atmosphereImage: "/assets/germany-atm.png" },
            { name: "Heidelberg University", campusImage: "/assets/germany-uni.png", atmosphereImage: "/assets/germany-atm.png" },
        ],
    },
    france: {
        slug: "france",
        name: "France",
        hero: {
            title: "Study in France",
            description: "Art, fashion, cuisine, and world-renowned institutions in the heart of Europe.",
            icon: Globe,
        },
        benefits: [
            {
                title: "Affordable Education",
                description: "Public universities offer very low tuition rates.",
                icon: DollarSign,
            },
            {
                title: "Culture",
                description: "Immerse yourself in a country rich in history and culture.",
                icon: Landmark,
            },
            {
                title: "Language",
                description: "Learn French, a global language spoken by millions.",
                icon: BookOpen,
            },
            {
                title: "Research",
                description: "Strong focus on research and innovation.",
                icon: Award,
            },
        ],
        universities: [
            { name: "Sorbonne University", campusImage: "/assets/france-uni.png", atmosphereImage: "/assets/france-atm.png" },
            { name: "École Polytechnique", campusImage: "/assets/france-uni.png", atmosphereImage: "/assets/france-atm.png" },
            { name: "PSL Research University", campusImage: "/assets/france-uni.png", atmosphereImage: "/assets/france-atm.png" },
        ],
    },
    china: {
        slug: "china",
        name: "China",
        hero: {
            title: "Study in China",
            description: "Experience a blend of ancient tradition and futuristic innovation.",
            icon: Globe,
        },
        benefits: [
            {
                title: "Global Powerhouse",
                description: "Understand the world's second-largest economy from the inside.",
                icon: Briefcase,
            },
            {
                title: "Scholarships",
                description: "Generous government scholarships available for international students.",
                icon: DollarSign,
            },
            {
                title: "Language",
                description: "Master Mandarin, a crucial language for future business.",
                icon: BookOpen,
            },
            {
                title: "Culture",
                description: "Explore 5,000 years of history and diverse landscapes.",
                icon: Landmark,
            },
        ],
        universities: [
            { name: "Tsinghua University", campusImage: "/assets/china-uni.png", atmosphereImage: "/assets/china-atm.png" },
            { name: "Peking University", campusImage: "/assets/china-uni.png", atmosphereImage: "/assets/china-atm.png" },
            { name: "Fudan University", campusImage: "/assets/china-uni.png", atmosphereImage: "/assets/china-atm.png" },
        ]
    },
    netherlands: {
        slug: "netherlands",
        name: "Netherlands",
        hero: {
            title: "Study in the Netherlands",
            description: "Innovative, open-minded, and English-speaking friendly.",
            icon: Globe,
        },
        benefits: [
            {
                title: "English Taught",
                description: "Largest range of English-taught programs in continental Europe.",
                icon: BookOpen,
            },
            {
                title: "Teaching Style",
                description: "Interactive and student-centered learning environment.",
                icon: Users,
            },
            {
                title: "International",
                description: "Highly international student community.",
                icon: Globe,
            },
            {
                title: "Orientation Year",
                description: "Stay for one year after graduation to find a job.",
                icon: Clock,
            },
        ],
        universities: [
            { name: "University of Amsterdam", campusImage: "/assets/netherlands-uni.png", atmosphereImage: "/assets/netherlands-atm.png" },
            { name: "Delft University of Technology", campusImage: "/assets/netherlands-uni.png", atmosphereImage: "/assets/netherlands-atm.png" },
            { name: "Utrecht University", campusImage: "/assets/netherlands-uni.png", atmosphereImage: "/assets/netherlands-atm.png" },
        ]
    },
    norway: {
        slug: "norway",
        name: "Norway",
        hero: {
            title: "Study in Norway",
            description: "Spectacular nature and high-quality education.",
            icon: Sun,
        },
        benefits: [
            {
                title: "Quality of Life",
                description: "One of the safest and happiest countries in the world.",
                icon: Globe,
            },
            {
                title: "Nature",
                description: "Fjords, mountains, and northern lights right at your doorstep.",
                icon: MapPin,
            },
            {
                title: "English Proficiency",
                description: "Locals speak excellent English, making life easy.",
                icon: Users,
            },
            {
                title: "Equality",
                description: "Egalitarian society with a flat hierarchy.",
                icon: Users,
            },
        ],
        universities: [
            { name: "University of Oslo", campusImage: "/assets/norway-uni.png", atmosphereImage: "/assets/norway-atm.png" },
            { name: "University of Bergen", campusImage: "/assets/norway-uni.png", atmosphereImage: "/assets/norway-atm.png" },
            { name: "NTNU", campusImage: "/assets/norway-uni.png", atmosphereImage: "/assets/norway-atm.png" },
        ]
    },
    austria: {
        slug: "austria",
        name: "Austria",
        hero: {
            title: "Study in Austria",
            description: "Music, history, and academic tradition in the heart of Europe.",
            icon: Landmark,
        },
        benefits: [
            {
                title: "Music & Arts",
                description: "The classical music capital of the world.",
                icon: Award,
            },
            {
                title: "Quality of Life",
                description: "Vienna is consistently voted the most livable city.",
                icon: Globe,
            },
            {
                title: "Central Location",
                description: "Perfect base for exploring all of Europe.",
                icon: MapPin,
            },
            {
                title: "Affordable",
                description: "Low tuition fees for many public universities.",
                icon: DollarSign,
            },
        ],
        universities: [
            { name: "University of Vienna", campusImage: "/assets/austria-uni.png", atmosphereImage: "/assets/austria-atm.png" },
            { name: "Vienna University of Technology", campusImage: "/assets/austria-uni.png", atmosphereImage: "/assets/austria-atm.png" },
            { name: "University of Innsbruck", campusImage: "/assets/austria-uni.png", atmosphereImage: "/assets/austria-atm.png" },
        ]
    },
    belgium: {
        slug: "belgium",
        name: "Belgium",
        hero: {
            title: "Study in Belgium",
            description: "The political heart of Europe with a unique mix of cultures.",
            icon: Landmark,
        },
        benefits: [
            {
                title: "EU Headquarters",
                description: "Perfect for students interested in politics and international relations.",
                icon: Briefcase,
            },
            {
                title: "Multilingual",
                description: "Speak French, Dutch, German, and English.",
                icon: Users,
            },
            {
                title: "Chocolate & Waffles",
                description: "Need we say more? The food is amazing.",
                icon: Sun, // Using Sun as a placeholder for 'fun/lifestyle'
            },
            {
                title: "Affordable Living",
                description: "Generally more affordable than neighboring countries.",
                icon: DollarSign,
            },
        ],
        universities: [
            { name: "KU Leuven", campusImage: "/assets/belgium-uni.png", atmosphereImage: "/assets/belgium-atm.png" },
            { name: "Ghent University", campusImage: "/assets/belgium-uni.png", atmosphereImage: "/assets/belgium-atm.png" },
            { name: "Université catholique de Louvain", campusImage: "/assets/belgium-uni.png", atmosphereImage: "/assets/belgium-atm.png" },
        ]
    },
    portugal: {
        slug: "portugal",
        name: "Portugal",
        hero: {
            title: "Study in Portugal",
            description: "Sunny weather, welcoming people, and rich history.",
            icon: Sun,
        },
        benefits: [
            {
                title: "Weather",
                description: "Enjoy over 300 days of sunshine a year.",
                icon: Sun,
            },
            {
                title: "Affordable",
                description: "One of the most affordable countries in Western Europe.",
                icon: DollarSign,
            },
            {
                title: "Welcoming",
                description: "Known for its warm hospitality and safety.",
                icon: Users,
            },
            {
                title: "History",
                description: "One of the oldest nations in Europe.",
                icon: Landmark,
            },
        ],
        universities: [
            { name: "University of Lisbon", campusImage: "/assets/portugal-uni.png", atmosphereImage: "/assets/portugal-atm.png" },
            { name: "University of Porto", campusImage: "/assets/portugal-uni.png", atmosphereImage: "/assets/portugal-atm.png" },
            { name: "University of Coimbra", campusImage: "/assets/portugal-uni.png", atmosphereImage: "/assets/portugal-atm.png" },
        ]
    },
};
