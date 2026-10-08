---
chapter: "06.03"
tags:
  - components
  - responsive-design
  - ui-states
---
# Components and responsive states

## Objectives

Students will understand that a component is an interface unit with a recurring role and rules, rather than simply a copyable graphic box. They will be able to design a component's essential states and a screen's responsive behavior around the task.

## What is a component?

> [!note] Key idea
> A component can be a button, search field, event card, notification, or appointment picker. Treat something as a component when it serves the same purpose in several places with consistent rules. A good component needs more than a default state: define what happens when focused, used with a keyboard, selected, disabled, loading, in error, or containing long text.

Repetition is not an end in itself. If two cards support different tasks, do not force them into the same form. But if a “Book” button indicates different consequences in three places, users cannot apply what they previously learned.

## Documenting states

Create a state list for each critical component. For a text field, for example: default, focused, filled, valid, invalid, disabled, and loading. Design more than color changes: changes should be visible, understandable, and conveyable through a screen reader. Explain which condition is missing for a disabled button; make error recovery clear too.

## Responsive behavior

Responsiveness means more than shrinking a desktop layout. On a small screen, priorities, order, input methods, and available attention may change. First identify the essential task and information core that must not be lost, then build larger-screen additions around it. Zooming is also a responsive situation: if content is clipped or an action becomes unreachable at 200%, the interface is not device-independent.

## Worked example

On desktop, an event card contains an image, title, description, tags, and two buttons. On mobile, the buttons and long description crowd out the time and location needed for a quick decision. The responsive version retains the title, time, location, price, and primary action; the full description and secondary action can be opened separately. This prioritizes content around the task without losing it.

## Review questions

1. Which component recurs in your project?
2. Which state have you not yet designed?
3. What information core must your screen retain on mobile?
4. Does the order still support the task when zoomed in?

## Glossary

**Component:** an interface unit with a recurring role and documented behavior.  
**State:** a component's appearance and behavior in a particular situation.  
**Responsive behavior:** an interface's task-oriented adaptation to screen size and usage circumstances.  
**Information core:** the content and actions essential to completing the task.
