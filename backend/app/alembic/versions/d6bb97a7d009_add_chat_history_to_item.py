"""add chat_history to item

Revision ID: d6bb97a7d009
Revises: 1a31ce608336
Create Date: 2025-07-08
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "d6bb97a7d009"
down_revision = "1a31ce608336"
branch_labels: None | str | tuple[str] = None  # type: ignore
depends_on: None | str | tuple[str] = None  # type: ignore


def upgrade() -> None:
    op.add_column(
        "item",
        sa.Column("chat_history", sa.JSON(), nullable=False, server_default="[]"),
    )


def downgrade() -> None:
    op.drop_column("item", "chat_history")
