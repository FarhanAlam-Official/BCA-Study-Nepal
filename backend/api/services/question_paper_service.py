from typing import List
from api.apps.question_papers.models import QuestionPaper
from .base_service import BaseService

class QuestionPaperService(BaseService[QuestionPaper]):
    model_class = QuestionPaper

    @staticmethod
    def get_papers_by_year_and_semester(year, semester):
        return QuestionPaper.objects.filter(
            year=year,
            semester=semester
        )
    
    @classmethod
    def increment_view_count(cls, paper_id: int) -> None:
        paper = cls.get_by_id(paper_id)
        if paper:
            paper.view_count = (paper.view_count or 0) + 1
            cls.update(paper)
    
    @classmethod
    def increment_download_count(cls, paper_id: int) -> None:
        paper = cls.get_by_id(paper_id)
        if paper:
            paper.download_count = (paper.download_count or 0) + 1
            cls.update(paper)