from django.db import models
from typing import TypeVar, Generic, List, Optional

T = TypeVar('T', bound=models.Model)

class BaseService(Generic[T]):
    model_class: T

    @classmethod
    def get_by_id(cls, id: int) -> Optional[T]:
        try:
            return cls.model_class.objects.get(id=id)
        except cls.model_class.DoesNotExist:
            return None

    @classmethod
    def get_all(cls) -> List[T]:
        return cls.model_class.objects.all()

    @classmethod
    def create(cls, **kwargs) -> T:
        return cls.model_class.objects.create(**kwargs)

    @classmethod
    def update(cls, instance: T, **kwargs) -> T:
        for key, value in kwargs.items():
            setattr(instance, key, value)
        instance.save()
        return instance

    @classmethod
    def delete(cls, instance: T) -> bool:
        try:
            instance.delete()
            return True
        except Exception:
            return False 