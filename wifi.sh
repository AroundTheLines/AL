# Local reproduction of WiFi access script
configure_edison --wifi

curl -i\
-H "Accept: aplication/json"\
-H "Content-Type:application/json"\
-X POST --data "{"considerIp": "true","wifiAccessPoints":[{"macAddress": "'"01:23:45:67:AB"'"}]}" http://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBIJxVeb8GOebSNEEC_pjOUKEKaYhPVvus


curl --data "number='edison'" http://22ab2fae.ngrok.io/alert_helper
