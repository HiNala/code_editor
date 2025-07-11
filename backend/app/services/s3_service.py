import boto3

from app.core.config import settings

__all__ = ["s3_client", "generate_presigned_put", "generate_presigned_get"]

# Initialize the S3 client using AWS credentials
s3_client = boto3.client(
    "s3",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)

def generate_presigned_put(key: str, expires_in: int = 3600) -> str:
    """
    Generate a presigned URL to upload a file to S3.
    """
    return s3_client.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": settings.S3_BUCKET_NAME, "Key": key},
        ExpiresIn=expires_in,
    )

def generate_presigned_get(key: str, expires_in: int = 3600) -> str:
    """
    Generate a presigned URL to download a file from S3.
    """
    return s3_client.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": settings.S3_BUCKET_NAME, "Key": key},
        ExpiresIn=expires_in,
    )