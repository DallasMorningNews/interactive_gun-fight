# FIRST...  # NOQA
# GET LIST OF ALL GUN CONTROL AND GUN RIGHTS GROUPS
# GET ANNUAL SPENDING FOR EACH GROUP AND SAVE ALL TO gunOrgSpending.json

# imports

from bs4 import BeautifulSoup
import datetime
import json
import pprint
import requests

pp = pprint.PrettyPrinter(indent=4)

# gun control/rights id
gunControlID = "Q12"
gunRightsID = "Q13"
categoryIDs = [gunControlID, gunRightsID]

# define initial object
data = {}
data["gunControlGroups"] = []
data["gunRightsGroups"] = []
data["spending"] = []


# earliest year of data on opensecrets.org
startYear = 2000

# Get date
now = datetime.datetime.now()
# get year from date
currentYear = now.year
numberOfYears = currentYear - startYear

# holds all the org names
orgsRaw = []

for category in categoryIDs:
    # give us real names instead of Q12 and Q13
    if (category == "Q12"):
        thisCategory = "gunControl"
    else:
        thisCategory = "gunRights"

    pp.pprint("In " + thisCategory)

    thisGroup = {}

    thisGroup[thisCategory] = {}

    for year in range(startYear, currentYear + 1):
        pp.pprint("      For year "+str(year))
        # url + year
        url = '{}lobby/indusclient.php?id={}&year={}'.format(
            'http://www.opensecrets.org/',
            category,
            str(year)
        )
        # requests
        url_r = requests.get(url)
        # run the requests through soup
        url_soup = BeautifulSoup(url_r.content, "html.parser")
        # get the table with id industry_summary
        org_table = url_soup.find("table", {
            "id": "industry_summary"
        })
        org_rows = org_table.findAll('tr')
        # get number of table rows in this case
        numberOfTr = len(org_rows)

        # set year object
        thisGroup[thisCategory][year] = []

        # for each row
        for i in range(1, numberOfTr):
            # set an empty object to hold each organization
            idGroup = {}
            expendituresGroup = {}

            # find each of the <td>
            tds = org_rows[i].findAll("td")
            # parse out the id from the string
            rawHREF = org_rows[i].find("a")['href']
            href1 = rawHREF.split('?id=')
            href2 = href1[1].split('&year')

            # org ID
            orgID = href2[0].replace(" ", "")
            # org name
            orgName = tds[0].text.rstrip()
            # org spending
            orgExpenditures = tds[1].text.rstrip().replace("$", "")

            expendituresGroup["id"] = orgID
            expendituresGroup["name"] = orgName
            expendituresGroup["expenditures"] = orgExpenditures.replace(
                ",",
                ""
            )

            thisGroup[thisCategory][year].append(expendituresGroup)

            # pp.pprint("           With "+orgName+" at $"+orgExpenditures)

            # prevent duplicate entries
            # if this org is NOT in the list of orgs
            if orgName not in orgsRaw:
                # add it to the comparison list
                orgsRaw.append(orgName)

                # set the object
                idGroup["id"] = orgID
                idGroup["name"] = orgName

                # insert the object depending on their side
                if category == gunControlID:
                    data["gunControlGroups"].append(idGroup)
                if category == gunRightsID:
                    data["gunRightsGroups"].append(idGroup)

    data["spending"].append(thisGroup)

# convert the dictionary to json and write it to the file
# declare files, w+ create if don't exist
j = open("gunOrgSpending.json", "w+")

# minified
json.dump(data, j, sort_keys=True, separators=(',', ':'))

# prettified
json.dump(data, j, sort_keys=True, indent=4)

j.close()
