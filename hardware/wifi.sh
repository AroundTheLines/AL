# Local reproduction of WiFi access script
configure_edison --wifi


curl -H "Content-Type: application/json" -X POST -d '{"wifiAccessPoints": [{"macAddress": "fc:c2:de:32:a4:bf"}]}' -o location.json  https://www.googleapis.com/geolocation/v1/geolocate\?key\=AIzaSyBIJxVeb8GOebSNEEC_pjOUKEKaYhPVvus





curl --data "number='+14167990397'" http://22ab2fae.ngrok.io/alert_helper


