/**
 * Syllabus Page Component
 * 
 * Displays the complete BCA curriculum including:
 * - Semester-wise course listings
 * - Course details (credit hours, descriptions)
 * - Required textbooks and references
 * - Interactive UI for browsing different semesters
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

// Type definitions for curriculum structure
interface Course {
  title: string;          // Course name
  description: string;    // Brief course description
  creditHours: number;    // Number of credit hours
  textbooks: string[];    // Required textbooks
  references: string[];   // Additional reference materials
}

interface Semester {
  name: string;          // Semester name (e.g., "1st Semester")
  courses: Course[];     // Array of courses in the semester
}

interface Program {
  name: string;          // Program name
  code: string;          // Program code
  description: string;   // Program description
  semesters: Semester[]; // Array of semesters
}

/**
 * Curriculum Data
 * Complete semester-wise course structure for BCA program
 * Including course details, credit hours, and recommended reading materials
 */
const syllabusData: Semester[] = [
  {
    name: "1st Semester",
    courses: [
      {
        title: "English – I", 
        description: "Improve reading, writing, and listening skills.",
        creditHours: 3,
        textbooks: ["Leo Jones: Cambridge Advanced English"],
        references: ["Oxford English Dictionary", "Collins English Grammar"],
      },
      {
        title: "Mathematics – I",
        description: "Basic mathematical tools necessary for computer systems.",
        creditHours: 3,
        textbooks: ["Taro Yamane: Mathematics for Economists"],
        references: ["B.C. Das & N.B. Mukharjee: Differential Calculus"],
      },
      {
        title: "Digital Logic Systems",
        description: "Introduction to logic circuits and systems.",
        creditHours: 3,
        textbooks: ["Morris Mano: Digital Logic and Computer Design"],
        references: ["Malvino: Digital Computer Electronics"],
      },
      {
        title: "Computer Fundamentals and Applications",
        description: "Basics of computers and operating systems.",
        creditHours: 3,
        textbooks: ["B. Ram: Computer Fundamentals"],
        references: ["Foundations of Computing, BPB Publications"],
      },
      {
        title: "Programming Logic and Techniques",
        description: "Problem analysis and coding techniques.",
        creditHours: 3,
        textbooks: ["V.K. Jain: Computer Fundamentals"],
        references: ["Yeswanth Kanetkar: Let Us C"],
      },
    ],
  },
  {
    name: "2nd Semester",
    courses: [
      {
        title: "Business and Technical Communication",
        description: "Oral and written communication skills for business.",
        creditHours: 3,
        textbooks: ["Andrea J. Rutherford: Basic Communication Skills for Technology"],
        references: ["Lesikar & Flatley: Business Communication", "V.R. Narayanaswami: Strengthen Your Writing"],
      },
      {
        title: "Mathematics – II",
        description: "Advanced mathematical tools and techniques.",
        creditHours: 3,
        textbooks: ["Erwin Kreyszig: Advanced Engineering Mathematics"],
        references: ["Toya Narayan Paudel: Engineering Mathematics IV"],
      },
      {
        title: "Financial Accounting – I",
        description: "Fundamentals of financial accounting.",
        creditHours: 3,
        textbooks: ["Gary A. Porter & Curtis L. Norton: Financial Accounting"],
        references: ["Narayanswamy: Financial Accounting - Managerial Perspective"],
      },
      {
        title: "Programming Language",
        description: "Introduction to programming with C.",
        creditHours: 3,
        textbooks: ["S.K. Srivastava & Deepali Srivastava: C in Depth"],
        references: ["Yashwant Kanetkar: Let Us C"],
      },
      {
        title: "Fundamentals of Electrical and Electronics",
        description: "Basic principles of electrical and electronic circuits.",
        creditHours: 3,
        textbooks: ["Sedra & Smith: Microelectronic Circuits"],
        references: ["B.L. Theraja: Textbook of Electrical Technology"],
      },
    ],
  },
  {
    name: "3rd Semester",
    courses: [
      {
        title: "Object Oriented Programming",
        description: "Concepts of OOP using C++.",
        creditHours: 3,
        textbooks: ["R. Lafore: Object-Oriented Programming in Turbo C++"],
        references: ["David Parsons: Object-Oriented Programming with C++"],
      },
      {
        title: "Data Structures and Algorithms",
        description: "Design and implementation of fundamental data structures.",
        creditHours: 3,
        textbooks: ["Langsam, Augenstein & Tannenbaum: Data Structures Using C & C++"],
        references: ["Mark Allen Weiss: Data Structures and Algorithm Analysis in C++"],
      },
      {
        title: "System Analysis and Design",
        description: "Methodologies for analyzing and designing systems.",
        creditHours: 3,
        textbooks: ["Jeffrey L. Whitten, Lonnie D. Bentley: System Analysis and Design Methods"],
        references: ["Kendall & Kendall: Systems Analysis and Design"],
      },
      {
        title: "Financial Accounting – II",
        description: "Advanced financial accounting techniques.",
        creditHours: 3,
        textbooks: ["Gary A. Porter & Curtis L. Norton: Financial Accounting"],
        references: ["R. Narayanswamy: Financial Accounting - Managerial Perspective"],
      },
      {
        title: "Microprocessor",
        description: "Study of microprocessor architecture and assembly programming.",
        creditHours: 3,
        textbooks: ["Ramesh Gaonkar: Microprocessor Architecture, Programming, and Applications with 8085"],
        references: ["Morris Mano: Computer System Architecture"],
      },
    ],
  },
  {
    name: "4th Semester",
    courses: [
      {
        title: "Numerical Methods",
        description: "Mathematical techniques for numerical problem-solving.",
        creditHours: 3,
        textbooks: ["E. Kreyszig: Advanced Engineering Mathematics"],
        references: ["S.S. Sastry: Introductory Methods of Numerical Analysis"],
      },
      {
        title: "Visual Programming",
        description: "GUI design using visual programming tools.",
        creditHours: 3,
        textbooks: ["Charles Petzold: Programming Windows"],
        references: ["Steven Holzner: Visual Basic Programming"],
      },
      {
        title: "Operating Systems",
        description: "Concepts and design of operating systems.",
        creditHours: 3,
        textbooks: ["Abraham Silberschatz, Peter Baer Galvin: Operating System Concepts"],
        references: ["Andrew S. Tanenbaum: Modern Operating Systems"],
      },
      {
        title: "Database Management Systems",
        description: "Core database concepts and design.",
        creditHours: 3,
        textbooks: ["Elmasri & Navathe: Fundamentals of Database Systems"],
        references: ["C.J. Date: An Introduction to Database Systems"],
      },
      {
        title: "Computer Graphics and Multimedia Technology",
        description: "Fundamentals of computer graphics and multimedia.",
        creditHours: 4,
        textbooks: ["Donald Hearn & M. Pauline Baker: Computer Graphics"],
        references: ["Malay K. Pakhira: Computer Graphics, Multimedia, and Animation"],
      },
    ],
  },
  {
    name: "5th Semester",
    courses: [
      {
        title: "Computer Architecture",
        description: "Study of computer architecture and internal components.",
        creditHours: 3,
        textbooks: ["Morris Mano: Computer System Architecture"],
        references: ["William Stallings: Computer Organization and Architecture"],
      },
      {
        title: "Java Programming",
        description: "Core Java programming concepts, including OOP.",
        creditHours: 3,
        textbooks: ["Herbert Schildt: Java: The Complete Reference"],
        references: ["Bruce Eckel: Thinking in Java"],
      },
      {
        title: "Web Programming",
        description: "Introduction to web application development.",
        creditHours: 3,
        textbooks: ["Robin Nixon: Learning PHP, MySQL & JavaScript"],
        references: ["Jon Duckett: HTML & CSS: Design and Build Websites"],
      },
      {
        title: "Mathematical Foundation of Computer Science",
        description: "Mathematical principles relevant to computer science.",
        creditHours: 3,
        textbooks: ["K.H. Rosen: Discrete Mathematics and Its Applications"],
        references: ["Seymour Lipschutz: Discrete Mathematics"],
      },
      {
        title: "Software Engineering",
        description: "Principles of software development and lifecycle models.",
        creditHours: 3,
        textbooks: ["Ian Sommerville: Software Engineering"],
        references: ["Roger S. Pressman: Software Engineering: A Practitioner's Approach"],
      },
    ],
  },
  {
    name: "6th Semester",
    courses: [
      {
        title: "Data Communication and Computer Networks",
        description: "Concepts of networking and data communication.",
        creditHours: 3,
        textbooks: ["Andrew S. Tanenbaum: Computer Networks"],
        references: ["Behrouz Forouzan: Data Communication and Networking"],
      },
      {
        title: "Probability and Statistics",
        description: "Statistical methods and probability concepts.",
        creditHours: 3,
        textbooks: ["Sheldon Ross: Introduction to Probability and Statistics"],
        references: ["John E. Freund: Mathematical Statistics"],
      },
      {
        title: "Applied Economics",
        description: "Application of economics principles in real-world scenarios.",
        creditHours: 3,
        textbooks: ["Paul A. Samuelson: Economics"],
        references: ["N. Gregory Mankiw: Principles of Economics"],
      },
      {
        title: "Organization and Management",
        description: "Study of management principles and business organizations.",
        creditHours: 3,
        textbooks: ["Stephen Robbins: Management"],
        references: ["Koontz & Weihrich: Essentials of Management"],
      },
      {
        title: "Advanced Web Programming",
        description: "Advanced techniques for web development.",
        creditHours: 3,
        textbooks: ["Robin Nixon: Advanced Web Development with PHP, MySQL, and JavaScript"],
        references: ["Jon Duckett: JavaScript and JQuery: Interactive Front-End Development"],
      },
    ],
  },
  {
    name: "7th Semester",
    courses: [
      {
        title: "E-Business",
        description: "Study of electronic business and online commerce.",
        creditHours: 3,
        textbooks: ["Dave Chaffey: E-Business and E-Commerce Management"],
        references: ["Rayport & Jaworski: Introduction to E-Commerce"],
      },
      {
        title: "Simulation and Modeling",
        description: "Modeling real-world systems for simulation.",
        creditHours: 3,
        textbooks: ["Jerry Banks: Discrete-Event System Simulation"],
        references: ["Narsingh Deo: System Simulation with Digital Computer"],
      },
      {
        title: "Linux",
        description: "Introduction to Linux OS and shell programming.",
        creditHours: 3,
        textbooks: ["Christopher Negus: Linux Bible"],
        references: ["William Shotts: The Linux Command Line"],
      },
      {
        title: "Internship",
        description: "Practical experience in a professional environment.",
        creditHours: 3,
        textbooks: ["No textbooks required"],
        references: ["No references required"],
      },
      {
        title: "Elective I",
        description: "Specialized elective based on student interest.",
        creditHours: 3,
        textbooks: ["Depends on elective chosen"],
        references: ["Depends on elective chosen"],
      },
    ],
  },
  {
    name: "8th Semester",
    courses: [
      {
        title: "Mobile Application Development",
        description: "Design and development of mobile applications.",
        creditHours: 3,
        textbooks: ["Reto Meier: Professional Android Development"],
        references: ["Apple: Swift Programming Documentation"],
      },
      {
        title: "Management Information Systems",
        description: "Study of MIS and their role in organizations.",
        creditHours: 3,
        textbooks: ["James A. O'Brien & George M. Marakas: Management Information Systems"],
        references: ["Laudon & Laudon: Essentials of MIS"],
      },
      {
        title: "Elective II",
        description: "Advanced elective based on student specialization.",
        creditHours: 3,
        textbooks: ["Depends on elective chosen"],
        references: ["Depends on elective chosen"],
      },
      {
        title: "Project IV",
        description: "Capstone project to demonstrate knowledge and skills.",
        creditHours: 4,
        textbooks: ["No textbooks required"],
        references: ["No references required"],
      },
    ],
  },
];

