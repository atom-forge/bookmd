---
type: resource
---
# Course Repository

This document summarizes the software and technologies to be used during the semester, as well as the technical framework for assignments, homework, and the individual project. During the course, the preparation and management of tasks will take place in a unified GitHub repository.

## Required Tools and Skills

Confident use of the following tools is essential for successfully completing the semester. We recommend that you take time to familiarize yourself with them as soon as possible:

- Learn how to use **[GitHub](https://docs.github.com/en/get-started/using-github/hello-world)**!
- Download and install the software called **[Obsidian](https://obsidian.md/)**, and get to know it!
- Master the ins and outs of writing **[MarkDown](https://www.markdownguide.org/)** documents!
- Learn how to use **[PowerMD](https://pwmd.atom-forge.eu/)** for Markdown-based presentations!
- Familiarize yourself with creating **[Mermaid](https://mermaid.js.org/)** diagrams!
- For managing the course project, you should also study how **[GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects)** (Kanban boards) work!

## Course GitHub Repository Structure

Create a GitHub repo for the subject and use it throughout the semester as follows. The repository tracks your homework, individual project, and presentations in one place. This is where the instructor will find verifiable results and submitted versions, and where you can later review how your work progressed. 

*Set the repository visibility and instructor access according to the course submission rules.*

### Folder Structure

```text
/ (Repository root)
├── README.md
├── homework/
│   └── 01/
│       └── README.md
├── presentation/
│   └── 01-01/
│       ├── README.md
│       ├── presentation.md
│       └── handout.md
└── project/
    ├── README.md
    └── docs/
```

---

## 1. Root Folder
The `README.md` file located in the project's root directory identifies you (Name, Neptun code).

**Template: `/README.md` (excerpt)**
```markdown
---
name:
neptun:
---
This repository tracks homework, the individual project, and presentations in one place. This is where the instructor will find verifiable results and submitted versions...
```

---

## 2. Homework
- When you receive homework, it will have a sequence number (usually the week of the semester).
- Create a folder in the `homework` directory corresponding to this number, e.g., `01` (with a leading **0** if it's only 1 digit).
- It should contain a `README.md` file, and any additional files containing your solution can also be placed here.

**Template: `homework/01/README.md`**
```markdown
---
week:
neptun:
---
{{Briefly: what did you complete this week?}}

{{Describe the essence of the solution, and link to the verifiable files or external results. Links should be relative within the repository.}}
```

---

## 3. Presentation
- Put your presentations in the `presentation` folder.
- Create a separate folder for each presentation using the week and topic ID (e.g., `presentation/01-01/`).

**Template: `presentation/01-01/README.md`**
```markdown
---
week:
id:
---
# {{PRESENTATION_TITLE}}

{{In one or two sentences, what is the presentation about?}}
```

**Template: `presentation/01-01/presentation.md` (PowerMD file)**
```markdown
<!--@slide Opening-->
# {{PRESENTATION_TITLE}}

{{A short opening question or problem.}}

---

<!--@slide The core of the topic-->
# {{FIRST_MAIN_IDEA}}

- {{KEYWORD_OR_SHORT_STATEMENT}}
- {{KEYWORD_OR_SHORT_STATEMENT}}

<!-- If you are presenting a process or relationship, you can use a ```mermaid code block instead of a bulleted list. -->

---

<!--@slide Takeaway-->
# {{MOST_IMPORTANT_TAKEAWAY}}

{{A short closing sentence.}}

<!-- The finished file is a PWMD presentation. Fill in the fields, repeat the middle slide as necessary, and remove editorial comments. `---` on a separate line starts a new slide. Do not use YAML frontmatter, as PWMD does not support it. Syntax: https://pwmd.atom-forge.eu/syntax.md -->
```

**Template: `presentation/01-01/handout.md` (Optional)**
```markdown
# {{PRESENTATION_TITLE}}

<!-- Only create a handout if the course syllabus requests it. It should be an independently readable explanation, not a copy of the slides. -->

**Presenter:** {{STUDENT_NAME}}  
**Week and topic:** {{WEEK_AND_TOPIC}}  
**Presentation:** [PWMD source](presentation.md)

## Short Summary

{{What is the topic about, and why is it useful?}}

## Explanation of the Core

{{Explain the main concepts, connections, and a relevant example in complete sentences.}}

## Main Takeaways

{{What is worth remembering?}}

## Concepts Learned

- **{{CONCEPT}}:** {{Precise, independently understandable definition.}}
```

---

## 4. Project (Individual Project)
- Keep the project files in the `project/` folder using a structure appropriate for the chosen technology.
- Create a `README.md` with a short description, results, and a weekly timeline.
- Additional documents (if any) should go under `project/docs/`.

**Template: `project/README.md`**
```markdown
# {{PROJECT_TITLE}}

{{Short description: what problem does the project solve, who is it for, and what is its current status?}}
## Timeline

| Week | Goal / Milestone | Verifiable Result |
| --- | --------------- | ---------------------- |
| 01  | {{WEEKLY_GOAL}}    | {{PARTIAL_RESULT}}       |
<!-- Expand the table for all relevant weeks. Track the current status of specific tasks on the GitHub Projects Kanban board, not in a second manual status list. -->
## GitHub Projects
- [PROJECT]({{GITHUB_PROJECT_URL}})
- The board shows the **Todo → In progress → Done** status of specific tasks and is also accessible to the instructor.
## Additional Documents
- If the course or project requires a separate document, keep it in the `project/docs/` folder and link it here.
- In the final repository, only strictly necessary documents and links should remain.
```