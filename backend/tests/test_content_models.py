"""
Test the content models: Post, Quiz, QuizQuestion, Article, UserProgress, QuizCompletion.
"""

from datetime import datetime

import pytest
from sqlalchemy.exc import IntegrityError

from app.models.content import (
    Article,
    Post,
    Quiz,
    QuizCompletion,
    QuizQuestion,
    UserProgress,
)
from app.models.user import User


@pytest.mark.integration
class TestPost:
    """Test the Post model."""

    def test_create_post(self, db_session):
        """Test creating a blog post."""
        # Create author
        author = User(email="author@example.com", password_hash="hash")
        db_session.add(author)
        db_session.flush()

        post = Post(
            title="Test Blog Post",
            slug="test-blog-post",
            content="This is the main content of the blog post.",
            excerpt="This is a brief excerpt.",
            author_id=author.id,
            published=True,
            featured=False,
        )
        db_session.add(post)
        db_session.commit()

        assert post.id is not None
        assert post.title == "Test Blog Post"
        assert post.slug == "test-blog-post"
        assert post.content == "This is the main content of the blog post."
        assert post.excerpt == "This is a brief excerpt."
        assert post.author_id == author.id
        assert post.published is True
        assert post.featured is False
        assert post.view_count == 0  # Default value
        assert isinstance(post.created_at, datetime)
        assert isinstance(post.updated_at, datetime)

    def test_post_author_relationship(self, db_session):
        """Test the post-author relationship."""
        author = User(email="post_author@example.com", password_hash="hash")
        db_session.add(author)
        db_session.flush()

        post = Post(
            title="Relationship Test",
            slug="relationship-test",
            content="Testing relationships",
            author_id=author.id,
        )
        db_session.add(post)
        db_session.commit()

        # Test relationship from post to author
        assert post.author == author

        # Test relationship from author to posts
        assert post in author.posts

    def test_post_unique_slug_constraint(self, db_session):
        """Test that post slugs must be unique."""
        author = User(email="unique_slug@example.com", password_hash="hash")
        db_session.add(author)
        db_session.flush()

        post1 = Post(title="First Post", slug="same-slug", content="Content 1", author_id=author.id)
        post2 = Post(title="Second Post", slug="same-slug", content="Content 2", author_id=author.id)

        db_session.add(post1)
        db_session.commit()

        db_session.add(post2)
        with pytest.raises(IntegrityError):
            db_session.commit()

    def test_post_repr(self, db_session):
        """Test the Post string representation."""
        author = User(email="repr_test@example.com", password_hash="hash")
        db_session.add(author)
        db_session.flush()

        post = Post(title="Repr Test", slug="repr-test", content="Content", author_id=author.id, published=True)
        db_session.add(post)
        db_session.commit()

        expected = f"<Post(id={post.id}, title='Repr Test', published=True)>"
        assert repr(post) == expected


@pytest.mark.integration
class TestQuiz:
    """Test the Quiz model."""

    def test_create_quiz(self, db_session):
        """Test creating a quiz."""
        creator = User(email="quiz_creator@example.com", password_hash="hash")
        db_session.add(creator)
        db_session.flush()

        quiz = Quiz(
            title="Python Basics Quiz",
            slug="python-basics",
            description="Test your Python knowledge",
            is_active=True,
            passing_score=80,
            time_limit_minutes=30,
            max_attempts=3,
            created_by_id=creator.id,
        )
        db_session.add(quiz)
        db_session.commit()

        assert quiz.id is not None
        assert quiz.title == "Python Basics Quiz"
        assert quiz.slug == "python-basics"
        assert quiz.description == "Test your Python knowledge"
        assert quiz.is_active is True
        assert quiz.passing_score == 80
        assert quiz.time_limit_minutes == 30
        assert quiz.max_attempts == 3
        assert quiz.created_by_id == creator.id
        assert isinstance(quiz.created_at, datetime)

    def test_quiz_creator_relationship(self, db_session):
        """Test the quiz-creator relationship."""
        creator = User(email="quiz_rel@example.com", password_hash="hash")
        db_session.add(creator)
        db_session.flush()

        quiz = Quiz(
            title="Relationship Quiz",
            slug="rel-quiz",
            description="Testing relationships",
            created_by_id=creator.id,
        )
        db_session.add(quiz)
        db_session.commit()

        assert quiz.created_by == creator
        assert quiz in creator.created_quizzes

    def test_quiz_defaults(self, db_session):
        """Test quiz model defaults."""
        creator = User(email="defaults@example.com", password_hash="hash")
        db_session.add(creator)
        db_session.flush()

        quiz = Quiz(title="Default Quiz", slug="default-quiz", created_by_id=creator.id)
        db_session.add(quiz)
        db_session.commit()

        assert quiz.is_active is True
        assert quiz.passing_score == 70
        assert quiz.time_limit_minutes is None
        assert quiz.max_attempts is None


