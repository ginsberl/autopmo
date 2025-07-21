import logging
import os
import uuid
import json
import azure.functions as func
from azure.storage.blob import BlobServiceClient

AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
BLOB_CONTAINER_NAME = "autopmo-uploads"

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        file = req.files.get('file')
        project_id = req.form.get('project_id')
        tags = req.form.get('tags', '')

        if not file or not project_id:
            return func.HttpResponse("Missing file or project_id", status_code=400)

        file_bytes = file.read()
        filename = file.filename
        ext = filename.split('.')[-1].lower()
        if ext not in ['pdf', 'docx', 'txt']:
            return func.HttpResponse("Unsupported file type", status_code=415)
        if len(file_bytes) > 10 * 1024 * 1024:
            return func.HttpResponse("File too large (max 10MB)", status_code=413)

        ref_id = str(uuid.uuid4())[:8]
        blob_name = f"{project_id}/{ref_id}_{filename}"

        blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
        blob_client = blob_service_client.get_blob_client(container=BLOB_CONTAINER_NAME, blob=blob_name)
        blob_client.upload_blob(file_bytes, overwrite=True)

        metadata = {
            "ref_id": ref_id,
            "filename": filename,
            "project_id": project_id,
            "tags": tags
        }

        return func.HttpResponse(
            body=json.dumps(metadata),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        logging.exception("Upload failed")
        return func.HttpResponse(f"Internal Server Error: {str(e)}", status_code=500)