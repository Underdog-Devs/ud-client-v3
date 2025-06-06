"""
Base factory configuration for UnderdogDevs testing.
"""

import factory
from faker import Faker

fake = Faker()


class BaseFactory(factory.Factory):
    """Base factory with common configuration."""

    class Meta:
        abstract = True

    @classmethod
    def _setup_next_sequence(cls):
        """Setup sequence counter for factories."""
        return 1
