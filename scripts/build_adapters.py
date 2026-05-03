from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"


def copy_adapter(name: str) -> None:
    source = ROOT / "adapters" / name
    target = DIST / name
    if target.exists():
        shutil.rmtree(target)
    shutil.copytree(source, target)


def main() -> None:
    DIST.mkdir(exist_ok=True)
    for name in ["codex", "claude-code", "cursor", "generic"]:
        copy_adapter(name)
    print(f"Adapters built in {DIST}")


if __name__ == "__main__":
    main()
