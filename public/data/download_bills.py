import json  # NOQA
import os

from get_formatted_bill import format_bill
from get_relevant_bills import get_all_relevant_bills


def download_all_bills(year):
    relevant_bills = get_all_relevant_bills(year)

    bills_for_year = [format_bill(bill) for bill in relevant_bills]

    return bills_for_year


def concatenate_bills_for_year(year, year_bills):
    all_year_bills = {}
    for bill_file in year_bills:
        bill_number = os.path.splitext(os.path.basename(bill_file))[0]
        with open(bill_file, 'r') as bill_description:
            bill_json = json.load(bill_description)
            all_year_bills[bill_number] = bill_json

    concat_filename = './public/data/finalized/{}.json'.format(year)
    concat_filename_minified = './public/data/finalized/{}.min.json'.format(
        year
    )

    with open(concat_filename, 'w') as concat_file:
        with open(concat_filename_minified, 'w') as concat_file_min:
            json.dump(
                all_year_bills,
                concat_file,
                sort_keys=True,
                separators=(',', ':'),
                indent=4
            )
            json.dump(
                all_year_bills,
                concat_file_min,
                sort_keys=True,
                separators=(',', ':')
            )

    return concat_filename, concat_filename_minified
