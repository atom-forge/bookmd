---
type: content
tags:
  - interaction-design
  - interaction-patterns
  - affordances
---
# Interaction patterns and affordances

## Objectives

Students will recognize that an element's appearance, label, and behavior together communicate how to use it. They will deliberately choose familiar interaction patterns and explain when an unconventional solution helps or hinders the user's goal.

## What does an element reveal about its use?

> [!note] Key idea
> An **affordance** indicates how an object or interface element can be used. In digital interfaces, shape, labels, placement, feedback, and previous experience convey this together. A real button initiates an action; a link leads somewhere else; an input field accepts text. If a decorative card looks clickable but is not, or an action is hidden behind an icon disguised as text, users must guess.

Not every element needs to be a large button with a shadow. Meaning and behavior need to match. A “Details” link navigates; a “Submit booking” button initiates a state change. Swapping these roles creates more than visual inconsistency: it also creates incorrect expectations for keyboard and assistive technology users.

## Familiar patterns and innovation

Familiar patterns reduce learning costs. Users know search fields, back navigation, close controls, and form submission from many systems. Departures are allowed, but should bring a clear, greater benefit. A creative menu animation is unhelpful if it hides the main navigation; a novel gesture is unhelpful if it has no visible alternative.

Use patterns according to the task, not blindly. Deletion needs different confirmation from changing a filter because the consequences differ. Too many confirmation dialogs can create “alert fatigue”: users automatically click yes, and the safety step loses its value.

## Feedback during interaction

Every action should have a perceivable response. When clicking, selecting, dragging and dropping, or initiating a long operation, users should know the system received their intent. Feedback should communicate content state changes as well as animation. If selecting an appointment updates the summary, make the connection visible and understandable.

## Worked example

In a court booking service, some gray time slots can be booked and others cannot, but the difference becomes apparent only after clicking. A better solution indicates availability, the reason for disabled states, and the consequences of selection in advance. Users can read their options from the interface instead of learning through trial and error.

## Common misconceptions

| Statement | Clarification |
| --- | --- |
| “If an element is attractive, its use is obvious.” | Visual appeal is not the same as a clear role. |
| “Innovation requires a new gesture.” | Good innovation makes the task easier rather than teaching users new behavior without justification. |

## Review questions

1. Do your main elements' appearance and behavior promise the same thing?
2. Which familiar pattern could help your project?
3. Where is more immediate feedback needed after an action?

## Glossary

**Affordance:** a property indicating the possibility and manner of use.  
**Interaction pattern:** a recurring solution form familiar to users.  
**Feedback:** the system's response to a user action.  
**State change:** an understandable change in the system or interface after an interaction.
