# Name: Michael Stroet
# Student number: 11293284
"""
This script will do something !!!!
"""

import ast
import json
import time
import numpy as np
import pandas as pd

# Global constants for in and out put files and the required columns
INPUT_CSV = "ted_main.csv"    # Source: https://www.kaggle.com/rounakbanik/ted-talks
OUTPUT_JSON = "data.json"

WANTED_DATA = ["film_date", "tags"]

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
    for talk in df[WANTED_DATA[1]]:
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
    Creates a dictionary of talk timestamps for each tag
    '''

    dict = {}
    for tag in unique_tags:
        dict[tag] = {"talks": "", "timestamps": []}

    for talk in df.iterrows():

        index, values = talk

        timestamp = values[0]
        tags = ast.literal_eval(values[1])

        for tag in tags:
            dict[tag]["timestamps"].append(timestamp)

        for tag in dict:
            talks = len(dict[tag]["timestamps"])
            dict[tag]["talks"] = talks
            
    return dict


def preprocess_data(df):
    '''
    Prepares the data in the dataframe object for visualisation
    '''

    # get all unique tags from the dataframe as a list
    tags = get_tags(df)

    tagdict = make_tagdict(df, tags)

    return(tagdict)


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

    # Preprocess the dataframe
    data_dict = preprocess_data(data_df)

    # Save the data as a json file
    save_json(data_dict)
