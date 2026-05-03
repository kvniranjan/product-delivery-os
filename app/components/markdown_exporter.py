from __future__ import annotations

import re
from datetime import datetime
from typing import Any


def safe_download_filename(title: str, workflow_id: str, created_at: datetime | None = None) -> str:
    timestamp = (created_at or datetime.now()).strftime("%Y%m%d-%H%M%S")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", title.strip().lower()).strip("-") or "artifact"
    return f"{timestamp}-{workflow_id}-{slug}.md"


def export_markdown(content: str, metadata: dict[str, Any]) -> str:
    workflow = metadata.get("workflow", "Unknown workflow")
    created = metadata.get("created", datetime.now().isoformat(timespec="seconds"))
    source_title = metadata.get("source_input_title", "Untitled input")
    body = content.strip()
    return f"""---
workflow: {workflow}
created: {created}
source_input_title: {source_title}
generated_by: Product Delivery OS GUI
---

{body}
"""
