---
type: content
tags:
  - user-goals
  - business-goals
  - constraints
---
# User goals, business goals, and constraints

## Objectives

Learn to distinguish the outcome users want, the service provider's goals, and the constraints on a solution. By the end of the lesson, you will be able to describe a conflict so that it is clear who benefits, who bears which risks, and which claims are supported by evidence or merely assumed.

## Three perspectives, one decision

> [!note] Key idea
> In digital products, decisions rarely benefit everyone equally. Someone using a booking service wants to find an appointment quickly. The provider wants to reduce unused capacity and cancellations. The operator needs accurate data, security, and a sustainable process. These goals are not enemies, but they are not identical either.

A **user goal** is the desired outcome, not an interface action: “secure an appointment that fits into my day,” rather than “click Book.” A **business goal** might be to increase the proportion of successfully completed bookings. A **constraint** is a condition that the design must respect: legislation, a privacy principle, an existing system, cost, a deadline, a contract, or physical capacity.

## Why is conflating goals dangerous?

When a team describes its own metric as a user benefit, it can easily create a manipulative solution or one that works only in the short term. For example, it might add a pop-up to every page to increase newsletter subscriptions. This may collect more email addresses initially, but it interrupts the first reading of the content, especially on mobile devices or with a screen reader.

This does not mean every organizational goal is bad. It means naming the effects of a decision. If information is mandatory for providing a service, explain why, when it will be used, and what happens without it. A clear explanation is not just an ethical issue: it also reduces uncertainty and the likelihood of incorrect data entry.

## A constraint is not an excuse

“Technical constraint” is often too vague. Break it down: which system lacks a capability, which data is missing, who manages it, and how far can the process be changed? An old student administration system might update capacity data only overnight. That does not mean users must guess. You can indicate how current the data is, provide alternative information, or confirm a critical decision.

Scope is also a constraint. A semester project does not need to design an entire marketplace. A thoroughly researched and tested solution to one high-risk task is a much stronger outcome than ten screens that have merely been drawn.

## A decision table in practice

Create a three-column table. Put the user goal in the first column, the organizational goal or operational need in the second, and the constraint and its source in the third. Then label the evidence in every row: **research data**, **brief**, **professional rule**, or **assumption**. This helps prevent assumptions from appearing as facts in the presentation later.

For example: “Students want to see whether a course clashes with courses they have already selected” is research data or an observation. “The institution must use the official timetable data” is an operational constraint. “The system can calculate clashes in real time” is an assumption until someone verifies it.

## Worked example: the cost of registration

A local event discovery service requires registration before any use. The organization's reasoning is understandable: it wants personalized recommendations and measurable campaigns. Users, however, simply want to decide whether anything interesting is happening tonight. The design question is not just whether registration is necessary, but which benefits actually require identification. Public browsing can work without signing in; saving favorites and buying tickets may require an account. This design supports the organizational need without making the first task unnecessarily difficult.

## Common misconceptions

| Statement | Clarification |
| --- | --- |
| “More data always creates a better experience.” | Only if the data is relevant, its benefit is understandable, and the request is proportionate to the situation. |
| “Constraints leave no room for design decisions.” | Constraints define the available space; the state, explanation, and alternative route communicated to users can still be designed. |
| “Organizational goals always conflict with users' interests.” | Often, successful task completion—such as an accurate booking—serves both. Identify conflicts rather than assuming them. |

## Review questions

1. Why is “register on the website” not a user goal?
2. What questions can help break down a vague technical constraint?
3. Give an example of an organizational goal that could have an unintended consequence for users.
4. Which claim in your project is an assumption that should be checked through research or consultation?

## Glossary

**Scope:** the boundary of tasks and exclusions deliberately accepted within a project.  
**Constraint:** a condition that limits possible solutions.  
**Organizational goal:** a desirable outcome for the service provider or business.  
**User goal:** the real outcome that a user wants to achieve.
