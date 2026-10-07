---
tags:
  - problem-framing
  - success-criteria
  - assumptions
---
# 01.03. Problem framing and success criteria

## Objectives

By the end of the lesson, you will be able to formulate a user problem instead of a solution idea, break the problem down into assumptions grounded in evidence, and write a success criterion that can actually be checked with a prototype or test.

## A solution is not a problem

> [!note] Key idea
> Design discussions often include statements such as “We need a mobile app,” “let's add a chatbot,” or “we should have a more modern dashboard.” These are proposals for possible solutions. They do not explain who the users are, what they are trying to achieve, what prevents them, or how serious the consequences of failure are. If we commit to them too early, research will simply look for reasons why the chosen idea is good.

A useful framework is: **[user] in [situation] wants to achieve [goal], but [obstacle] causes [consequence].** For example: “When registering for courses, first-year students want to compare courses with conflicting times, but the times appear in several separate views, so they make decisions without confidence.” This is not yet a solution. It does, however, define the investigation: does this really cause the difficulty, for whom, how often, and what information would help?

## The elements of a problem

A strong problem statement has an actor, a situation, a goal, an obstacle, and a consequence. **Situation** matters because the same person may need different things when first exploring options and immediately before a deadline. **Consequence** helps with prioritization. An ambiguous label may be annoying, but misunderstood cancellation conditions can cause financial loss or a lost appointment.

Do not try to solve an overly large problem. “University administration is complicated” may be true, but it is not manageable within a semester project. “Students cannot determine whether they need to upload another document before submitting their application” is a task that can be investigated and designed for.

## Assumptions and evidence

The initial problem frame inevitably contains assumptions. This is not a mistake if you make them visible. Create an **assumption map**: which claims come from observations, which come from the brief, and which simply seem logical? Mark the risk too: if a claim is wrong, how much would the design change?

For example, you might assume that users make bookings on their phones. If this is not true, a responsive view may still matter, but it may not be the main design question. By contrast, if you assume everyone understands the service's jargon and this turns out to be wrong, it could affect the entire navigation and content.

## Success criteria: how do we know it improved?

A success criterion should not be an aesthetic judgment such as “make it clean” or “the tester should like it.” Connect it to behavior and consequences. A good criterion clearly describes the task, the indication of success, and, where possible, errors or effort.

Examples:

- Participants select a suitable appointment without outside help and can explain the cancellation condition.
- Participants enter the required fields correctly on their first attempt or can correct the information using the error message.
- After booking, participants can confidently say whether the booking was created, when and where it is, and what happens next.

Small-scale research does not need to promise statistically generalizable metrics. It is also a valuable result if three relevant participants get stuck at the same point and this difficulty disappears in the revised prototype. The important thing is to match the claim to the limitations of the sample.

## Worked example: finding a local event

Initial idea: “We need a map-based event app.” Research question: how do students find something suitable to do tonight? Conversations may reveal that the main problem is not missing location information, but that event pages do not quickly communicate the price, start time, language, or registration requirement. The reframed problem is: “Students looking for spontaneous plans want to compare tonight's events quickly, but the basic information they need is scattered or incomplete, so they abandon the search or choose an unsuitable event.”

This does not yet imply a map is needed. The first prototype could be an easily filtered list that presents the information needed for comparison upfront. The test's success criterion: participants find an event matching their own conditions within two minutes and can explain why it is suitable.

## Common misconceptions

| Statement | Clarification |
| --- | --- |
| “The more detailed the problem statement, the better.” | Detail is useful when it can be investigated or influences a decision. An invented backstory is not evidence. |
| “A success criterion is the same as our project goal.” | A project goal can be broad; a success criterion defines how to check the specific task being designed. |
| “If the participant completed it, there is no problem.” | Watch for detours, uncertainty, errors, and whether the participant understood the consequences. |

## Review questions

1. Why is “let's create a clean interface” not a problem statement?
2. What success criterion would be observable in your own project?
3. Which assumption would pose the greatest risk if it proved wrong?
4. How would you narrow an overly broad problem to a single testable task?

## Glossary

**Assumption:** an unverified claim that may influence a design decision.  
**Problem framing:** clearly expressing the user, situation, goal, obstacle, and consequence.  
**Success criterion:** an observable indication of whether the user achieved the goal.  
**Design hypothesis:** a testable claim about the effect a change will have on users.
