

for /l %%x in (0, 1, 12) do (
    call audiosprite -o ch%%x -f howler -e mp3,ogg,m4a -s 1 -g  0.05 -v 9 -b 48 -r 44100 ch%%x/*.wav
)

