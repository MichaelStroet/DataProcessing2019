# Name: Michael Stroet
# Student number: 11293284
"""
This script counts the number of games in each catagory
"""

import json
import pandas as pd

from convertCSV2JSON import OUTPUT_JSON as INPUT_JSON, WANTED_DATA

# Global constants for in and out put files
OUTPUT_JSON = "games.json"

def open_json():
    '''
    Opens a json file and returns a pandas dataframe
    '''
    df = pd.read_json(INPUT_JSON)

    return(df)


def save_json(df):
    '''
    Output a JSON file of the pandas dataframe
    '''
    # Convert the dataframe to a json string
    data_json = df.to_json(orient = 'values')

    with open(OUTPUT_JSON, 'w') as outfile:
        outfile.write(data_json)

def count_games(df):
    '''
    Output a JSON file of the pandas dataframe
    '''
    # Convert the dataframe to a json string
    data_json = df.to_json(orient = 'values')

    with open(OUTPUT_JSON, 'w') as outfile:
        outfile.write(data_json)

if __name__ == "__main__":

    # Open the csv and convert it to a pandas dataframe object
    data_df = open_json()

    # Counts the games in each catagory
    games_df = count_games(data_df)

    # Save the data as a json file
    save_json(games_df)
