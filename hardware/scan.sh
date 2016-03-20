systemctl enable wpa_supplicant
currentwifi=$(iwconfig 2>&1 | grep ESSID)
nowwifi=$(iwconfig 2>&1 | grep ESSID)
echo $currentwifi
while [[ $currentwifi == *"$nowwifi"* ]]
do
sleep 5
nowwifi=$(iwconfig 2>&1 | grep ESSID)
echo 'loop'
done

# Use wpa_cli to scan for networks
wpa_cli -i wlan0 scan

# Create file to store scanned networks and display file path
OUTPUT="$(wpa_cli -i wlan0 scan_results)"
destdir="networks.txt"
echo "${OUTPUT}" > "$destdir"

# Prints out list of ESS networks with all the info
awk ' /WPA/ {next} /WEP/ {next} /WPS/ {next} {print}' networks.txt

# Counts number of ESS networks 
awk 'BEGIN{total=-1} /WPA/ {next} /WEP/ {next} /WPS/ {next} {total += 1} END{}' networks.txt
curl -G http://22ab2fae.ngrok.io/number_connections\?connections\=3\&number\=+14167990397


# Output names of ESS networks
awk '/ssid/ {next} /WPA/ {next} /WEP/ {next} /WPS/ {next} {gsub(/.*\[ESS\]/,"");print}' networks.txt

# Create file of only network names
OUTPUT="$(awk '/ssid/ {next} /WPA/ {next} /WEP/ {next} /WPS/ {next} {gsub(/.*\[ESS\]/,"");print}' networks.txt)"
destdir="open_networks.txt"
echo "${OUTPUT}" > "$destdir"
 

input="open_networks.txt"
while read line
do
	echo $line
        wpa_cli -iwlan0 disconnect
        for i in `wpa_cli -iwlan0 list_networks | grep ^[0-9] | cut -f1`; do wpa_cli -iwlan0 remove_network $i; done
        wpa_cli -iwlan0 add_network
        wpa_cli -iwlan0 set_network 0 auth_alg OPEN
        wpa_cli -iwlan0 set_network 0 key_mgmt NONE
        wpa_cli -iwlan0 set_network 0 mode 0
        wpa_cli -iwlan0 set_network 0 ssid '$line'
	wpa_cli -iwlan0 select_network 0                                        
        wpa_cli -iwlan0 enable_network 0                                        
        wpa_cli -iwlan0 reassociate                                             
	sleep 20
	wpa_cli iwlan0 status
	./wifi.sh
	sleep 5
done < "$input"   
                                                                         
./reboot.sh                                                                                

