
#Local reproduction of WiFi access script


curl -H "Content-Type: application/json" -X POST -d '{"wifiAccessPoints": [{"macAddress": "fc:c2:de:32:a4:bf"}]}' -o location.json  https://www.googleapis.com/geolocation/v1/geolocate\?key\=AIzaSyBIJxVeb8GOebSNEEC_pjOUKEKaYhPVvus
number="4167990397"


IP=$(ip addr show wlan0 | awk '/inet / {print $2}' | cut -d/ -f 1)
MAC=$(ip link show wlan0 | awk '/ether/ {print $2}')
iwconfig wlan0 | grep -i signal > signal.stdout
cat signal.stdout
temp=$(awk '{gsub(/dBm/,"");print}' signal.stdout)
echo "$temp" >temp.out
SIGNAL=$(echo $temp | awk '{gsub(/.*Signal/,"");print}' temp.out)
echo "$SIGNAL"
SIGNAL_NO="$(echo -e "${SIGNAL}" | tr -d '[[:space:]]')"
curl -G http://22ab2fae.ngrok.io/alert_helper\?ip\=$IP\&mac\=$MAC\&number\=$number\&signal\=$SIGNAL_NO
