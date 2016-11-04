#imports
import requests
from bs4 import BeautifulSoup
import re
import pprint
import json
import datetime

pp = pprint.PrettyPrinter(indent=4)

pp.pprint("<-- RUNNING getBills.py -->")

#earliest year of data on opensecrets.org
#startYear = 1998
startYear = 1998
# Get date
now = datetime.datetime.now()
#get year from date
currentYear = 2012
numberOfYears = currentYear - startYear

data = {}
data["years"] = []
years = {}

with open('gunOrgSpending.json') as data_file:
    orgData = json.load(data_file)
    #We're not going to use the "years" data here
    orgData.pop("spending", None)

pp.pprint(orgData)

# for each year
for year in range(startYear,currentYear+1):
    pp.pprint("Looking in  "+str(year))

    #holds all the bill names
    billsRaw = []
    bills = {}

    #for each side in each year
    for side in orgData:

        if side == "Q12":
            currentSide = "Gun Control"
        else:
            currentSide = "Gun Rights"

        pp.pprint("-"+side)

        #for each org
        for org in orgData[side]:

            thisOrgID = org["id"]
            thisOrgName = org["name"]

            pp.pprint("- - "+thisOrgName)

            #url
            url = "http://www.opensecrets.org/lobby/clientbills.php?id="+thisOrgID+"&year="+str(year)
            #requests
            url_r = requests.get(url)
            #run the requests through soup
            url_soup = BeautifulSoup(url_r.content, "html.parser")
            #get the table with id industry_summary
            bill_table = url_soup.find("table",{"id":"client_bills"})

            if bill_table:

                bill_rows = bill_table.findAll('tr')
                #get number of table rows in this case
                numberOfTr = len(bill_rows)

                #for each row:
                for i in range(1,numberOfTr):

                    #find each of the <td>
                    tds = bill_rows[i].findAll("td")

                    #get every bill's title
                    billTitle = tds[2].text

                    #parse out the id from the string
                    rawHREF = bill_rows[i].find("a")['href']
                    href1 = rawHREF.split('?id=')
                    #href2 = href1[1].split('-')

                    #bill's ID
                    billNumber = href1[1]

                    #
                    # DO NOT EMPTY IN EACH ITERATION
                    # WE NEED TO CREATE IT AND SAVE IT FOR ALL LOOPS
                    #

                    #prevent duplicate entries
                    #if this bill is NOT in the list of bills
                    if billNumber not in billsRaw:

                        # pp.pprint("- - - "+billNumber)
                        #
                        # #create a bills object to hold details
                        bills[billNumber] = {}
                        #
                        # bills[billNumber]["lobbied"] = []
                        #
                        # # add it
                        billsRaw.append(billNumber)
                        #
                        # # bill's congress
                        billCongressNumber = tds[1].text.rstrip()
                        #
                        #get every bill's display title
                        billDisplayTitle = tds[0].text.rstrip()

                        bills[billNumber]["displayTitle"] = billDisplayTitle
                        bills[billNumber]["congress"] = billCongressNumber
                        bills[billNumber]["title"] = billTitle
                        bills[billNumber]["year"] = year
                        bills[billNumber]["lobbied"] = []
                        bills[billNumber]["lobbied"].append(thisOrgName)
                        # pp.pprint("- - - - "+thisOrgName)

                    else:
                        pp.pprint("* * * * * "+thisOrgName)
                        bills[billNumber]["lobbied"].append(thisOrgName)
    #convert the dictionary to json and write it to the file
    #declare files, w+ create if don't exist
    j = open( "gunBills" +str(year)+ ".json","w+")

    #minified
    #json.dump(data, j, sort_keys=True, separators=(',',':'))

    #prettified
    json.dump(bills, j, sort_keys=True, indent=4)
#j.close()
