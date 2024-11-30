from ..models import QuestionPaper

class QuestionPaperService:
    @staticmethod
    def get_papers_by_year_and_semester(year, semester):
        return QuestionPaper.objects.filter(
            year=year,
            semester=semester
        )