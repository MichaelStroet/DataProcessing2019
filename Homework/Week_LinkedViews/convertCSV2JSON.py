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
OUTPUT_JSON = "data.json"

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
        speaker = values[1]
        tags = ast.literal_eval(values[2])
        title = values[3]
        link = values[4]

        talk_info = [speaker, title, link]

        for tag in tags:
            dict[tag].append([timestamp, talk_info])

    return dict


def preprocess_data(df):
    '''
    Preprocesses the data into a dictionary of timestamps per tag
    '''

    # get all unique tags from the dataframe as a list
    tags = get_tags(df)

    # Creates a dictionary of timestamps per tag
    tag_dict = make_tagdict(df, tags)

    return tag_dict


def unix_to_date(timestamp):
    '''
    Convert a unix timestamp to a date
    '''
    return datetime.utcfromtimestamp(timestamp).strftime("%Y-%m-%d")


def prepare_data(data):
    '''
    Creates a dictionary for the amount of talks per tag (barchart)
    and for the amount of talks per day per tag (calendar)
    '''
    bar_dict = {}
    calendar_dict = {}

    for tag in data:

        talks = data[tag]

        # Create a list with all timestamps of talks with this tag
        timestamps = []
        for talk in talks:
            timestamps.append(talk[0])

        # Add the number of talks to the bar dictionary
        bar_dict[tag] = len(timestamps)

        # Prepare a dictionary for the number of talks and their information per day
        days_dict = {}
        for talk in talks:
            timestamp = talk[0]
            info = talk[1]

            day = unix_to_date(timestamp)

            if not day in days_dict:
                days_dict[day] = {}
                days_dict[day]["talks"] = 1
                days_dict[day]["info"] = [info]

            else:
                days_dict[day]["talks"] += 1
                days_dict[day]["info"].append(info)

        # Add the days dictionary to the calendar dictionary under the given tag
        calendar_dict[tag] = days_dict

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
    tag_dict = preprocess_data(data_df)

    # Convert the data into a useful dictionary
    data_dict = prepare_data(tag_dict)

    # Save the data as a json file
    save_json(data_dict)
