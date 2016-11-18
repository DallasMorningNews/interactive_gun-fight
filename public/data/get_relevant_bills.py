# THIRD...  # NOQA
#  https://www.govtrack.us/data/photos/400021-100px.jpeg

# imports
from bs4 import BeautifulSoup
import datetime
import json
import pprint
import requests


pp = pprint.PrettyPrinter(indent=4)


def get_all_relevant_bills(year):
    pp.pprint("<-- RUNNING get-bills.py -->")

    # get the list of gun organizations from a seperate file
    with open('./public/data/gunOrgSpending.json') as data_file:
        orgData = json.load(data_file)

        # We're not going to use the "years" data here
        orgData.pop("spending", None)

    pp.pprint("################################")
    pp.pprint("Looking in  " + str(year))

    # holds all the bill names
    billsRaw = []
    bills = {}

    # for each side in each year
    for side in orgData:
        # if side == "Q12":
        #     currentSide = "Gun Control"
        # else:
        #     currentSide = "Gun Rights"

        pp.pprint("- " + side)

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
                        # add it to tracking array used for
                        # checking duplicates
                        billsRaw.append(billNumber)

                        # bill's congress
                        billCongressNumber = tds[1].text.rstrip()
                        # pp.pprint(
                        #     "billCongressNumber: "+billCongressNumber
                        # )

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

                        billN = billNumber.partition('-')[0]

                        bills[billNumber] = {
                            'bill_number': billNumber,
                            'billN': billN,
                            'pr': pr,
                            'billCongressNumber': billCongressNumber,
                            'chamber': chamber,
                            'getNumber': getNumber,
                            'lobbied': [thisOrgName],
                        }
                    else:
                        bills[billNumber]['lobbied'].append(thisOrgName)

    # with open('./public/data/allRelevantBills.json', 'w+') as bills_output:
    #     json.dump(
    #         [v for k, v in bills.items()],
    #         bills_output,
    #         sort_keys=True,
    #         separators=(',', ':'),
    #         indent=4
    #     )

    return [v for k, v in bills.items()]
