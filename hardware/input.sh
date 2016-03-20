for i in {3..8}
do
        configure_edison --wifi  <<EOF
        $i 
Y
EOF
        set contains = "false"
        set yes = "true"
        #awk '~ /password/ { contains = "true" }' file
        if [$contains -eq $yes]
        then
                continue
        else
                echo "all good"
        fi
done
echo DONE DONE DONE
