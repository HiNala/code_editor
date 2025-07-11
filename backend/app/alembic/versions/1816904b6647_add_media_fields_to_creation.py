"""
add media fields to creation

Revision ID: 1816904b6647
Revises: 66cf4ad2ef66
Create Date: 2025-07-10 14:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '1816904b6647'
down_revision = '66cf4ad2ef66'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'creation',
        sa.Column(
            'input_video_keys',
            sa.JSON(),
            nullable=False,
            server_default='[]',
        ),
    )
    op.add_column(
        'creation',
        sa.Column(
            'input_audio_keys',
            sa.JSON(),
            nullable=False,
            server_default='[]',
        ),
    )
    op.add_column(
        'creation',
        sa.Column(
            'status',
            sa.String(),
            nullable=False,
            server_default='pending',
        ),
    )
    op.add_column(
        'creation',
        sa.Column('output_video_key', sa.String(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column('creation', 'output_video_key')
    op.drop_column('creation', 'status')
    op.drop_column('creation', 'input_audio_keys')
    op.drop_column('creation', 'input_video_keys')