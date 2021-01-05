---
layout: post
title: "Vim, VSCode & Intellij: A Cheat Sheet" 
categories: [technology]
image: ibelonghere.webp
---

 In the last six months I've really started to adopt VS Code for editing on a regular basis. In the process, I realized how many shortcuts I've come to rely on in my goto editors, Vim and Intellij. Hence, here I list useful  features that I use across all three editors, as a reference to help in learning a consistent set of commands.


<!--more-->

## Navigation

### Moving by word

Vim 
 - `B`/`W` (uppercase) to move back/forward for 'real' words separated by whitespace. It moves to the start of words 
 - `b`/`w` (lowercase) works in the same way but treats words as being separated by any non alphanumeric character. Marginally more useful
 - `E`/`e` skips to the next end of word, as defined by whitespace/non-alphanumeric separators 

Although all these shortcuts allow for very precise movement, and complete control, in 90+ percent of cases this is more complex than it needs to be.

Intellij - `Option + <- / ->` arrows

 Navigation skips between the start and end character of each word. Like you are alternately pressing `w` and then `e` in vim. Normally this can be sufficient for what you need to do but it is a bit slow

VSCode - `Option + <- / ->` arrows

Very similar to how navigation works in Intellij, with a subtle but clever improvement. When you navigate forwards you move to the end of a word. When navigating backwards, you skip to the start of a word. This has the effect of making navigation quicker, as compared to intellij, but at the same time still making it easy to position your cursor at either the start or end of a word.

### Move to start/end of line or document

Vim
- `0`/`$` - start / end of line
- `gg`/`G` - Move to first line/ last line. Cursor moves to the start of line in both cases

VSCode
- `fn + <- / ->` - move to start / end of line
- `fn + up / down` - move to top / bottom of visible page
- `cmd + <- / ->` - ALTERNATIVE for moving to start / end of line
- `cmd + up / down` - move to first line + first character / last line + last character of file

Intellij
- `fn + <- / ->` - move to start or end of line
- `fn + up / down` - move to top / bottom of visible page
- `cmd + <- / ->` - ALTERNATIVE for moving to start / end of line

### Goto line

Vim - `:57` - go to line 57. You can also type `34|` (number then pipe character) to move the cursor to the 34th character in a line (and this will be persisted as you move lines) 

VSCode - `ctrl + g`, then type line number - move to line number. If you type ':<character number>' it will move to the character in the line rather than the start of the line

Intellij - `cmd + l`, then type line number to move to line. Moving to character works as in VSCode.

### Move around by searching

Vim
- `/searchString` - move to next match of the search string 
- `n`/`N` - move between next / previous matches

VS Code
- `Ctrl + f` - opens the search dialog. type `searchString` then `Enter` / `Shift + Enter` to move forwards / backwards through matches. THis also will find the next selection of selected text.

Intellij
- `Cmd + f` - as VS Code

### Replace search matches

Vim
- `:%s/search/replacement/gc` - inCremental string replacement starting from the beginning of the document (with sed). 
- `:.,$s/search/replacement/gc` - replace from the current line to the end of the file, rater than starting at the start of the file. You can customize this by changing . and $ to the start/finish line numbers you want
- `:%s/search/replacement/c` - changes all matches without prompting for each 

VSCode
- `Opt + Cmd + f` -  brings up replace dialog. `Enter` incrementally applies the replacement defined (only in the forwards direction). There is a button in the pop up box you can press to apply the replacement to all matches

Intellij
- `Cmd + r` = brings up replace dialog. This works roughly the same as in VS Code.

### Multicursor

Vim doesn't have multicursor but does have [more complicated alternatives to multicursor](https://medium.com/@schtoeffel/you-don-t-need-more-than-one-cursor-in-vim-2c44117d51db)

VSCode:
- `Cmd + mouse click` - spawns additional cursor at the mouse click
- `Cmd + up/down arrows` - spawns additional cursors on the next/previous lines 
- `Cmd + d` spawns another cursor selecting the next instance of selected text
- `Cmd + shift + l` selects all instances of the selected text

Intellij:
- `Opt + shift + mouse click` - spawns additional cursor at the mouse click
- Spawning additional cursors on lines above or below is something intellij understands but it doesn't by default have a keyboard shortcut 
- `Ctrl + g` spawns another cursor selecting the next instance of selected text
- `Ctrl + Cmd + g` selects all instances of the selected text


### Meta (shortcuts for finding shortcuts)

Vi
- `:help` - list of topics of of to use vim effectively
- `:help <topic-ref>` - access the help for a particular topic
- `:w + <prefix> tab` allows you to complete/select commands from a prefix. I find this to be more useful after setting `:set wildmenu` so that all possible completions are visible

VSCode
- `F1` - search for actions (not only those mapped to keyboard shortcuts)
- `Cmd + k`, followed by `Cmd + r` - open the keymap reference 
- `Cmd + k`, followed by `Cmd + s` - open all keyboard shortcuts to view or edit

Intellij
 - `Cmd + Shift + A` - search for actions (not only those mapped to keyboard shortcuts) 
 - Keymap reference can be found in the help menu, there is no shortcut
 - Similarly, the complete keymap for viewing or editing is found in the preferences menu