@pytest.mark.integration
class TestQuizQuestion:
    """Test the QuizQuestion model."""

    def test_create_quiz_question(self, db_session):
        """Test creating a quiz question."""
        creator = User(email="question_creator@example.com", password_hash="hash")
        db_session.add(creator)
        db_session.flush()

        quiz = Quiz(title="Test Quiz", slug="test-quiz", created_by_id=creator.id)
        db_session.add(quiz)
        db_session.flush()

        question = QuizQuestion(
            quiz_id=quiz.id,
            question_text="What is Python?",
            question_type="multiple_choice",
            options='["A programming language", "A snake", "A movie", "A game"]',
            correct_answer="A programming language",
            explanation="Python is a high-level programming language.",
            points=5,
            order_index=1,
        )
        db_session.add(question)
        db_session.commit()

        assert question.id is not None
        assert question.quiz_id == quiz.id
        assert question.question_text == "What is Python?"
        assert question.question_type == "multiple_choice"
        assert question.options == '["A programming language", "A snake", "A movie", "A game"]'
        assert question.correct_answer == "A programming language"
        assert question.explanation == "Python is a high-level programming language."
        assert question.points == 5
        assert question.order_index == 1

    def test_question_quiz_relationship(self, db_session):
        """Test the question-quiz relationship."""
        creator = User(email="q_rel@example.com", password_hash="hash")
        db_session.add(creator)
        db_session.flush()

        quiz = Quiz(title="Relationship Quiz", slug="q-rel", created_by_id=creator.id)
        db_session.add(quiz)
        db_session.flush()

        question = QuizQuestion(
            quiz_id=quiz.id,
            question_text="Test question",
            correct_answer="Test answer",
            order_index=1,
        )
        db_session.add(question)
        db_session.commit()

        assert question.quiz == quiz
        assert question in quiz.questions

    def test_question_defaults(self, db_session):
        """Test quiz question defaults."""
        creator = User(email="q_defaults@example.com", password_hash="hash")
        db_session.add(creator)
        db_session.flush()

        quiz = Quiz(title="Default Question Quiz", slug="q-defaults", created_by_id=creator.id)
        db_session.add(quiz)
        db_session.flush()

        question = QuizQuestion(
            quiz_id=quiz.id,
            question_text="Default question",
            correct_answer="Answer",
            order_index=1,
        )
        db_session.add(question)
        db_session.commit()

        assert question.question_type == "multiple_choice"
        assert question.points == 1


@pytest.mark.integration
class TestArticle:
    """Test the Article model."""

    def test_create_article(self, db_session):
        """Test creating an article."""
        author = User(email="article_author@example.com", password_hash="hash")
        db_session.add(author)
        db_session.flush()

        article = Article(
            title="Getting Started with Python",
            slug="getting-started-python",
            content="Complete guide to Python programming...",
            summary="Learn Python basics",
            category="Programming",
            tags="python,beginners,tutorial",
            published=True,
            order_index=1,
            author_id=author.id,
        )
        db_session.add(article)
        db_session.commit()

        assert article.id is not None
        assert article.title == "Getting Started with Python"
        assert article.slug == "getting-started-python"
        assert article.content == "Complete guide to Python programming..."
        assert article.summary == "Learn Python basics"
        assert article.category == "Programming"
        assert article.tags == "python,beginners,tutorial"
        assert article.published is True
        assert article.order_index == 1
        assert article.author_id == author.id

    def test_article_author_relationship(self, db_session):
        """Test the article-author relationship."""
        author = User(email="art_rel@example.com", password_hash="hash")
        db_session.add(author)
        db_session.flush()

        article = Article(
            title="Relationship Article",
            slug="rel-article",
            content="Testing relationships",
            author_id=author.id,
        )
        db_session.add(article)
        db_session.commit()

        assert article.author == author
        assert article in author.articles


