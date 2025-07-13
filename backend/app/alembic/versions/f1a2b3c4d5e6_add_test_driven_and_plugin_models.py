"""Add test-driven and plugin models

Revision ID: f1a2b3c4d5e6
Revises: d98dd8ec85a3
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f1a2b3c4d5e6'
down_revision = 'd98dd8ec85a3'
branch_labels = None
depends_on = None


def upgrade():
    # Create TestRun table
    op.create_table('testrun',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('current_stage', sa.String(length=20), nullable=False),
        sa.Column('contract', sa.JSON(), nullable=False),
        sa.Column('scaffold_files', sa.JSON(), nullable=False),
        sa.Column('test_files', sa.JSON(), nullable=False),
        sa.Column('test_results', sa.JSON(), nullable=False),
        sa.Column('repair_attempts', sa.Integer(), nullable=False),
        sa.Column('max_repair_attempts', sa.Integer(), nullable=False),
        sa.Column('final_files', sa.JSON(), nullable=False),
        sa.Column('success', sa.Boolean(), nullable=False),
        sa.Column('error_message', sa.String(length=2000), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['project.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create PluginManifest table
    op.create_table('pluginmanifest',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('version', sa.String(length=20), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=False),
        sa.Column('inputs', sa.JSON(), nullable=False),
        sa.Column('outputs', sa.JSON(), nullable=False),
        sa.Column('command', sa.String(length=500), nullable=False),
        sa.Column('estimated_cost_ms', sa.Integer(), nullable=False),
        sa.Column('estimated_tokens', sa.Integer(), nullable=False),
        sa.Column('installed_at', sa.DateTime(), nullable=False),
        sa.Column('enabled', sa.Boolean(), nullable=False),
        sa.Column('verified', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Create PluginExecution table
    op.create_table('pluginexecution',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('plugin_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('started_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('duration_ms', sa.Integer(), nullable=True),
        sa.Column('input_files', sa.JSON(), nullable=False),
        sa.Column('output_files', sa.JSON(), nullable=False),
        sa.Column('success', sa.Boolean(), nullable=False),
        sa.Column('error_message', sa.String(length=1000), nullable=True),
        sa.Column('checksum', sa.String(length=64), nullable=True),
        sa.ForeignKeyConstraint(['plugin_id'], ['pluginmanifest.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create StudioObservation table
    op.create_table('studioobservation',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('prompt_hash', sa.String(length=64), nullable=False),
        sa.Column('prompt_text', sa.String(length=5000), nullable=False),
        sa.Column('diff_patch', sa.String(length=10000), nullable=False),
        sa.Column('tests_passed', sa.Integer(), nullable=False),
        sa.Column('tests_failed', sa.Integer(), nullable=False),
        sa.Column('latency_ms', sa.Integer(), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('model_used', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_studioobservation_prompt_hash', 'studioobservation', ['prompt_hash'])

    # Create StudioInsight table
    op.create_table('studioinsight',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('pattern_name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=False),
        sa.Column('confidence_score', sa.Float(), nullable=False),
        sa.Column('flake_rate', sa.Float(), nullable=False),
        sa.Column('avg_latency_ms', sa.Integer(), nullable=False),
        sa.Column('sample_size', sa.Integer(), nullable=False),
        sa.Column('recommended_action', sa.String(length=500), nullable=False),
        sa.Column('alternate_template', sa.String(length=100), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Add new columns to existing CodeGeneration table
    op.add_column('codegeneration', sa.Column('test_run_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.add_column('codegeneration', sa.Column('reasoning_steps', sa.JSON(), nullable=False, server_default='[]'))
    op.add_column('codegeneration', sa.Column('prop_annotations', sa.JSON(), nullable=False, server_default='{}'))


def downgrade():
    # Remove new columns from CodeGeneration
    op.drop_column('codegeneration', 'prop_annotations')
    op.drop_column('codegeneration', 'reasoning_steps')
    op.drop_column('codegeneration', 'test_run_id')

    # Drop tables in reverse order
    op.drop_table('studioinsight')
    op.drop_index('ix_studioobservation_prompt_hash')
    op.drop_table('studioobservation')
    op.drop_table('pluginexecution')
    op.drop_table('pluginmanifest')
    op.drop_table('testrun') 