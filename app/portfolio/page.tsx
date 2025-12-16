"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Dock from "../components/Dock";
import InfiniteMenu from "../components/InfiniteMenu";
import LoadingScreen from "../components/LoadingScreen";
import Terminal from "../components/Terminal";
import { NeuralNetworkBackground } from "../components/NeuralNetworkBackground";

import {
  FaHome,
  FaUser,
  FaBriefcase,
  FaEnvelope,
  FaCode,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaUsers,
  FaProjectDiagram,
  FaBrain,
  FaHandshake,
  FaMicrophone,
  FaTrophy,
  FaDatabase,
  FaPython,
  FaChartBar,
  FaFileExcel,
  FaWordpress,
  FaPalette,
  FaVideo,
  FaImage,
  FaFilm,
} from "react-icons/fa";

// Animation variants - start at final position to prevent layout shifts
const fadeInUp = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Reusable animated section component
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay, duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      className={className}
      style={{ overflow: "visible", willChange: "transform, opacity" }}
      layout
    >
      {children}
    </motion.div>
  );
}

// Reusable scroll-sensitive section component
interface ScrollSensitiveSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ScrollSensitiveSection = forwardRef<HTMLDivElement, ScrollSensitiveSectionProps>(
  ({ id, title, children, className = "" }, ref) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ["start end", "end start"],
    });

    // Calculate vertical spacing (margin-top) based on scroll position
    // When section is centered (scrollYProgress = 0.5), margin is normal (48px = mb-12)
    // When scrolling up or down, margin increases (content moves further down)
    // Reduced values for better mobile UX
    const marginTop = useTransform(scrollYProgress, [0, 0.5, 1], [80, 40, 80]);

    return (
      <AnimatedSection className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 ${className}`}>
        <div
          ref={(node) => {
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            sectionRef.current = node;
          }}
          id={id}
          className="mb-20 sm:mb-40"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-black">{title}</h2>
            <div className="w-16 sm:w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <motion.div style={{ marginTop }}>{children}</motion.div>
        </div>
      </AnimatedSection>
    );
  }
);

ScrollSensitiveSection.displayName = "ScrollSensitiveSection";

// About Section with scroll-sensitive animation
const AboutSectionWithScrollEffect = forwardRef<HTMLDivElement>((props, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const marginTop = useTransform(scrollYProgress, [0, 0.5, 1], [80, 40, 80]);

  return (
    <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
          sectionRef.current = node;
        }}
        id="about"
        className="mb-20 sm:mb-40"
      >
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-black">ABOUT ME</h2>
          <div className="w-16 sm:w-24 h-1 bg-primary mx-auto"></div>
        </div>
        <motion.div style={{ marginTop }}>
          <div className="relative neo-card overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="border-r-0 md:border-r-4 border-b-4 md:border-b-0 border-black bg-primary p-6 sm:p-8 md:p-12 relative">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-black">
                  PASSIONATE DEVELOPER
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-black">
                  I&apos;m a Computer Engineering student with a passion for
                  creating innovative digital solutions. Currently working as a
                  Web Developer Intern, I specialize in building functional
                  websites and developing agency management software.
                </p>
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 border-4 border-black bg-orange-400 transform rotate-45"></div>
              </div>
              <div className="bg-secondary-purple p-6 sm:p-8 md:p-12 text-white relative">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4">CREATIVE STRATEGIST</h3>
                <p className="text-base sm:text-lg leading-relaxed">
                  With experience in social media management and brand strategy,
                  I&apos;ve helped brands like{" "}
                  <strong>
                    Asian Paints, Avyukta, PureBot, Ebullient, and Proficio
                    Therapy
                  </strong>{" "}
                  achieve an average engagement growth of <strong>44.5%</strong>{" "}
                  across platforms.
                </p>
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 border-4 border-white bg-teal-400 transform -rotate-12"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
});

AboutSectionWithScrollEffect.displayName = "AboutSectionWithScrollEffect";

export default function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  // Fix container height after animations complete to prevent scrollbar
  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const timer = setTimeout(() => {
        const container = containerRef.current;
        if (container) {
          // Ensure container height matches its content
          container.style.height = "auto";
          container.style.maxHeight = "none";
        }
      }, 2000); // Wait for all animations to complete
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const dockItems = [
    {
      icon: <FaHome />,
      label: "Home",
      onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
    {
      icon: <FaUser />,
      label: "About",
      onClick: () => {
        const aboutSection = document.getElementById("about");
        aboutSection?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: <FaBriefcase />,
      label: "Experience",
      onClick: () => {
        const experienceSection = document.getElementById("experience");
        experienceSection?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: <FaGraduationCap />,
      label: "Education",
      onClick: () => {
        const educationSection = document.getElementById("education");
        educationSection?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: <FaCode />,
      label: "Skills",
      onClick: () => {
        const skillsSection = document.getElementById("skills");
        skillsSection?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      icon: <FaEnvelope />,
      label: "Contact",
      onClick: () => {
        const contactSection = document.getElementById("contact");
        contactSection?.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];

  return (
    <>
      {isLoading && (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      )}
      {!isLoading && (
        <>
          <div
            ref={containerRef}
            className="relative z-10 bg-transparent"
            style={{ marginBottom: 0, paddingBottom: 0 }}
          >
            {/* Neural Network Background */}
            <NeuralNetworkBackground />

            {/* Hero Section */}
            <section
              id="home"
              className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20"
              style={{ overflow: "visible" }}
            >
              <motion.div
                className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center mb-20 sm:mb-40"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                style={{ overflow: "visible" }}
              >
                <motion.div variants={fadeInUp}>
                  <motion.div
                    className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider mb-3 sm:mb-4"
                    variants={fadeInUp}
                  >
                    Web Developer & Digital Strategist
                  </motion.div>
                  <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6 text-black"
                    variants={fadeInUp}
                  >
                    MOHIT JANGID
                  </motion.h1>
                  <motion.p
                    className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-700 leading-relaxed"
                    variants={fadeInUp}
                  >
                    Web Developer Intern at DigitalVigyapan | Building
                    innovative digital solutions and driving brand growth
                    through creative strategies and technical expertise.
                  </motion.p>
                  <motion.div
                    className="flex flex-col gap-3 mb-6"
                    variants={fadeInUp}
                  >
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="dock-icon-small">
                        <FaMapMarkerAlt />
                      </div>
                      <span>Virar, India</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="dock-icon-small">
                        <FaEnvelope />
                      </div>
                      <a
                        href="mailto:mohit.jangid2805@gmail.com"
                        className="hover:underline"
                      >
                        mohit.jangid2805@gmail.com
                      </a>
                    </div>
                  </motion.div>
                  <motion.div
                    className="grid md:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8"
                    variants={fadeInUp}
                  >
                    <a
                      href="#contact"
                      className="neo-button bg-black text-white p-4 sm:p-5 md:p-6 text-sm sm:text-base md:text-lg hover:bg-gray-800 text-center"
                    >
                      GET IN TOUCH
                    </a>
                    <a
                      href="#experience"
                      className="neo-button bg-white text-black p-4 sm:p-5 md:p-6 text-sm sm:text-base md:text-lg hover:bg-gray-100 text-center"
                    >
                      VIEW MY WORK
                    </a>
                  </motion.div>
                </motion.div>
                {/* Terminal on portfolio hero (right column) - Hidden on mobile */}
                <motion.div className="relative hidden md:block" variants={fadeInUp}>
                  <div className="max-w-2xl w-full">
                    <Terminal
                      username="mohit"
                      hostname="MohitPortfolioConsole"
                      shell="zsh"
                      variant="dark"
                      onNavigate={(section) => {
                        const element = document.getElementById(section);
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </section>

            {/* About Section */}
            <AboutSectionWithScrollEffect ref={aboutSectionRef} />

            {/* Experience Section */}
            <ScrollSensitiveSection id="experience" title="EXPERIENCE">
              <div className="space-y-6 sm:space-y-8">
                  {/* Current Role */}
                  <div className="neo-card bg-white p-4 sm:p-6 md:p-8 relative">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 sm:mb-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1 sm:mb-2 text-black">
                          Web Developer Intern
                        </h3>
                        <p className="text-lg sm:text-xl font-bold text-gray-700">
                          DigitalVigyapan
                        </p>
                      </div>
                      <div className="text-left md:text-right mt-2 md:mt-0">
                        <p className="text-base sm:text-lg font-semibold text-black">
                          September 2025 - Present
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">Borivali</p>
                      </div>
                    </div>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">
                          •
                        </span>
                        <span>
                          Collaborated with COO and Tech team to create{" "}
                          <strong>Agency Management Software (AMS)</strong> for
                          Social Media Management agencies.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">
                          •
                        </span>
                        <span>
                          Worked on individual modules included as premium
                          features.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">
                          •
                        </span>
                        <span>
                          Learned WordPress and created functioning client
                          websites.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">
                          •
                        </span>
                        <span>
                          Independently developed fully functional client
                          websites, demonstrating adaptability and
                          problem-solving skills.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">
                          •
                        </span>
                        <span>
                          In Phase 2 of the <strong>Proficio Website</strong>,
                          documented development progress, challenges, and
                          solutions for workflow management.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Previous Role */}
                  <div className="neo-card bg-white p-4 sm:p-6 md:p-8 relative">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 sm:mb-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1 sm:mb-2 text-black">
                          Social Media Intern
                        </h3>
                        <p className="text-lg sm:text-xl font-bold text-gray-700">
                          DigitalVigyapan
                        </p>
                      </div>
                      <div className="text-left md:text-right mt-2 md:mt-0">
                        <p className="text-base sm:text-lg font-semibold text-black">
                          August 2025 - September 2025
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">Borivali</p>
                      </div>
                    </div>
                    <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                      <li className="flex items-start gap-2 sm:gap-3">
                        <span className="text-primary font-bold mt-1 flex-shrink-0">
                          •
                        </span>
                        <span>
                          Collaborated with leading brands (e.g.,{" "}
                          <strong>
                            Asian Paints, Avyukta, PureBot, Ebullient, Proficio
                            Therapy
                          </strong>
                          ) to develop content calendars and social media
                          strategies, achieving an average engagement growth of{" "}
                          <strong>44.5%</strong> across platforms.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">
                          •
                        </span>
                        <span>
                          Brainstormed strategies for advertisements through{" "}
                          <strong>Google AdWords</strong> partners.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">
                          •
                        </span>
                        <span>
                          Worked with the company founder to conceptualize and
                          design brand identities and campaigns, earning praise
                          for professionalism, creative insight, and mature
                          communication.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">
                          •
                        </span>
                        <span>
                          Maintained strong brand relationships, achieving high
                          client retention rates through consistent
                          communication, reliability, and results-driven
                          collaboration.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
            </ScrollSensitiveSection>

            {/* Projects/Portfolio Section */}
            <ScrollSensitiveSection id="projects" title="PROJECTS">
              <div className="neo-card bg-white relative overflow-hidden">
                  <div
                    className="h-[400px] sm:h-[500px] md:h-[600px]"
                    style={{
                      width: "100%",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <InfiniteMenu
                      items={[
                        {
                          image: "https://picsum.photos/300/300?grayscale",
                          link: "https://google.com/",
                          title: "Project 1",
                          description: "This is pretty cool, right?",
                        },
                        {
                          image: "https://picsum.photos/400/400?grayscale",
                          link: "https://google.com/",
                          title: "Project 2",
                          description: "This is pretty cool, right?",
                        },
                        {
                          image: "https://picsum.photos/500/500?grayscale",
                          link: "https://google.com/",
                          title: "Project 3",
                          description: "This is pretty cool, right?",
                        },
                        {
                          image: "https://picsum.photos/600/600?grayscale",
                          link: "https://google.com/",
                          title: "Project 4",
                          description: "This is pretty cool, right?",
                        },
                      ] as Array<{
                        image: string;
                        link: string;
                        title: string;
                        description: string;
                      }>}
                    />
                  </div>
                </div>
            </ScrollSensitiveSection>

            {/* Education Section */}
            <ScrollSensitiveSection id="education" title="EDUCATION">
              <div className="neo-card bg-white p-4 sm:p-6 md:p-12 relative">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 sm:mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1 sm:mb-2 text-black">
                        B.E. in Computer Engineering
                      </h3>
                      <p className="text-lg sm:text-xl font-bold text-gray-700">
                        Universal College of Engineering
                      </p>
                      <p className="text-base sm:text-lg text-gray-600 mt-1">Mumbai</p>
                    </div>
                    <div className="text-left md:text-right mt-4 md:mt-0">
                      <p className="text-base sm:text-lg font-semibold text-black">
                        August 2023 — May 2027
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-primary mt-2">
                        CGPA: 7.21/10
                      </p>
                    </div>
                  </div>
                </div>
            </ScrollSensitiveSection>

            {/* Skills Section */}
            <ScrollSensitiveSection id="skills" title="SKILLS">
              {/* Technical Skills */}
                <div className="border-4 border-black bg-secondary-green p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-black">
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
                    {[
                      { name: "SQL", icon: <FaDatabase /> },
                      { name: "Python", icon: <FaPython /> },
                      { name: "Tableau", icon: <FaChartBar /> },
                      { name: "Cognos Analytics", icon: <FaChartBar /> },
                      { name: "Power BI", icon: <FaChartBar /> },
                      { name: "Excel", icon: <FaFileExcel /> },
                      { name: "WordPress", icon: <FaWordpress /> },
                      { name: "Canva", icon: <FaPalette /> },
                      { name: "Davinci Video Editing", icon: <FaVideo /> },
                      { name: "Adobe Photoshop", icon: <FaImage /> },
                      { name: "Adobe Premiere Pro", icon: <FaFilm /> },
                    ].map((skill, i) => (
                      <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                        <div className="dock-icon-small">{skill.icon}</div>
                        <span className="text-sm sm:text-base md:text-lg font-bold text-black">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Soft Skills */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { title: "Stakeholder Management", icon: <FaUsers /> },
                    { title: "Project Management", icon: <FaProjectDiagram /> },
                    {
                      title: "Critical & Analytical Thinking",
                      icon: <FaBrain />,
                    },
                    {
                      title: "Cross-functional Collaboration",
                      icon: <FaHandshake />,
                    },
                    { title: "Public Speaking", icon: <FaMicrophone /> },
                    {
                      title: "Teamwork & Event Management",
                      icon: <FaTrophy />,
                    },
                  ].map((skill, i) => (
                    <div key={i} className="neo-card bg-white p-4 sm:p-5 md:p-6 relative">
                      <div className="dock-icon-medium mb-2 sm:mb-3">
                        {skill.icon}
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-black mb-1 sm:mb-2 text-black">
                        {skill.title}
                      </h3>
                    </div>
                  ))}
                </div>
            </ScrollSensitiveSection>

            {/* Positions of Responsibility */}
            <ScrollSensitiveSection id="leadership-section" title="LEADERSHIP">
              <div className="neo-card bg-white p-4 sm:p-6 md:p-12 relative">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-black">
                    Sports Head | Students&apos; Council
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-primary font-bold mt-1 flex-shrink-0">•</span>
                      <span>
                        Active member of the Students&apos; Council since the
                        First Year, progressing from SAA&SH President (F.E.) to
                        Joint Sports Head (S.E.), and currently serving as the
                        Sports Head (T.E.), demonstrating leadership.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>
                        Led the organization of the annual{" "}
                        <strong>Sports Fest</strong>, managing a core team and
                        ensuring seamless execution with a yearly footfall of
                        over <strong>1,000 students</strong>, showcasing strong
                        leadership, coordination, and event management skills.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>
                        Represented the college in intercollegiate tournaments,
                        securing <strong>2nd position</strong> and earning a
                        total of <strong>8 medals</strong> across events like
                        ICT Volleyball, demonstrating teamwork, discipline, and
                        competitive excellence.
                      </span>
                    </li>
                  </ul>
                </div>
            </ScrollSensitiveSection>

            {/* Footer - Contact Section - Last Element */}
            <footer
              id="contact"
              className="relative z-10 border-4 border-black bg-black text-white p-6 sm:p-8 md:p-12 text-center mt-12 sm:mt-16 md:mt-20"
              style={{
                marginBottom: 0,
                backgroundColor: "black",
                marginTop: "auto",
              }}
            >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">LET&apos;S CONNECT</h2>
                <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-300 max-w-2xl mx-auto px-4">
                  Ready to collaborate on your next project? Get in touch and
                  let&apos;s create something amazing together.
                </p>
                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
                  <a
                    href="mailto:mohit.jangid2805@gmail.com"
                    className="border-4 border-white bg-primary text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 font-bold text-sm sm:text-base md:text-lg hover:bg-yellow-400 transition-colors"
                  >
                    SEND EMAIL
                  </a>
                </div>
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center items-center text-gray-300 mb-4 sm:mb-6 px-4">
                  <a
                    href="mailto:mohit.jangid2805@gmail.com"
                    className="hover:text-primary transition-colors text-sm sm:text-base break-all"
                  >
                    mohit.jangid2805@gmail.com
                  </a>
                  <span className="hidden md:inline">•</span>
                  <span className="text-sm sm:text-base">Virar, India</span>
                </div>
                <div className="text-gray-400 text-xs sm:text-sm mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700">
                  <p>MOHIT JANGID © 2025</p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-8 h-8 sm:w-12 sm:h-12 border-4 border-white bg-pink-400 transform rotate-45"></div>
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-8 h-8 sm:w-12 sm:h-12 border-4 border-white bg-teal-400 transform -rotate-12"></div>
            </footer>
          </div>

          {/* Dock Component - Fixed Position - Always Visible */}
          <Dock items={dockItems} />
        </>
      )}
    </>
  );
}


