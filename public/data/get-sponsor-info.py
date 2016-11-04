#-------------------------------------------------------------------------------
# FOURTH...
# USING THE LIST OF SPONSOR IDS GENERATED IN getPriorBillsInfo, GO OUT AND GET
# THE DETAILS OF EACH SPONSOR AND SAVE TO gunSponsors.json
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

pp.pprint("<-- RUNNING get-sonsor-info.py -->")

# get the list of gun organizations from a seperate file
with open('gunSponsorsList.json') as data_file:
    sponsors = json.load(data_file)

billSponsors = {}
billSponsors["billSponsors"] = []

for sponsor in sponsors:
    pp.pprint(sponsor)

    thisSponsor = {}
    thisSponsor[sponsor] = {}
    #https://www.govtrack.us/api/v2/person/400054
    response = requests.get("https://www.govtrack.us/api/v2/person/"+str(sponsor))
    data = response.json()

    thisSponsor[sponsor]["title"] = data["roles"][-1]["title"]
    thisSponsor[sponsor]["first"] = data["firstname"]
    thisSponsor[sponsor]["last"] = data["lastname"]

    #for bioguide images
    thisSponsor[sponsor]["bioguideID"] = data["bioguideid"]

    try:
        thisSponsor[sponsor]["state"] = data["roles"][-1]["state"]
    except IndexError:
        thisSponsor[sponsor]["state"] = "null"
    try:
        thisSponsor[sponsor]["party"] = data["roles"][-1]["party"]
    except IndexError:
        thisSponsor[sponsor]["party"] = "null"
    try:
        thisSponsor[sponsor]["start"] = data["roles"][-1]["startdate"]
    except IndexError:
        thisSponsor[sponsor]["start"] = "null"
    try:
        thisSponsor[sponsor]["end"] = data["roles"][-1]["enddate"]
    except IndexError:
        thisSponsor[sponsor]["end"] = "null"

    thisSponsor[sponsor]["twitter"] = data["twitterid"]
    thisSponsor[sponsor]["youtube"] = data["youtubeid"]

    billSponsors["billSponsors"].append(thisSponsor)

j = open( "gunSponsors.json","w+")
json.dump(billSponsors, j, sort_keys=True, indent=4)
#json.dump(billSponsors, j, sort_keys=True, separators=(',',':'))
j.close()
