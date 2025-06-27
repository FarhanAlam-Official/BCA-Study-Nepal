import React from 'react';
import { BookOpen } from 'lucide-react';
import DataCard from '../common/DataCard';
import { Note } from '../../services/types';

interface SemesterGridProps {
    notes: Note[];
    groupedNotes: { [key: string]: Note[] };
    onSemesterClick: (semester: string) => void;
}

const SemesterGrid: React.FC<SemesterGridProps> = ({ notes, groupedNotes, onSemesterClick }) => {
    const semesters = ["all", ...Array.from({ length: 8 }, (_, i) => (i + 1).toString())];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {semesters.map((semester) => {
                const semesterData = semester === "all" ? notes : groupedNotes[semester] || [];
                return (
                    <div
                        key={semester}
                        className="cursor-pointer"
                        onClick={() => onSemesterClick(semester)}
                    >
                        <DataCard
                            title={semester === "all" ? "All Semesters" : `Semester ${semester}`}
                            subtitle={`${semester === "all" ? "All notes" : `Notes for Semester ${semester}`}`}
                            description={`View notes for ${semester === "all" ? "all semesters" : `Semester ${semester}`}`}
                            icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
                            metadata={[
                                {
                                    label: "Notes Count",
                                    value: semesterData?.length.toString() || "0",
                                },
                            ]}
                            tags={semesterData?.length === 0 ? ["No Notes"] : []}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default SemesterGrid;