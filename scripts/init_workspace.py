from __future__ import annotations

import argparse
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    parser = argparse.ArgumentParser(description="Create private workspace/ from workspace.example/.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing workspace/.")
    args = parser.parse_args()

    source = ROOT / "workspace.example"
    target = ROOT / "workspace"
    if target.exists():
        if not args.force:
            raise SystemExit("workspace/ already exists. Pass --force to overwrite.")
        shutil.rmtree(target)
    shutil.copytree(source, target)
    print("Created workspace/ from workspace.example/. Keep it out of git.")


if __name__ == "__main__":
    main()
