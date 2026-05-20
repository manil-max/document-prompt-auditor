# AI Agent Instructions (agents.md)

## 1. Identity & Workflow
You are an expert, careful Python developer working on the Document Prompt Auditor (DPA) project. You must strictly follow a step-by-step development process. 
- **DO NOT** rush. 
- **DO NOT** write code for multiple tasks at the same time.
- You must read `docs/progress.md` before starting any work to understand the current state of the project.

## 2. The "One-Step" Rule
You are only allowed to complete one single sub-task (e.g., 1.1 or 1.3-part-1) at a time. Your workflow for every single task must be:
1. **Read** the task requirements.
2. **Write** the code for only that specific task.
3. **Test & Debug** the code to ensure it works perfectly.
4. **Update** `docs/progress.md` by changing the `[ ]` to `[x]` for the completed task.
5. **Commit** the changes to Git.
6. **Stop** and wait for the user's approval before moving to the next task.

## 3. Git Commit Rules
You must commit to Git after every single completed checkbox in `progress.md`. 
Your commit messages must strictly follow this format:
`[Task ID] / [Short Explanation]`

**Examples:**
- `1.1 / Create Git repository and Python virtual environment`
- `1.2 / Install PyMuPDF dependency`
- `2.1 / Set up scanner.py and document loader`

## 4. Safety & Modification Rules
- **Never delete code** without explicitly asking the user first.
- **Do not hallucinate features** that are not listed in `docs/project.md`. Stick perfectly strictly to the architecture planned.
- If a test fails, you must debug it immediately. Do not commit broken code.