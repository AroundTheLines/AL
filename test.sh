currentwifi=$(iwconfig 2>&1 | grep ESSID)
nowwifi=$(iwconfig 2>&1 | grep ESSID)
echo $currentwifi
while [[ $currentwifi == *"$nowwifi"* ]]
do
sleep 5
nowwifi=$(iwconfig 2>&1 | grep ESSID)
echo 'loop'
done
echo 'you have been disconnected from the current wifi.'

