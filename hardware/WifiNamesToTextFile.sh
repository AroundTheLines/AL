wpa_cli -i wlan0 scan
OUTPUT="$(wpa_cli -i wlan0 scan_results)"
destdir="newtext.txt"
echo "${OUTPUT}" > "$destdir"
~
