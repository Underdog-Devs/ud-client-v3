"""
SQLAlchemy model factories for database testing.
"""

from datetime import UTC, datetime

import factory
from faker import Faker
from sqlalchemy.orm import Session

from app.models.content import (
    Article,
    Post,
    Quiz,
    QuizCompletion,
    QuizQuestion,
    UserProgress,
)
from app.models.user import User, UserProfile, UserRole

fake = Faker()


class UserRoleFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for UserRole model."""

    class Meta:
        model = UserRole
        sqlalchemy_session_persistence = "commit"

    name = factory.LazyAttribute(lambda obj: fake.unique.word())
    description = factory.LazyAttribute(lambda obj: fake.sentence())
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))


class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for User model."""

    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    email = factory.LazyAttribute(lambda obj: fake.unique.email())
    password_hash = factory.LazyAttribute(lambda obj: fake.sha256())
    is_active = True
    is_verified = False
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))
    updated_at = factory.LazyFunction(lambda: datetime.now(UTC))
    last_login = None

    # Optional role relationship
    role = factory.SubFactory(UserRoleFactory)
    role_id = factory.LazyAttribute(lambda obj: obj.role.id if obj.role else None)


class UserWithoutRoleFactory(UserFactory):
    """Factory for User model without a role."""

    role = None
    role_id = None


class UserProfileFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for UserProfile model."""

    class Meta:
        model = UserProfile
        sqlalchemy_session_persistence = "commit"

    user = factory.SubFactory(UserWithoutRoleFactory)
    user_id = factory.LazyAttribute(lambda obj: obj.user.id)
    first_name = factory.LazyAttribute(lambda obj: fake.first_name())
    last_name = factory.LazyAttribute(lambda obj: fake.last_name())
    bio = factory.LazyAttribute(lambda obj: fake.paragraph(nb_sentences=3))
    location = factory.LazyAttribute(lambda obj: f"{fake.city()}, {fake.state_abbr()}")
    website = factory.LazyAttribute(lambda obj: fake.url())
    github_username = factory.LazyAttribute(lambda obj: fake.user_name())
    linkedin_url = factory.LazyAttribute(
        lambda obj: f"https://linkedin.com/in/{fake.user_name()}"
    )
    avatar_url = factory.LazyAttribute(lambda obj: fake.image_url())
    timezone = factory.LazyAttribute(lambda obj: fake.timezone())
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))
    updated_at = factory.LazyFunction(lambda: datetime.now(UTC))


class CompleteUserFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for User with complete profile and role."""

    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    email = factory.LazyAttribute(lambda obj: fake.unique.email())
    password_hash = factory.LazyAttribute(lambda obj: fake.sha256())
    is_active = True
    is_verified = True
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))
    updated_at = factory.LazyFunction(lambda: datetime.now(UTC))
    last_login = factory.LazyFunction(lambda: datetime.now(UTC))

    # Role relationship
    role = factory.SubFactory(UserRoleFactory)
    role_id = factory.LazyAttribute(lambda obj: obj.role.id)

    # Profile relationship
    profile = factory.RelatedFactory(
        UserProfileFactory,
        "user",
        first_name=factory.LazyAttribute(lambda obj: fake.first_name()),
        last_name=factory.LazyAttribute(lambda obj: fake.last_name()),
    )


# Factory configuration functions
def configure_factories(session: Session):
    """Configure all factories to use the provided database session."""
    UserRoleFactory._meta.sqlalchemy_session = session
    UserFactory._meta.sqlalchemy_session = session
    UserWithoutRoleFactory._meta.sqlalchemy_session = session
    UserProfileFactory._meta.sqlalchemy_session = session
    CompleteUserFactory._meta.sqlalchemy_session = session
    PostFactory._meta.sqlalchemy_session = session
    QuizFactory._meta.sqlalchemy_session = session
    QuizQuestionFactory._meta.sqlalchemy_session = session
    ArticleFactory._meta.sqlalchemy_session = session
    QuizCompletionFactory._meta.sqlalchemy_session = session
    UserProgressFactory._meta.sqlalchemy_session = session


# Content Model Factories

class PostFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for Post model."""

    class Meta:
        model = Post
        sqlalchemy_session_persistence = "commit"

    title = factory.LazyAttribute(lambda obj: fake.sentence(nb_words=4)[:-1])  # Remove period
    slug = factory.LazyAttribute(lambda obj: fake.slug())
    content = factory.LazyAttribute(lambda obj: fake.text(max_nb_chars=2000))
    excerpt = factory.LazyAttribute(lambda obj: fake.paragraph(nb_sentences=2))
    image_url = factory.LazyAttribute(lambda obj: fake.image_url())
    published = factory.LazyAttribute(lambda obj: fake.boolean(chance_of_getting_true=70))
    featured = factory.LazyAttribute(lambda obj: fake.boolean(chance_of_getting_true=20))
    view_count = factory.LazyAttribute(lambda obj: fake.random_int(min=0, max=1000))
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))
    updated_at = factory.LazyFunction(lambda: datetime.now(UTC))

    # Author relationship
    author = factory.SubFactory(UserWithoutRoleFactory)
    author_id = factory.LazyAttribute(lambda obj: obj.author.id)


class QuizFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for Quiz model."""

    class Meta:
        model = Quiz
        sqlalchemy_session_persistence = "commit"

    title = factory.LazyAttribute(lambda obj: f"{fake.word().title()} Quiz")
    slug = factory.LazyAttribute(lambda obj: fake.slug())
    description = factory.LazyAttribute(lambda obj: fake.paragraph(nb_sentences=3))
    is_active = True
    passing_score = factory.LazyAttribute(lambda obj: fake.random_int(min=60, max=90))
    time_limit_minutes = factory.LazyAttribute(lambda obj: fake.random_int(min=15, max=120))
    max_attempts = factory.LazyAttribute(lambda obj: fake.random_int(min=1, max=5))
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))
    updated_at = factory.LazyFunction(lambda: datetime.now(UTC))

    # Creator relationship
    created_by = factory.SubFactory(UserWithoutRoleFactory)
    created_by_id = factory.LazyAttribute(lambda obj: obj.created_by.id)


class QuizQuestionFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for QuizQuestion model."""

    class Meta:
        model = QuizQuestion
        sqlalchemy_session_persistence = "commit"

    question_text = factory.LazyAttribute(lambda obj: f"{fake.sentence()}?")
    question_type = "multiple_choice"
    options = factory.LazyAttribute(lambda obj: f'["{fake.word()}", "{fake.word()}", "{fake.word()}", "{fake.word()}"]')
    correct_answer = factory.LazyAttribute(lambda obj: fake.word())
    explanation = factory.LazyAttribute(lambda obj: fake.sentence())
    points = factory.LazyAttribute(lambda obj: fake.random_int(min=1, max=10))
    order_index = factory.LazyAttribute(lambda obj: fake.random_int(min=1, max=20))
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))

    # Quiz relationship
    quiz = factory.SubFactory(QuizFactory)
    quiz_id = factory.LazyAttribute(lambda obj: obj.quiz.id)


class ArticleFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for Article model."""

    class Meta:
        model = Article
        sqlalchemy_session_persistence = "commit"

    title = factory.LazyAttribute(lambda obj: fake.sentence(nb_words=5)[:-1])
    slug = factory.LazyAttribute(lambda obj: fake.slug())
    content = factory.LazyAttribute(lambda obj: fake.text(max_nb_chars=3000))
    summary = factory.LazyAttribute(lambda obj: fake.paragraph(nb_sentences=2))
    category = factory.LazyAttribute(lambda obj: fake.random_element(elements=("Programming", "Web Development", "Data Science", "DevOps", "Career")))
    tags = factory.LazyAttribute(lambda obj: ",".join(fake.words(nb=3)))
    published = factory.LazyAttribute(lambda obj: fake.boolean(chance_of_getting_true=80))
    order_index = factory.LazyAttribute(lambda obj: fake.random_int(min=1, max=100))
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))
    updated_at = factory.LazyFunction(lambda: datetime.now(UTC))

    # Author relationship
    author = factory.SubFactory(UserWithoutRoleFactory)
    author_id = factory.LazyAttribute(lambda obj: obj.author.id)


class QuizCompletionFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for QuizCompletion model."""

    class Meta:
        model = QuizCompletion
        sqlalchemy_session_persistence = "commit"

    score = factory.LazyAttribute(lambda obj: fake.random_int(min=0, max=100))
    total_questions = factory.LazyAttribute(lambda obj: fake.random_int(min=5, max=20))
    correct_answers = factory.LazyAttribute(lambda obj: fake.random_int(min=0, max=obj.total_questions))
    time_spent_minutes = factory.LazyAttribute(lambda obj: fake.random_int(min=5, max=60))
    passed = factory.LazyAttribute(lambda obj: obj.score >= 70)
    attempt_number = factory.LazyAttribute(lambda obj: fake.random_int(min=1, max=3))
    completed_at = factory.LazyFunction(lambda: datetime.now(UTC))

    # Relationships
    user = factory.SubFactory(UserWithoutRoleFactory)
    user_id = factory.LazyAttribute(lambda obj: obj.user.id)
    quiz = factory.SubFactory(QuizFactory)
    quiz_id = factory.LazyAttribute(lambda obj: obj.quiz.id)


class UserProgressFactory(factory.alchemy.SQLAlchemyModelFactory):
    """Factory for UserProgress model."""

    class Meta:
        model = UserProgress
        sqlalchemy_session_persistence = "commit"

    total_quizzes_completed = factory.LazyAttribute(lambda obj: fake.random_int(min=0, max=50))
    total_quizzes_passed = factory.LazyAttribute(lambda obj: fake.random_int(min=0, max=obj.total_quizzes_completed))
    total_articles_read = factory.LazyAttribute(lambda obj: fake.random_int(min=0, max=100))
    current_streak_days = factory.LazyAttribute(lambda obj: fake.random_int(min=0, max=30))
    longest_streak_days = factory.LazyAttribute(lambda obj: fake.random_int(min=obj.current_streak_days, max=100))
    total_points = factory.LazyAttribute(lambda obj: fake.random_int(min=0, max=5000))
    level = factory.LazyAttribute(lambda obj: fake.random_int(min=1, max=10))
    last_activity_date = factory.LazyFunction(lambda: datetime.now(UTC))
    created_at = factory.LazyFunction(lambda: datetime.now(UTC))
    updated_at = factory.LazyFunction(lambda: datetime.now(UTC))

    # User relationship
    user = factory.SubFactory(UserWithoutRoleFactory)
    user_id = factory.LazyAttribute(lambda obj: obj.user.id)




def reset_factory_sequences():
    """Reset factory sequences for consistent test data."""
    UserRoleFactory.reset_sequence()
    UserFactory.reset_sequence(force=True)
    UserWithoutRoleFactory.reset_sequence(force=True)
    UserProfileFactory.reset_sequence()
    CompleteUserFactory.reset_sequence(force=True)
    PostFactory.reset_sequence()
    QuizFactory.reset_sequence()
    QuizQuestionFactory.reset_sequence()
    ArticleFactory.reset_sequence()
    QuizCompletionFactory.reset_sequence()
    UserProgressFactory.reset_sequence()
