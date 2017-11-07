# THIRD...  # NOQA
#  https://www.govtrack.us/data/photos/400021-100px.jpeg

# imports
from bs4 import BeautifulSoup
import datetime
import json
import pprint
import re
import requests


pp = pprint.PrettyPrinter(indent=4)

pp.pprint("<-- RUNNING get-bills.py -->")

apiKey = "eab8794360f64272b36d7721e6b15464"

# startYear = 1998
# # Get date
now = datetime.datetime.now()
# #get year from date
currentYear = now.year
# numberOfYears = currentYear - startYear

# earliest year of data on opensecrets.org
startYear = 2016
stopYear = currentYear + 1

# get the list of gun organizations from a seperate file
with open('gunOrgSpending.json') as data_file:
    orgData = json.load(data_file)
    # We're not going to use the "years" data here
    orgData.pop("spending", None)

sponsorsRaw = []


# for each year
for year in range(startYear, stopYear):
    pp.pprint("################################")
    pp.pprint("Looking in  "+str(year))

    # holds all the bill names
    billsRaw = []
    bills = {}

    sponsors = []

    # for each side in each year
    for side in orgData:

        if side == "Q12":
            currentSide = "Gun Control"
        else:
            currentSide = "Gun Rights"

        pp.pprint("- "+side)

        # for each org
        for org in orgData[side]:

            thisOrgID = org["id"]
            thisOrgName = org["name"]

            pp.pprint("- - "+thisOrgID)

            # url
            url = '{}lobby/clientbills.php?id={}&year={}'.format(
                'http://www.opensecrets.org/',
                thisOrgID,
                str(year),
            )
            pp.pprint(url)
            # requests
            url_r = requests.get(url)
            # run the requests through soup
            url_soup = BeautifulSoup(url_r.content, "html.parser")
            # get the table with id industry_summary
            bill_table = url_soup.find("table", {"id": "client_bills"})

            if bill_table:

                bill_rows = bill_table.findAll('tr')
                # get number of table rows in this case
                numberOfTr = len(bill_rows)
                pp.pprint("number of bills: "+str(numberOfTr))

                # for each row:
                for i in range(1, numberOfTr):

                    # find each of the <td>
                    tds = bill_rows[i].findAll("td")

                    # parse out the id from the string
                    rawHREF = bill_rows[i].find("a")['href']
                    href1 = rawHREF.split('?id=')
                    # href2 = href1[1].split('-')

                    # bill's ID
                    billNumber = href1[1]

                    # prevent duplicate entries
                    # if this bill is NOT in the list of bills
                    if billNumber not in billsRaw:
                        # create a bills object to hold details
                        bills[billNumber] = {}

                        # add it to tracking array used for checking duplicates
                        billsRaw.append(billNumber)

                        # bill's congress
                        billCongressNumber = tds[1].text.rstrip()
                        # pp.pprint("billCongressNumber: "+billCongressNumber)

                        # pp.pprint(billNumber)
                        billNumberArray = billNumber.split("-")
                        getNumber = filter(
                            str.isdigit,
                            str(billNumberArray[0])
                        )

                        pr = ""

                        if billNumber[:7] == "hconres":
                            pr = "hconres"
                        elif billNumber[:7] == "sconres":
                            pr = "sconres"
                        elif billNumber[:5] == "hjres":
                            pr = "hjres"
                        elif billNumber[:5] == "sjres":
                            pr = "sjres"
                        elif billNumber[:4] == "sres":
                            pr = "sres"
                        elif billNumber[:4] == "hres":
                            pr = "hres"
                        elif billNumber[:2] == "hr":
                            pr = "hr"
                        elif billNumber[:1] == "s":
                            pr = "s"
                            chamber = "senate"
                        else:
                            pp.pprint("EXCEPTION: "+billNumber)

                        if pr[:1] == "h":
                            chamber = "house"

                        # https://www.govtrack.us/data/congress/106/bills/
                        # hr/hr2366/data.json
                        # https://www.congress.gov/bill/106th-congress/
                        # senate-bill/353/all-info

                        # pp.pprint(billNumber)

                        billN, sep, tail = billNumber.partition('-')

                        # pp.pprint(
                        #     "https://www.govtrack.us/data/congress/" +
                        #     billCongressNumber +
                        #     "/bills/" + pr + "/" + billN + "/data.json"
                        # );

                        billResponse = requests.get(
                            '{}data/congress/{}/bills/{}/{}/data.json'.format(
                                'https://www.govtrack.us/',
                                billCongressNumber,
                                pr,
                                billN,
                            )
                        )
                        data = billResponse.json()

                        # Get sponsor info here in case govtrack fails

                        statusArray = []

                        try:
                            url = '{}bill/{}th-congress/{}-bill/{}/{}'.format(
                                'https://www.congress.gov/',
                                billCongressNumber,
                                chamber,
                                getNumber,
                                'all-info'
                            )
                            # requests
                            url_r = requests.get(url)
                            # run the requests through soup
                            url_soup = BeautifulSoup(
                                url_r.content,
                                "html.parser"
                            )
                            overview = url_soup.find(
                                "div",
                                {"class": "overview"}
                            )

                            # Start working our sponsor details
                            sponsor = overview.a.contents[0]
                            # link to sponsor's page
                            sponsorURL = overview.a['href']
                            # pp.pprint("--------> Sponsor: "+sponsor)
                            # Words array where we'll pull first, last,
                            # title etc...
                            words = re.findall(r"[\w']+", sponsor)

                            # base for getting at party and state
                            start = "["
                            end = "]"
                            representing = (
                                sponsor.split(start)
                            )[1].split(end)[0]
                            representing = representing.split("-")

                            # get status
                            status = overview.find(
                                "ol",
                                {"class": "bill_progress"}
                            )

                            del statusArray[:]

                            for lis in status.find_all(
                                "li",
                                {"class": ["first", "passed", "selected"]}
                            ):
                                test = lis.find(text=True, recursive=False)
                                # pp.pprint(test)
                                statusArray.append(test)

                            # pp.pprint(statusArray)
                        except Exception:
                            pass

                        # append sponsor ID to list for use in retrieving
                        # sponsor info
                        # sponsorsRaw.append(data["sponsor"]["bioguide_id"])
                        # pp.pprint(
                        #     "bioguide_id: "+data["sponsor"]["bioguide_id"]
                        # )

                        # pp.pprint(
                        #     'https://congress.api.sunlightfoundation.com/+
                        #     'legislators?thomas_id="' +
                        #     data["sponsor"]["thomas_id"]+'&apikey='+apiKey
                        # )


                        # sponsorResponse = requests.get(
                        #     '{}legislators?thomas_id={}&apikey={}'.format(
                        #         'http://congress.api.sunlightfoundation.com/',
                        #         data["sponsor"]["thomas_id"],
                        #         apiKey
                        #     ), verify=False
                        # )
                        # sponsorData = sponsorResponse.json()
                        #
                        # sponsorObj = {}
                        # try:
                        #     sponsorObj["govtrack_id"] = sponsorData[
                        #         "results"
                        #     ][0]["govtrack_id"]
                        #     # pp.pprint(sponsorObj["govtrack_id"])
                        # except Exception:
                        #     pass
                        #
                        # try:
                        #     sponsorObj["first_name"] = sponsorData[
                        #         "results"
                        #     ][0]["first_name"]
                        # except Exception:
                        #     sponsorObj["first_name"] = words[2]
                        #     pass
                        #
                        # try:
                        #     sponsorObj["last_name"] = sponsorData[
                        #         "results"
                        #     ][0]["last_name"]
                        # except Exception:
                        #     sponsorObj["last_name"] = words[1]
                        #     pass
                        #
                        # try:
                        #     sponsorObj["chamber"] = sponsorData[
                        #         "results"
                        #     ][0]["chamber"]
                        # except Exception:
                        #     pass
                        #
                        # try:
                        #     sponsorObj["in_office"] = sponsorData[
                        #         "results"
                        #     ][0]["in_office"]
                        # except Exception:
                        #     pass
                        #
                        # try:
                        #     sponsorObj["party"] = sponsorData[
                        #         "results"
                        #     ][0]["party"]
                        # except Exception:
                        #     sponsorObj["party"] = representing[0]
                        #     pass
                        #
                        # try:
                        #     sponsorObj["state"] = sponsorData[
                        #         "results"
                        #     ][0]["state"]
                        # except Exception:
                        #     sponsorObj["state"] = representing[1]
                        #     pass
                        #
                        # try:
                        #     sponsorObj["state_name"] = sponsorData[
                        #         "results"
                        #     ][0]["state_name"]
                        # except Exception:
                        #     pass
                        #
                        # try:
                        #     sponsorObj["title"] = sponsorData[
                        #         "results"
                        #     ][0]["title"]
                        # except Exception:
                        #     sponsorObj["title"] = words[0]
                        #     pass
                        #
                        # try:
                        #     sponsorObj["facebook_id"] = sponsorData[
                        #         "results"
                        #     ][0]["facebook_id"]
                        # except Exception:
                        #     pass
                        #
                        # try:
                        #     sponsorObj["twitter_id"] = sponsorData[
                        #         "results"
                        #     ][0]["twitter_id"]
                        # except Exception:
                        #     pass
                        #
                        # try:
                        #     sponsorObj["website"] = sponsorData["results"][0][
                        #         "website"
                        #     ]
                        # except Exception:
                        #     pass
                        #
                        # try:
                        #     sponsorObj["youtube_id"] = sponsorData[
                        #         "results"
                        #     ][0]["youtube_id"]
                        # except Exception:
                        #     pass
                        #
                        # bills[billNumber]["sponsor"] = sponsorObj

                        # Nomenclature: "H.R. 4066"
                        bills[billNumber]["number"] = data["bill_id"]
                        # The bill's type:  "H.R., S., H.J.Res. etc."
                        bills[billNumber]["type"] = data["bill_type"]
                        # The current status of the bill

                        # bills[billNumber]["actions"] = []

                        # for i in range(len(data["actions"])):
                        #     billActions = {}
                        #     actionDate = data["actions"][i]["acted_at"]
                        #     actionDescription = data["actions"][i]["text"]
                        #     billActions["date"] = actionDate
                        #     billActions["description"] = actionDescription
                        # bills[billNumber]["actions"].append(billActions);

                        # for cosponsor in data["cosponsors"]:
                        #    sponsors.append(cosponsor["bioguide_id"])

                        # bills[billNumber]["cosponsors"] = data["cosponsors"]
                        # The date the bill was introduced.
                        bills[billNumber]["introduced"] = data["introduced_at"]
                        bills[billNumber]["official-title"] = data[
                            "official_title"
                        ]
                        bills[billNumber]["short-title"] = data["short_title"]
                        # bills[billNumber]["sponsor"] = data["sponsor"]
                        # sponsors.append(data["sponsor"]["bioguide_id"])
                        bills[billNumber]["status"] = statusArray
                        bills[billNumber]["status-at"] = data["status_at"]
                        # bills[billNumber]["subjects"] = data["subjects"]
                        bills[billNumber]["subjects-top-term"] = data[
                            "subjects_top_term"
                        ]
                        bills[billNumber]["title"] = data["titles"][0]["title"]
                        try:
                            bills[billNumber]["purpose"] = data["titles"][1][
                                "title"
                            ]
                        except Exception:
                            bills[billNumber]["purpose"] = data["titles"][0][
                                "title"
                            ]

                        # Initialize lobbied element
                        bills[billNumber]["lobbied"] = []
                        # Initialize organization who lobbied this bill
                        bills[billNumber]["lobbied"].append(thisOrgName)

                    else:
                        # Append organizations who also lobbied this bill
                        bills[billNumber]["lobbied"].append(thisOrgName)

pp.pprint("Prepare to write")

# pp.pprint("Before: "+str(len(sponsors)))
# sponsors = set(sponsors)
# pp.pprint("After: "+str(len(sponsors)))

# convert the dictionary to json and write it to the file
# declare files, w+ create if don't exist
# pp.pprint("/var/www/html/dallasnews/guns/gunBills" + str(year) + ".json")
# j = open("/var/www/html/dallasnews/guns/gunBills" + str(year) + ".json", "w+")
j = open("gunBills" + str(year) + ".json", "w+")

# minified
json.dump(bills, j, sort_keys=True, separators=(',', ':'))

# prettified
# json.dump(bills, j, sort_keys=True, indent=4)
j.close()