@pytest.mark.integration
class TestQuizCompletion:
    """Test the QuizCompletion model."""

    def test_create_quiz_completion(self, db_session):
        """Test creating a quiz completion record."""
        user = User(email="completion_user@example.com", password_hash="hash")
        creator = User(email="completion_creator@example.com", password_hash="hash")
        db_session.add_all([user, creator])
        db_session.flush()

        quiz = Quiz(title="Completion Quiz", slug="completion-quiz", created_by_id=creator.id)
        db_session.add(quiz)
        db_session.flush()

        completion = QuizCompletion(
            user_id=user.id,
            quiz_id=quiz.id,
            score=85,
            total_questions=10,
            correct_answers=8,
            time_spent_minutes=25,
            passed=True,
            attempt_number=1,
        )
        db_session.add(completion)
        db_session.commit()

        assert completion.id is not None
        assert completion.user_id == user.id
        assert completion.quiz_id == quiz.id
        assert completion.score == 85
        assert completion.total_questions == 10
        assert completion.correct_answers == 8
        assert completion.time_spent_minutes == 25
        assert completion.passed is True
        assert completion.attempt_number == 1

    def test_completion_relationships(self, db_session):
        """Test quiz completion relationships."""
        user = User(email="comp_rel_user@example.com", password_hash="hash")
        creator = User(email="comp_rel_creator@example.com", password_hash="hash")
        db_session.add_all([user, creator])
        db_session.flush()

        quiz = Quiz(title="Completion Rel Quiz", slug="completion-rel-quiz", created_by_id=creator.id)
        db_session.add(quiz)
        db_session.flush()

        completion = QuizCompletion(
            user_id=user.id,
            quiz_id=quiz.id,
            score=90,
            total_questions=5,
            correct_answers=5,
            passed=True,
        )
        db_session.add(completion)
        db_session.commit()

        assert completion.user == user
        assert completion.quiz == quiz
        assert completion in user.quiz_completions
        assert completion in quiz.completions


@pytest.mark.integration
class TestUserProgress:
    """Test the UserProgress model."""

    def test_create_user_progress(self, db_session):
        """Test creating a user progress record."""
        user = User(email="progress_user@example.com", password_hash="hash")
        db_session.add(user)
        db_session.flush()

        progress = UserProgress(
            user_id=user.id,
            total_quizzes_completed=5,
            total_quizzes_passed=4,
            total_articles_read=10,
            current_streak_days=7,
            longest_streak_days=15,
            total_points=450,
            level=3,
        )
        db_session.add(progress)
        db_session.commit()

        assert progress.id is not None
        assert progress.user_id == user.id
        assert progress.total_quizzes_completed == 5
        assert progress.total_quizzes_passed == 4
        assert progress.total_articles_read == 10
        assert progress.current_streak_days == 7
        assert progress.longest_streak_days == 15
        assert progress.total_points == 450
        assert progress.level == 3

    def test_progress_user_relationship(self, db_session):
        """Test the progress-user relationship."""
        user = User(email="prog_rel@example.com", password_hash="hash")
        db_session.add(user)
        db_session.flush()

        progress = UserProgress(user_id=user.id)
        db_session.add(progress)
        db_session.commit()

        assert progress.user == user
        assert user.progress == progress

    def test_progress_defaults(self, db_session):
        """Test user progress defaults."""
        user = User(email="prog_defaults@example.com", password_hash="hash")
        db_session.add(user)
        db_session.flush()

        progress = UserProgress(user_id=user.id)
        db_session.add(progress)
        db_session.commit()

        assert progress.total_quizzes_completed == 0
        assert progress.total_quizzes_passed == 0
        assert progress.total_articles_read == 0
        assert progress.current_streak_days == 0
        assert progress.longest_streak_days == 0
        assert progress.total_points == 0
        assert progress.level == 1

    def test_progress_unique_user_constraint(self, db_session):
        """Test that each user can have only one progress record."""
        user = User(email="unique_progress@example.com", password_hash="hash")
        db_session.add(user)
        db_session.flush()

        progress1 = UserProgress(user_id=user.id)
        progress2 = UserProgress(user_id=user.id)

        db_session.add(progress1)
        db_session.commit()

        db_session.add(progress2)
        with pytest.raises(IntegrityError):
            db_session.commit()


@pytest.mark.integration
class TestContentModelCascades:
    """Test cascade behavior for content models."""

    def test_quiz_question_cascade_delete(self, db_session):
        """Test that quiz questions are deleted when quiz is deleted."""
        creator = User(email="cascade_creator@example.com", password_hash="hash")
        db_session.add(creator)
        db_session.flush()

        quiz = Quiz(title="Cascade Quiz", slug="cascade-quiz", created_by_id=creator.id)
        db_session.add(quiz)
        db_session.flush()

        question1 = QuizQuestion(
            quiz_id=quiz.id,
            question_text="Question 1",
            correct_answer="Answer 1",
            order_index=1,
        )
        question2 = QuizQuestion(
            quiz_id=quiz.id,
            question_text="Question 2",
            correct_answer="Answer 2",
            order_index=2,
        )
        db_session.add_all([question1, question2])
        db_session.commit()

        question_ids = [question1.id, question2.id]

        # Delete the quiz
        db_session.delete(quiz)
        db_session.commit()

        # Questions should be deleted due to cascade
        for question_id in question_ids:
            deleted_question = db_session.get(QuizQuestion, question_id)
            assert deleted_question is None

