#!/usr/bin/env python3
"""Simple helper to produce a series of git commits so that the
repository shows activity for a number of consecutive days.

This script is intentionally small and portable; it can be run
locally whenever you want to "check in" with your habits and
will make one commit per day starting from a given start date.

Usage:
    python Habits/commit_habits.py [days] [start_date]

Where ``days`` is how many consecutive days you want to cover
(default: 5) and ``start_date`` is an ISO date (YYYY-MM-DD)
used for the first commit (default: today).  The script sets
GIT_AUTHOR_DATE and GIT_COMMITTER_DATE so that the visible
commit dates line up with the chosen calendar dates.

The repository must already be a git repo and the script
expects to be executed from its root.  It simply appends a line
into ``Habits/habit_log.txt`` and commits that file repeatedly.

You can also accomplish the same effect by enabling the
accompanying GitHub Actions workflow in
``.github/workflows/habit.yml``; the workflow will run once per
day and push a small change automatically.  After five days you
can disable or delete the workflow.
"""

import datetime
import os
import subprocess
import sys


def make_commit(date: datetime.date, index: int):
    iso = datetime.datetime.combine(date, datetime.time(12, 0)).isoformat()
    env = os.environ.copy()
    env["GIT_AUTHOR_DATE"] = iso
    env["GIT_COMMITTER_DATE"] = iso

    # ensure the habits directory exists and the log file is there
    os.makedirs("Habits", exist_ok=True)
    with open("Habits/habit_log.txt", "a") as f:
        f.write(f"{iso} - habit day {index}\n")

    subprocess.run(["git", "add", "Habits/habit_log.txt"], env=env, check=True)
    subprocess.run([
        "git",
        "commit",
        "-m",
        f"habit day {index} ({iso})",
    ],
                   env=env,
                   check=True)


def main():
    days = 5
    if len(sys.argv) > 1:
        try:
            days = int(sys.argv[1])
        except ValueError:
            pass
    start = datetime.date.today()
    if len(sys.argv) > 2:
        try:
            start = datetime.date.fromisoformat(sys.argv[2])
        except ValueError:
            pass

    for i in range(days):
        make_commit(start + datetime.timedelta(days=i), i + 1)


if __name__ == "__main__":
    main()