const programsData: Program[] = [
  {
    name: "Bachelor of Computer Applications",
    code: "BCA",
    description: "Four-year undergraduate program focusing on computer applications and software development.",
    semesters: syllabusData
  },
  {
    name: "Bachelor of Business Administration",
    code: "BBA",
    description: "Four-year undergraduate program focusing on business management and administration.",
    semesters: []
  }
];

/**
 * Main Syllabus Component
 * Renders an interactive view of the BCA curriculum
 */
const Syllabus: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [activeSemester, setActiveSemester] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        Academic Programs - Pokhara University
      </motion.h1>

      {!selectedProgram ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4"
        >
          {programsData.map((program) => (
            <motion.div
              key={program.code}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer border-2 border-transparent hover:border-indigo-400 transition-all duration-300 backdrop-blur-sm bg-opacity-90"
              onClick={() => setSelectedProgram(program.code)}
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-indigo-600 mr-4">{program.code}</span>
                <div className="h-8 w-0.5 bg-gray-200 mr-4"></div>
                <h3 className="text-xl text-gray-800 font-medium">{program.name}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{program.description}</p>
              <div className="mt-6 flex justify-end">
                <span className="text-indigo-500 font-medium">View Syllabus →</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : !activeSemester ? (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 px-6 py-2 text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
            onClick={() => setSelectedProgram(null)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Programs
          </motion.button>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4"
          >
            {programsData
              .find(p => p.code === selectedProgram)
              ?.semesters.map((semester, index) => (
                <motion.div
                  key={semester.name}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-6 rounded-xl shadow-md cursor-pointer text-center hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300"
                  onClick={() => setActiveSemester(semester.name)}
                >
                  <div className="text-4xl font-bold text-indigo-600 mb-2">{index + 1}</div>
                  <h3 className="text-lg font-semibold text-gray-800">{semester.name}</h3>
                  <p className="text-sm text-gray-500 mt-2">{semester.courses.length} Courses</p>
                </motion.div>
              ))}
          </motion.div>
        </>
      ) : (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 px-6 py-2 text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
            onClick={() => setActiveSemester(null)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Semesters
          </motion.button>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4"
          >
            {programsData
              .find(p => p.code === selectedProgram)
              ?.semesters
              .find(s => s.name === activeSemester)
              ?.courses.map((course) => (
                <motion.div
                  key={course.title}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="p-6 bg-white shadow-lg rounded-xl border border-gray-100 hover:border-indigo-300 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {course.creditHours} Credits
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">{course.description}</p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-indigo-600 font-semibold mb-2">Textbooks</h3>
                      <ul className="space-y-2">
                        {course.textbooks.map((textbook, index) => (
                          <li key={index} className="text-gray-600 text-sm flex items-start">
                            <span className="text-indigo-400 mr-2">•</span>
                            {textbook}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-indigo-600 font-semibold mb-2">Reference Books</h3>
                      <ul className="space-y-2">
                        {course.references.map((reference, index) => (
                          <li key={index} className="text-gray-600 text-sm flex items-start">
                            <span className="text-indigo-400 mr-2">•</span>
                            {reference}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Syllabus;


