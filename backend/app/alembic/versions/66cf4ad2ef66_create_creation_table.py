"""create creation table

Revision ID: 66cf4ad2ef66
Revises: d6bb97a7d009
Create Date: 2025-07-09 23:28:04.421520

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "66cf4ad2ef66"
down_revision = "d6bb97a7d009"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "creation",
        sa.Column("id", sa.UUID(), primary_key=True, nullable=False),
        sa.Column("owner_id", sa.UUID(), nullable=False),
        sa.Column("youtube_url", sa.String(), nullable=False),
        sa.Column("timestamp_data", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_foreign_key(
        None, "creation", "user", ["owner_id"], ["id"], ondelete="CASCADE"
    )


def downgrade() -> None:
    op.drop_table("creation")