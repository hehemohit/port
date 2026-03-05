"use client";

import { useState, useEffect, useRef, forwardRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Dock from "../components/Dock";
import InfiniteMenu from "../components/InfiniteMenu";
import LoadingScreen from "../components/LoadingScreen";
import Terminal from "../components/Terminal";
import { NeuralNetworkBackground } from "../components/NeuralNetworkBackground";
import SplitText from "../components/SplitText";
import ContactForm from "../components/ContactForm";
import { AnimatePresence } from "framer-motion";

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
    // Increased range for more powerful animation effect
    const marginTop = useTransform(scrollYProgress, [0, 0.5, 1], [180, 30, 180]);

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
            <SplitText
              text={title}
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-black block"
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              tag="h2"
            />
            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-3 origin-center"
            />
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

  const marginTop = useTransform(scrollYProgress, [0, 0.5, 1], [180, 30, 180]);

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
            <SplitText
              text="ABOUT ME"
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-black block"
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              tag="h2"
            />
            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="w-16 sm:w-24 h-1 bg-primary mx-auto mt-3 origin-center"
            />
          </div>
        <motion.div style={{ marginTop }}>
          <div className="relative neo-card overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="border-r-0 md:border-r-4 border-b-4 md:border-b-0 border-black bg-primary p-6 sm:p-8 md:p-12 relative">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-black text-center md:text-left">
                  PASSIONATE DEVELOPER
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-black text-center md:text-left">
                  I&apos;m a Computer Engineering student with a passion for
                  creating innovative digital solutions. Currently working as a
                  Web Developer Intern, I specialize in building functional
                  websites and developing agency management software.
                </p>
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 border-4 border-black bg-orange-400 transform rotate-45"></div>
              </div>
              <div className="bg-secondary-purple p-6 sm:p-8 md:p-12 text-white relative flex flex-col items-center md:items-start">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-center md:text-left">CREATIVE STRATEGIST</h3>
                <p className="text-base sm:text-lg leading-relaxed text-center md:text-left">
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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
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
        setIsContactModalOpen(true);
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
                    className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider mb-3 sm:mb-4 text-center md:text-left"
                    variants={fadeInUp}
                  >
                    Web Developer & Digital Strategist
                  </motion.div>
                  <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6 text-black text-center md:text-left"
                    variants={fadeInUp}
                  >
                    MOHIT JANGID
                  </motion.h1>
                  <motion.p
                    className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-700 leading-relaxed text-center md:text-left"
                    variants={fadeInUp}
                  >
                    Web Developer Intern at DigitalVigyapan | Building
                    innovative digital solutions and driving brand growth
                    through creative strategies and technical expertise.
                  </motion.p>
                  <motion.div
                    className="flex flex-col gap-3 mb-6 items-center md:items-start"
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
                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="neo-button bg-black text-white p-4 sm:p-5 md:p-6 text-sm sm:text-base md:text-lg text-center no-underline hover:no-underline"
                    >
                      GET IN TOUCH
                    </button>
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
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 sm:mb-4 text-center md:text-left">
                      <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1 sm:mb-2 text-black">
                          Web Developer Intern
                        </h3>
                        <p className="text-lg sm:text-xl font-bold text-gray-700">
                          DigitalVigyapan
                        </p>
                      </div>
                      <div className="text-center md:text-right mt-2 md:mt-0">
                        <p className="text-base sm:text-lg font-semibold text-black">
                          August 2025 - Present
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
                          Refactored the Magento codebase to implement responsive frontend rendering for <strong>Parcos</strong>, optimizing mobile performance which drove a <strong>23.6% increase in sales conversions</strong>. Currently scaling the product ecosystem by architecting a complementary Native Mobile App.
                        </span>
                      </li>
                      <li className="flex items-start gap-2 sm:gap-3">
                        <span className="text-primary font-bold mt-1 flex-shrink-0">
                          •
                        </span>
                        <span>
                          Engineered a custom internal tool using <strong>React and Node.js</strong> to automate content publishing pipelines. By enforcing schema validation in MongoDB, the system achieved a <strong>70% reduction in fault rates</strong> and optimized team throughput by 15%.
                        </span>
                      </li>
                      <li className="flex items-start gap-2 sm:gap-3">
                        <span className="text-primary font-bold mt-1 flex-shrink-0">
                          •
                        </span>
                        <span>
                          Architected and developed a unified <strong>content management system (CMS)</strong> utilizing <strong>Google Cloud Platform (GCP)</strong> services for multi-platform content regulation. Integrated and managed proprietary <strong>APIs</strong> including the <strong>YouTube Data API, Meta Graph API,</strong> and <strong>LinkedIn Marketing/Share API</strong> to enable centralized scheduling and publishing. This system was successfully launched as a premium application feature, directly increasing product value by <strong>20%</strong> and user engagement.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
            </ScrollSensitiveSection>

            {/* Projects/Portfolio Section */}
            <ScrollSensitiveSection id="projects" title="PROJECTS">
              {/* InfiniteMenu Component */}
              <div className="neo-card bg-white relative overflow-hidden mb-8">
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
                        link: "https://study-app-jet.vercel.app/",
                        title: "StudyApp",
                        description: "AI-powered productivity platform automating manual task prioritization.",
                      },
                      {
                        image: "https://picsum.photos/400/400?grayscale",
                        link: "https://edu-able.vercel.app/",
                        title: "EduAble",
                        description: "1st Place winner: AI-driven, accessibility-first educational platform.",
                      },
                      {
                        image: "https://picsum.photos/500/500?grayscale",
                        link: "https://study-app-jet.vercel.app/",
                        title: "StudyApp",
                        description: "AI-powered productivity platform automating manual task prioritization.",
                      },
                      {
                        image: "https://picsum.photos/600/600?grayscale",
                        link: "https://edu-able.vercel.app/",
                        title: "EduAble",
                        description: "1st Place winner: AI-driven, accessibility-first educational platform.",
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

              {/* Project Cards */}
              <div className="space-y-6 sm:space-y-8">
                {/* AI Powered Study-App */}
                <div className="neo-card bg-white p-4 sm:p-6 md:p-8 relative flex flex-col items-center md:items-start">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-black text-center md:text-left">
                    AI Powered Study-App
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center md:text-left">
                    Engineered an <strong>AI-powered productivity platform Study-Focus</strong> that automates <strong>100%</strong> of manual task prioritization and reduces study planning time by <strong>20%</strong> (still in development), by integrating the <strong>Google Gemini API</strong> to parse unstructured text into structured, metadata-rich JSON schemas utilizing <strong>Prompt Engineering</strong>.
                  </p>
                </div>

                {/* Game Development | UNITY */}
                <div className="neo-card bg-white p-4 sm:p-6 md:p-8 relative flex flex-col items-center md:items-start">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-black text-center md:text-left">
                    Game Development | UNITY
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center md:text-left">
                    Engineered a scalable <strong>First-Person Shooter (FPS)</strong> framework that reduces weapon implementation time by <strong>50%</strong>, by designing a modular <strong>C#</strong> architecture utilizing Interface-based polymorphism and ScriptableObjects for data-driven gun systems.
                  </p>
                </div>

                {/* EduAble */}
                <div className="neo-card bg-white p-4 sm:p-6 md:p-8 relative flex flex-col items-center md:items-start">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-black text-center md:text-left">
                    EduAble
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center md:text-left">
                    <strong>1st Place</strong> at the CODE AUTOMATA 2.1 hackathon, hosted by CSMIT. Our project, <strong>EduAble</strong>, is an AI-driven, accessibility-first platform designed to empower students with visual, hearing, speech, and cognitive disabilities. By leveraging adaptive learning and assistive technologies, we aim to ensure that every student—regardless of their physical or cognitive challenges—has an equal opportunity to thrive.
                  </p>
                </div>
              </div>
            </ScrollSensitiveSection>

            {/* Education Section */}
            <ScrollSensitiveSection id="education" title="EDUCATION">
              <div className="neo-card bg-white p-4 sm:p-6 md:p-12 relative">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 sm:mb-6 text-center md:text-left">
                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1 sm:mb-2 text-black">
                        B.E. in Computer Engineering
                      </h3>
                      <p className="text-lg sm:text-xl font-bold text-gray-700">
                        Universal College of Engineering
                      </p>
                      <p className="text-base sm:text-lg text-gray-600 mt-1">Mumbai</p>
                    </div>
                    <div className="text-center md:text-right mt-4 md:mt-0">
                      <p className="text-base sm:text-lg font-semibold text-black">
                        Aug 2023 — May 2027
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-primary mt-2">
                        Currently: 7.61/10 CGPA
                      </p>
                    </div>
                  </div>
                </div>
            </ScrollSensitiveSection>

            {/* Skills Section */}
            <ScrollSensitiveSection id="skills" title="SKILLS">
              {/* Technical Skills */}
                <div className="border-4 border-black bg-secondary-green p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 flex flex-col items-center md:items-start">
                  <h3 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-black text-center md:text-left">
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center md:justify-start">
                    {[
                      { name: "JavaScript", icon: <FaCode /> },
                      { name: "React/MERN", icon: <FaCode /> },
                      { name: "C#", icon: <FaCode /> },
                      { name: "HTML5 & CSS3", icon: <FaCode /> },
                      { name: "REST APIs", icon: <FaDatabase /> },
                      { name: "Magento", icon: <FaDatabase /> },
                      { name: "Unity", icon: <FaCode /> },
                      { name: "Git", icon: <FaCode /> },
                      { name: "GCP & GCS", icon: <FaDatabase /> },
                      { name: "Linux", icon: <FaCode /> },
                      { name: "Postman", icon: <FaCode /> },
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
              <div className="neo-card bg-white p-4 sm:p-6 md:p-12 relative flex flex-col items-center md:items-start">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 text-black text-center md:text-left">
                    Sports Head | Students&apos; Council
                  </h3>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-primary font-bold mt-1 flex-shrink-0">•</span>
                      <span>
                        Led the organization of the annual <strong>Sports Fest</strong>, managing a core team and ensuring seamless execution with a yearly <strong>Sports Event</strong> of over <strong>1,000 students</strong>, showcasing strong leadership, coordination, and event management skills.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-primary font-bold mt-1 flex-shrink-0">•</span>
                      <span>
                        Represented the college in intercollegiate tournaments and secured <strong>1st position</strong>, earning a total of <strong>8 medals</strong> across events such as <strong>ICT Volleyball</strong>, demonstrating teamwork, discipline, and competitive excellence.
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
                <SplitText
                  text="LET'S CONNECT"
                  className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 block"
                  delay={50}
                  duration={1.25}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                  tag="h2"
                />
                <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-300 max-w-2xl mx-auto px-4">
                  Ready to collaborate on your next project? Get in touch and
                  let&apos;s create something amazing together.
                </p>
                <div className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 mt-6">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="border-4 border-white bg-primary text-black px-6 sm:px-8 md:px-10 py-3 sm:py-4 font-bold text-sm sm:text-base md:text-lg hover:bg-yellow-400 transition-colors cursor-pointer block z-30"
                  >
                    SEND EMAIL
                  </button>
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

          {/* Contact Modal Overlay */}
          <AnimatePresence>
            {isContactModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-zinc-900 border-4 border-white p-6 sm:p-8 md:p-10 w-full max-w-2xl relative shadow-2xl"
                >
                  <button
                    onClick={() => setIsContactModalOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 border-2 border-white bg-red-500 text-white flex items-center justify-center font-bold hover:bg-black transition-colors z-20"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                  <div className="text-center mb-6">
                     <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">LET&apos;S CONNECT</h3>
                     <p className="text-sm sm:text-base text-gray-400">Fill out the form below and I&apos;ll get back to you shortly.</p>
                  </div>
                  <ContactForm />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dock Component - Fixed Position - Always Visible */}
          <Dock items={dockItems} />
        </>
      )}
    </>
  );
}


