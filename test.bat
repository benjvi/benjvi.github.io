start /b jekyll serve
rem wait until files are generated with ping
ping 192.0.2.2 -n 1 -w 2000 > nul
mkdir "_site\blog"
xcopy /e /y /R "_site\*" "_site\blog"