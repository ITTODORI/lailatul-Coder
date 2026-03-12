# Habits Commits

This small project helps you maintain a streak of GitHub commits for a
few days even if you don't have time to do real work.  There are two
ways to use it:

1. **Local script** – run a Python helper that makes one commit per day
   (dates are faked with `GIT_AUTHOR_DATE`/`GIT_COMMITTER_DATE`).
2. **GitHub Actions** – enable the workflow at
   `.github/workflows/habit.yml` and it will automatically push a tiny
   change once a day; you can disable or remove it after five runs.

## Local Usage

```sh
# make sure the repository is initialized and you have a working tree
# from the project root:
python Habits/commit_habits.py          # 5-day default, starts today
python Habits/commit_habits.py 7        # seven days instead of five
python Habits/commit_habits.py 5 2026-03-12  # start at specific date
```

You can schedule the script with `cron`, Task Scheduler, or any
scheduler you like to run it once per day.  It simply appends to
`Habits/habit_log.txt` and commits the change.

> **Tip:** if you already pushed earlier and want the dates to show up
> on GitHub correctly, use the script before pushing.  GitHub will
> display commits according to their author dates, so you may see the
> future days listed as soon as their calendar date arrives.

## GitHub Actions Workflow

A helper workflow is provided in `.github/workflows/habit.yml` that
runs at midnight UTC every day.  It appends a timestamp to the same
log file and pushes the commit with the built-in `github-actions[bot]`
identity.

To use it:

1. Commit and push the workflow file above.
2. Let the action run once per day for five days.
3. After the fifth successful run you can either delete the file or
disable the workflow from the repository settings to stop further
commits.

---

This is only a lightweight habit tracker for the purpose of generating
GitHub activity.  Feel free to extend it with real task tracking, API
calls, or whatever helps you stay motivated.
