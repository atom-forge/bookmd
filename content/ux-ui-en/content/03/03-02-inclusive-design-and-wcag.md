---
chapter: "03.02"
tags:
  - accessibility
  - inclusive-design
  - wcag
---
# Inclusive design and WCAG

## Objectives

By the end of the lesson, students will understand that accessibility is a basic condition of a good digital service, rather than an afterthought for special users. They will know WCAG's POUR principles and recognize basic risks involving color, contrast, keyboard use, text, and feedback.

## Whom are we designing for?

> [!note] Key idea
> Barriers can be permanent, temporary, or situational. A blind or partially sighted person may use a screen reader; someone with a hand injury may temporarily work only with a keyboard; a student on a noisy train may need captions; bright sunlight or tired eyes may require larger text. Users' abilities and circumstances are part of real use, not exceptions.

Inclusive design therefore asks who might be excluded by a current decision, rather than how to make a separate version. A native button is focusable and keyboard-operable by default; fixing a clickable `div` afterward requires many additional details that are easy to forget. Accessibility often reinforces simpler, more robust solutions.

## WCAG's POUR approach

The four principles of the Web Content Accessibility Guidelines are easy to remember with the acronym POUR.

**Perceivable:** information can be received in some form. Images may need meaningful alternative text, videos may need captions or transcripts, and states communicated only through color may need another cue. Text must retain adequate contrast and remain scalable.

**Operable:** all essential functions can be controlled. We cannot assume a mouse, touch input, or quick reactions. Focus should be visible, keyboard order logical, and motion or time limits should not obstruct the task.

**Understandable:** text, behavior, and error messages are clear. “Invalid data” is insufficient; “The email address is missing an @ sign” helps users correct it. Unexpected state changes and inconsistent names are also understandability problems.

**Robust:** the interface uses a standards-based structure that different browsers and assistive technologies can interpret. Semantic elements and correctly used labels therefore matter.

## Contrast, color, and cues

For normal-sized text, the commonly cited WCAG AA target is a contrast ratio of at least 4.5:1; for large text, 3:1. These are not decorative rules. Poor contrast can cause problems for anyone using a low-quality display, working in sunlight, or reading with tired eyes.

Color should be an additional cue, not the only one. Giving an invalid form field only a red border is inadequate. It is better to combine the border with a text error message, an icon, and a programmatic association. Charts can use text, patterns, or direct labels alongside color.

## Keyboard and focus

For a quick manual check, put the mouse aside and navigate with Tab. Can you always see where you are? Is the order logical? Can you reach the menu, form, and close control? For a modal dialog, focus must move into the dialog, background elements must not remain accidentally reachable, and focus should return somewhere sensible when it closes.

## Worked example: an event page

On a faculty lecture page, the date appears only as a calendar icon, the location only on a map, and registration as a box labeled “Click here!” A more inclusive version also provides the date and address as text, uses a real button or link with a clear registration label, and includes written directions with the map. We have made the same task clearer for everyone rather than creating a separate page for one group.

## Common misconceptions

| Statement | Clarification |
| --- | --- |
| “An automated checker finds everything.” | A tool can identify missing labels or contrast issues, but cannot judge whether alternative text or a task flow makes sense. |
| “ARIA solves semantics.” | ARIA is a supplementary tool; the appropriate native element is the first choice. |
| “Accessibility limits creativity.” | It provides a framework in which visual design remains understandable and operable. |

## Review questions

1. What do the four letters of POUR stand for?
2. Why is color alone insufficient to indicate an error?
3. What would you observe while navigating with Tab?
4. Which information in your project appears exclusively in visual form?

## Glossary

**Accessibility:** ensuring content can be used by people with different abilities and assistive technologies.  
**Focus:** the state of the interactive element currently controlled by the keyboard.  
**Contrast ratio:** a measure of the luminance difference between foreground and background.  
**WCAG:** a set of guidelines for web content accessibility.
