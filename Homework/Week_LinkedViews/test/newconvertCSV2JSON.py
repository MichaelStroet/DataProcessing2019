# Name: Michael Stroet
# Student number: 11293284
"""
This script converts a csv file into a JSON file
"""

import ast
import json
import numpy as np
import pandas as pd
from datetime import datetime

# Global constants for in and out put files and the required columns
INPUT_CSV = "ted_main.csv"    # Source: https://www.kaggle.com/rounakbanik/ted-talks
OUTPUT_JSON = "newdata.json"

WANTED_DATA = ["film_date", "main_speaker", "tags", "title", "url"]

def open_csv():
    '''
    Opens a csv file and returns a pandas dataframe
    '''
    df = pd.read_csv(INPUT_CSV, usecols = WANTED_DATA)
    return(df)


def get_tags(df):
    '''
    Returns all unique tags in the dataframe in a list
    '''

    # Create a list of the tags of each talk
    talk_tags = []
    for talk in df[WANTED_DATA[2]]:
        talk_tags.append(ast.literal_eval(talk))

    # Create a list of all unique tags in talk_tags
    unique_tags = []
    for tags in talk_tags:
        for tag in tags:
            if not tag in unique_tags:
                unique_tags.append(tag)

    return unique_tags


def make_tagdict(df, unique_tags):
    '''
    Creates a dictionary of timestamps per tag
    '''

    dict = {}
    for tag in unique_tags:
        dict[tag] = []

    for talk in df.iterrows():

        index, values = talk

        timestamp = values[0]
        tags = ast.literal_eval(values[2])

        for tag in tags:
            dict[tag].append(timestamp)

    return dict


def preprocess_data(df):
    '''
    Preprocesses the data into a dictionary of timestamps per tag
    '''

    # get all unique tags from the dataframe as a list
    tags = get_tags(df)

    # Creates a dictionary of timestamps per tag
    tagdict = make_tagdict(df, tags)

    return(tagdict)


def unix_to_date(timestamp):
    '''
    Convert a unix timestamp to a date
    '''
    return datetime.utcfromtimestamp(timestamp).strftime("%Y-%m-%d")


def get_days(timestamps):

    days = []

    for timestamp in timestamps:
        day = unix_to_date(timestamp)
        if not day in days:
            days.append(day)

    return days


def prepare_data(data):
    '''
    Creates a dictionary for the amount of talks per tag (barchart)
    and for the amount of talks per day per tag (calendar)
    '''

    bar_dict = {}
    calendar_dict = {}

    for tag in data:

        timestamps = data[tag]

        # Add the number of talks to the bar dictionary
        bar_dict[tag] = len(timestamps)

        days = get_days(timestamps)

        tag_dict = {}
        for day in days:
            tag_dict[day] = {}
            tag_dict[day]["talks"] = 0
            tag_dict[day]["links"] = []

        for timestamp in timestamps:
            day = unix_to_date(timestamp)
            if day in tag_dict:
                tag_dict[day]["talks"] += 1
                tag_dict[day]["links"].append(["speaker", "title", "link"])

            else:
                exit("Error: Day of timestamp not found in days")

        # Add the number of talks per day to the calendar dictionary
        # with the speakers, titles and links of talks per tag per day
        calendar_dict[tag] = tag_dict

    return {"barchart" : bar_dict, "calendar" : calendar_dict}


def save_json(dict):
    '''
    Output a JSON file of the given dictionary
    '''
    # Convert the dictionary to a json string
    data_json = json.dumps(dict)

    with open(OUTPUT_JSON, 'w') as outfile:
        outfile.write(data_json)


if __name__ == "__main__":

    # Open the csv and convert it to a pandas dataframe object
    data_df = open_csv()

    # Preprocess the dataframe to a dictionary of timestamps per tag
    processed_data = preprocess_data(data_df)

    # Convert the data into a useful dictionary
    data_dict = prepare_data(processed_data)

    # Save the data as a json file
    save_json(data_dict)
