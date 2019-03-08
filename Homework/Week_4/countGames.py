# Name: Michael Stroet
# Student number: 11293284
"""
This script counts the number of games supported by each platform
"""

import json
import pandas as pd
from convertCSV2JSON import OUTPUT_JSON as INPUT_JSON

# Global constant for the output file
OUTPUT_JSON = "games.json"

def open_json():
    '''
    Opens a json file and returns a pandas dataframe
    '''
    df = pd.read_json(INPUT_JSON)

    return(df)


def save_json(counts):
    '''
    Output a JSON file of the given list
    '''
    # Convert the list to a json string
    data_json = json.dumps(counts)

    with open(OUTPUT_JSON, 'w') as outfile:
        outfile.write(data_json)


def count_games(df):
    '''
    Output a JSON file of the pandas dataframe
    '''

    platforms = df.index.tolist()
    games_lists = df.values.tolist()
    counts = []

    # Counts the total amount of supported games per platform
    for platform, games in zip(platforms, games_lists):
        games_counter = 0

        for game_supports in games:
            if game_supports:
                games_counter += 1

        # Save the counts for all platforms as an array of dictionaries
        count_dict = {"platform" : platform, "games" : games_counter}
        counts.append(count_dict)

    return counts


if __name__ == "__main__":

    # Open the json and convert it to a pandas dataframe object
    data_df = open_json()

    # Counts the games for each platform
    game_counts = count_games(data_df)

    # Save the data as a json file
    save_json(game_counts)
