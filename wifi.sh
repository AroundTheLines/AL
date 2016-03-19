# Local reproduction of WiFi access script
configure_edison --wifi
curl --data "number='edison'" http://22ab2fae.ngrok.io/alert_helper
