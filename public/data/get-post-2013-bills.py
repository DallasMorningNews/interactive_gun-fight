#-------------------------------------------------------------------------------
# THIRD...
#
#
#
#-------------------------------------------------------------------------------

#imports
import requests
from bs4 import BeautifulSoup
import re
import pprint
import json
import urllib
import datetime
from collections import OrderedDict

pp = pprint.PrettyPrinter(indent=4)

pp.pprint("<-- RUNNING getPriorBillsInfo.py -->")

#earliest year of data on opensecrets.org
startYear = 2015

# startYear = 1998
# # Get date
now = datetime.datetime.now()
# #get year from date
currentYear = now.year
# numberOfYears = currentYear - startYear

# get the list of gun organizations from a seperate file
with open('gunOrgSpending.json') as data_file:
    orgData = json.load(data_file)
    #We're not going to use the "years" data here
    orgData.pop("spending", None)

sponsorsRaw = []

# for each year
for year in range(startYear,currentYear):
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

        pp.pprint("- "+side)

        #for each org
        for org in orgData[side]:

            thisOrgID = org["id"]
            thisOrgName = org["name"]

            pp.pprint("- - "+thisOrgID)

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
                pp.pprint("number of bills: "+str(numberOfTr))

                #for each row:
                for i in range(1,numberOfTr):

                    #find each of the <td>
                    tds = bill_rows[i].findAll("td")

                    #parse out the id from the string
                    rawHREF = bill_rows[i].find("a")['href']
                    href1 = rawHREF.split('?id=')
                    #href2 = href1[1].split('-')

                    #bill's ID
                    billNumber = href1[1]
                    pp.pprint(billNumber)

                    #prevent duplicate entries
                    #if this bill is NOT in the list of bills
                    if billNumber not in billsRaw:

                        # create a bills object to hold details
                        bills[billNumber] = {}

                        # add it to tracking array used for checking duplicates
                        billsRaw.append(billNumber)

                        # bill's congress
                        billCongressNumber = tds[1].text.rstrip()

                        #https://www.govtrack.us/api/v2/bill?congress=106&q=hr2366-106
                        response = requests.get("https://www.govtrack.us/api/v2/bill?&q="+billNumber)
                        data = response.json()

                        pp.pprint(data)
                        pp.pprint("   "+data["objects"][0]["display_number"]+ "("+billCongressNumber+")")

                        # append sponsor ID to list for use in retrieving sponsor info
                        sponsorsRaw.append(data["objects"][0]["sponsor"]["id"])

                        # explanation from https://www.govtrack.us/developers/api

                        # The bill's type:  "H.R., S., H.J.Res. etc."
                        bills[billNumber]["type"] = data["objects"][0]["bill_type"]
                        # The current status of the bill
                        bills[billNumber]["status"] = data["objects"][0]["current_status"]
                        # Nomenclature: "H.R. 4066"
                        bills[billNumber]["number"] = data["objects"][0]["display_number"]
                        # Whether the bill was introduced in the current session of Congress and the bill's status is not a final status (i.e. can take no more action like a failed vote).
                        bills[billNumber]["alive"] = data["objects"][0]["is_alive"]
                        # Whether the bill was introduced in the current session of Congress.
                        bills[billNumber]["current"] = data["objects"][0]["is_current"]
                        # Sponsor's GovTrack ID
                        bills[billNumber]["sponsorID"] = data["objects"][0]["sponsor"]["id"]
                        # The date the bill was introduced.
                        bills[billNumber]["introduced"] = data["objects"][0]["introduced_date"]
                        # Display name of bill: "Small Business Liability Reform bill"
                        bills[billNumber]["name"] = data["objects"][0]["titles"][0][2]
                        # Description of purpose of bill
                        try:
                            bills[billNumber]["purpose"] = data["objects"][0]["titles"][1][2]
                        except IndexError:
                            bills[billNumber]["purpose"] = "null"
                        # Major actions that have taken place with bill
                        try:
                            bills[billNumber]["actions"] = data["objects"][0]["major_actions"]
                        except IndexError:
                            bills[billNumber]["actions"] = "null"

                        # Which congress looked at it
                        bills[billNumber]["congress"] = billCongressNumber
                        # Year lobbied
                        bills[billNumber]["year"] = year
                        # Initialize lobbied element
                        bills[billNumber]["lobbied"] = []
                        # Initialize organization who lobbied this bill
                        bills[billNumber]["lobbied"].append(thisOrgName)

                    else:
                        # Append organizations who also lobbied this bill
                        bills[billNumber]["lobbied"].append(thisOrgName)

    #convert the dictionary to json and write it to the file
    #declare files, w+ create if don't exist
    j = open( "gunBills" +str(year)+ ".json","w+")

    #minified
    #json.dump(data, j, sort_keys=True, separators=(',',':'))

    #prettified
    json.dump(bills, j, sort_keys=True, indent=4)
    j.close()

d = {}
for sponsor in sponsorsRaw:
    d[sponsor] = None
sponsors = d.keys()

j = open( "gunSponsorsList.json","w+")
json.dump(sponsors, j, sort_keys=True, separators=(',',':'))
j.close()
