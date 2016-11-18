from bs4 import BeautifulSoup  # NOQA
import json
import re
import requests


apiKey = "eab8794360f64272b36d7721e6b15464"


def format_bill(raw_bill):
    billResponse = requests.get(
        '{}data/congress/{}/bills/{}/{}/data.json'.format(
            'https://www.govtrack.us/',
            raw_bill['billCongressNumber'],
            raw_bill['pr'],
            raw_bill['billN'],
        )
    )
    data = billResponse.json()

    # Get sponsor info here in case govtrack fails

    statusArray = []

    try:
        url = '{}bill/{}th-congress/{}-bill/{}/{}'.format(
            'https://www.congress.gov/',
            raw_bill['billCongressNumber'],
            raw_bill['chamber'],
            raw_bill['getNumber'],
            'all-info'
        )
        # requests
        url_r = requests.get(url)
        # run the requests through soup
        url_soup = BeautifulSoup(url_r.content, "html.parser")
        overview = url_soup.find("div", {"class": "overview"})

        # Start working our sponsor details
        sponsor = overview.a.contents[0]
        # link to sponsor's page
        # sponsorURL = overview.a['href']
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
    sponsorResponse = requests.get(
        '{}legislators?thomas_id={}&apikey={}'.format(
            'http://congress.api.sunlightfoundation.com/',
            data["sponsor"]["thomas_id"],
            apiKey
        ), verify=False
    )
    sponsorData = sponsorResponse.json()

    sponsorObj = {}

    if len(sponsorData["results"]) > 0:
        sponsorResult = sponsorData['results'][0]
        try:
            sponsorObj["govtrack_id"] = sponsorResult["govtrack_id"]
            # pp.pprint(sponsorObj["govtrack_id"])
        except Exception:
            pass

        try:
            sponsorObj["first_name"] = sponsorResult["first_name"]
        except Exception:
            sponsorObj["first_name"] = words[2]
            pass

        try:
            sponsorObj["last_name"] = sponsorResult["last_name"]
        except Exception:
            sponsorObj["last_name"] = words[1]
            pass

        try:
            sponsorObj["chamber"] = sponsorResult["chamber"]
        except Exception:
            pass

        try:
            sponsorObj["in_office"] = sponsorResult["in_office"]
        except Exception:
            pass

        try:
            sponsorObj["party"] = sponsorResult["party"]
        except Exception:
            sponsorObj["party"] = representing[0]
            pass

        try:
            sponsorObj["state"] = sponsorResult["state"]
        except Exception:
            sponsorObj["state"] = representing[1]
            pass

        try:
            sponsorObj["state_name"] = sponsorResult["state_name"]
        except Exception:
            pass

        try:
            sponsorObj["title"] = sponsorResult["title"]
        except Exception:
            sponsorObj["title"] = words[0]
            pass

        try:
            sponsorObj["facebook_id"] = sponsorResult["facebook_id"]
        except Exception:
            pass

        try:
            sponsorObj["twitter_id"] = sponsorResult["twitter_id"]
        except Exception:
            pass

        try:
            sponsorObj["website"] = sponsorResult["website"]
        except Exception:
            pass

        try:
            sponsorObj["youtube_id"] = sponsorResult["youtube_id"]
        except Exception:
            pass

    formatted_bill = {}

    formatted_bill["sponsor"] = sponsorObj

    # Nomenclature: "H.R. 4066"
    formatted_bill["number"] = data["bill_id"]
    # The bill's type:  "H.R., S., H.J.Res. etc."
    formatted_bill["type"] = data["bill_type"]
    # The current status of the bill

    # formatted_bill["actions"] = []

    # for i in range(len(data["actions"])):
    #     billActions = {}
    #     actionDate = data["actions"][i]["acted_at"]
    #     actionDescription = data["actions"][i]["text"]
    #     billActions["date"] = actionDate
    #     billActions["description"] = actionDescription
    # formatted_bill["actions"].append(billActions);

    # for cosponsor in data["cosponsors"]:
    #    sponsors.append(cosponsor["bioguide_id"])

    # formatted_bill["cosponsors"] = data["cosponsors"]
    # The date the bill was introduced.
    formatted_bill["introduced"] = data["introduced_at"]
    formatted_bill["official-title"] = data["official_title"]
    formatted_bill["short-title"] = data["short_title"]
    # formatted_bill["sponsor"] = data["sponsor"]
    # sponsors.append(data["sponsor"]["bioguide_id"])
    formatted_bill["status"] = statusArray
    formatted_bill["status-at"] = data["status_at"]
    # formatted_bill["subjects"] = data["subjects"]
    formatted_bill["subjects-top-term"] = data["subjects_top_term"]
    formatted_bill["title"] = data["titles"][0]["title"]

    try:
        formatted_bill["purpose"] = data["titles"][1]["title"]
    except Exception:
        formatted_bill["purpose"] = data["titles"][0]["title"]

    formatted_bill['lobbied'] = raw_bill['lobbied']

    bill_filename = './public/data/bill-reports/{}.json'.format(
        raw_bill['bill_number']
    )

    with open(bill_filename, 'w+') as bill_output:
        json.dump(
            formatted_bill,
            bill_output,
            sort_keys=True,
            separators=(',', ':'),
            indent=4
        )

    return bill_filename
