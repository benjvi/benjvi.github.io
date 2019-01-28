---
layout: post
title: "Vim, VSCode & Intellij: A Rosetta Stone" 
categories: [technology]
image: ibelonghere.png
---

Vim is famous for having an initial learning curve, that can put off some novices. But having learnt some basics, its a very effective editor. But the best visual editors also have a bunch of useful keyboard shortcuts for navigation and other useful features. In this post, I compare a small set of simple shortcuts that you can use frequently. Using them, you can have a good basic editing experience in Vim, VSCode or Intellij.

## Navigation

### Moving by word

Vim (command mode)
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

Comparing the three, it's clear VS Code is awesome! Here, it has cmd as a useful alternative to fn for moving to the start/end of document, which also means it makes sense that you can move to the start and end of a line with cmd.

### Undo/Redo

TODO

### Goto line

Vim - `:57` - go to line 57 

VSCode - `Cmd + G`, then line number - move to line number

Intellij - TODO

### Move around by searching

Vim
- `/searchString` - move to next match of the search string 
- `n`/`N` - move between next / previous matches

VS Code
- `Ctrl + f` - opens the search dialog. type `searchString` then `Enter` / `Shift + Enter` to move forwards / backwards through matches
- `Cmd + g` - when you have text selected, this moves to the next instance of the text. Shift also reverses the direction here.

Intellij
- `Ctrl + f` - as VS Code
TODO: next instance 

### Replace search matches

Vim
- `:%s/search/replacement/c` - inCremental string replacement starting from the beginning of the document (with sed). TODO: you can customize this by changing % to something else
- `
VSCode
- `Ctrl + r` -  brings up replace dialog. `Enter` incrementally applies the replacement defined (only in the forwards direction). There is a button in the dialog you can press to apply the replacement to all matches

### Multicursor

Vim doesn't have multicursor but does have more complicated alternatives to multicursor:
https://medium.com/@schtoeffel/you-don-t-need-more-than-one-cursor-in-vim-2c44117d51db

### Meta (shortcuts for finding shortcuts)

## Notable Omissions


