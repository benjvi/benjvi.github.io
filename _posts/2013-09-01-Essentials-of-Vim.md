---
layout: post
title: "Using Vim: Just the Essentials"
categories: [technology]
image: tube.jpg
---

Vim is a text editor with a lot of history and a lot of advocates. It is also universally available on Unix-based systems. And, for this reason, some things become much easier when you know how to use it. It is more confusing initially than other editors - after not using it for a while and coming back to it I have found myself perplexed as how to actually edit the text! But, there are only a small number of things you need to remember to use it effectively.

<!--more-->

### Ensure vim can write to file

On Unix boxes, you can run `sudo vim [filename]` to run the editor with elevated privileges. Depending on the privileges set on the file, this may or not be necessary.

Alternatively, if you open a file and discover you don't have permission to write it, you can save it with sudo using the following Vim command: `:w !sudo tee %`.

### Command and Append Modes

The keys you press have different functions depending on which of the two modes you are in. At first, you will start off in command mode. In this mode, the keyboard buttons are used to send different commands to the editor. You are still able to navigate the text with the arrow keys or h,j,k,l (left, down, up, right).

You may change to the Append mode by entering one of the following commands:  

* `a` - append, start writing from the next character position
* `i` - insert, starts writing from the current character
* `o` - start writing from a new line

In the append mode you may use the keyboard in the "normal" way, to enter text into the document. Then, to return to control mode, you press the Esc key.

### Essential Commands - Saving

* `:w` will save (write) the file 
* `:wq` or `:x` will save and exit
* `:q!` will exit and discard changes
* `:w newfile` will save the text to newfile

### Very Useful Commands - Navigation

* `*` or `#` will search for the next/previous instance of the currently selected word
* `/astring` will search for "astring" in the file
* `ctrl + o` restores the position before the search was made
* `w` and `b` move forward/backwards one word
* `^` and `$` move to the start/end of a line

### Very Useful Commands - Editing

* `~` toggles the case of the selected character
* `J` joins the following line to the current line
* `dd` cuts ("deletes") the current line
* `y` copies ("yanks") the current line
* `p` and `P` paste before/after the cursor

### More

* `.` repeats the previous command
* `:help` provides additional information - there is much more than is described here!
* [Here](http://www.viemu.com/a-why-vi-vim.html) is some further information on the benefits of using Vim and more details on how you can make the most of it

