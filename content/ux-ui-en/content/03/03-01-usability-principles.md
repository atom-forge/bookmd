---
type: content
tags:
  - usability
  - heuristics
  - mental-models
---
# Usability principles

## Objectives

By the end of the lesson, students will understand that usability is not the same as fast clicking or visual appeal. They will be able to identify problems with system status visibility, consistency, error prevention, and user language within a task flow, then formulate justified improvement hypotheses.

## What makes an interface usable?

> [!note] Key idea
> An interface is usable when target users can complete their task successfully, with acceptable effort and sufficient confidence, in their own circumstances. This means more than eventually reaching the goal somehow. If booking takes twenty minutes of searching, repeated backtracking, and constant uncertainty, the system has technically worked, but the experience may be poor.

Always assess usability within a task. In an administrative system, a rarely used, complex function may be acceptable if an expert uses it and the stakes are high; the same number of steps can be a serious burden for a routine task performed several times a day. No interface is “simple” in every situation: the question is whether it is understandable relative to the task, person, and consequences.

## Make the system's status visible

Users need to know what is happening and what has happened. The system should not remain silent after saving; loading should not look like an unresponsive button; longer processes should show progress. Status feedback is especially important when users put time, money, or personal information at risk.

After submitting a booking, “Successful” is insufficient if it does not explain what succeeded. Stronger feedback is: “Your booking is confirmed for June 12 at 16:30. We sent confirmation to this email address. You can cancel up to 24 hours before the appointment.” This is task closure, not additional decoration.

## Users' language and mental models

A system's internal categories often differ from the concepts in users' minds. On a university website, “credit recognition procedure” may be officially accurate, but a first-year student may search for “count a previous course toward my degree.” An appropriate label connects the user's goal with the system's operation.

Do not ask only whether wording is correct. Also ask what people expect when clicking a label and how they know they are in the right place. Treat metaphors carefully too: an icon or name speeds things up only when it draws on shared meaning.

## Consistency, freedom, and error prevention

Elements with the same role should behave similarly. If blue underlined text is a link everywhere, do not use it purely as decoration in one place. If a back arrow returns one step, it should not erase entered information along the way. Consistency reduces the learning burden because users can apply previous experience.

User freedom means providing a safe way back: undo, editing, saved drafts, or a clear exit. This is not always possible—for example, a finalized bank transfer operates under different rules—which makes preventing errors before the action especially important. Good error prevention includes sensible defaults, hiding impossible options or disabling them with an explanation, and summarizing critical information before submission.

## Favor recognition over recall

Human short-term memory is limited. Do not expect users to remember an identifier, rule, or amount from a previous screen. Put relevant information where the decision happens. This does not mean displaying all data on every screen; make the details needed for the task available in clear groups.

## Worked example: a failed payment

An event website displays only “Transaction failed” during payment. The usability issue is not simply the brevity of the message. Users do not know whether their card was charged, whether their place is still reserved, whether they can retry payment, or how. The improvement must address this uncertainty: clear status, whether the booking was retained, the next step, and available help. The error message becomes part of the process rather than its end.

## Common misconceptions

| Statement | Clarification |
| --- | --- |
| “Fewer elements always make things simpler.” | If necessary information is missing, users replace it with external searches or guesses, making the overall process more complex. |
| “The user made an error, so pointing it out is enough.” | The system should reduce the likelihood, consequences, and recovery cost of errors. |
| “Consistency means components look identical.” | It primarily means consistent meaning and behavior. |

## Review questions

1. Where does your project need status feedback?
2. Which internal or specialist term should you translate into user language?
3. What critical error could you prevent rather than merely report afterward?
4. What information are you currently forcing users to remember?

## Glossary

**System status visibility:** showing what the system is doing and what result it reached.  
**Error prevention:** reducing the possibility or consequences of an incorrect action.  
**Mental model:** the user's understanding of how the system works.  
**Usability:** the extent to which a task can be completed effectively, efficiently, and with satisfaction.
