import React, { useState } from "react";

interface Course {
  title: string;
  description: string;
  creditHours: number;
  textbooks: string[];
  references: string[];
}

interface Semester {
  name: string;
  courses: Course[];
}

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

const Syllabus: React.FC = () => {
  const [activeSemester, setActiveSemester] = useState<string>(syllabusData[0].name);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        BCA Syllabus - Pokhara University
      </h1>
      
      <div className="flex  justify-center space-x-8 mb-6">
        {syllabusData.map((semester) => (
          <button
            key={semester.name}
            className={`px-4 py-2 rounded-md text-white ${
              activeSemester === semester.name
                ? "bg-blue-800"
                : "bg-blue-400 hover:bg-blue-800"
            }`}
            onClick={() => setActiveSemester(semester.name)}
          >
            {semester.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
        {syllabusData
          .find((semester) => semester.name === activeSemester)
          ?.courses.map((course) => (
            <div
              key={course.title}
              className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-blue-700">{course.title}</h2>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <p className="text-black mt-4">
                <strong>Credit Hours:</strong> {course.creditHours}
              </p>
              <div className="mt-4">
                <h3 className="text-blue-600 font-semibold">Textbooks:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {course.textbooks.map((textbook, index) => (
                    <li key={index}>{textbook}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <h3 className="text-blue-600 font-semibold">Reference Books:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {course.references.map((reference, index) => (
                    <li key={index}>{reference}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Syllabus;


