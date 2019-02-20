#!/usr/bin/env python
# Name: Michael Stroet
# Student number: 11293284
"""
This script sanitises data obtained from a .csv file, visualises several columns
and saves the sanitised data as a csv and a json file
"""

import csv
import json
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from statistics import mean, mode, median

# Global constants for the in- and output files
INPUT_CSV = "input.csv"
OUTPUT_JSON = "output.json"

# List of required columns from the input csv
WANTED_DATA = ["Country", "Region", "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)", "GDP ($ per capita) dollars"]


def preprocess_data():
    """
    Sanitises the data in the dataframe object
    """

    # Removes all leading and trailing spaces from the 'Country' and 'Region' columns
    for col in [0,1]:
        data_df[WANTED_DATA[col]] = data_df[WANTED_DATA[col]].str.strip(" ")

    # Removes all " dollars" from the 'GDP' column
    data_df[WANTED_DATA[4]] = data_df[WANTED_DATA[4]].str.replace(" dollars", "")

    # Sanitises the columns 'Pop. Density', 'Infant mortality' and 'GDP'
    for col in range(2, len(WANTED_DATA)):
        # Replaces all ',' with '.'
        data_df[WANTED_DATA[col]] = data_df[WANTED_DATA[col]].str.replace(",", ".")

        # Replaces all data not containing any numeric values [0-9] or a '.' with numpy's NaN
        missing_data = data_df[WANTED_DATA[col]].str.contains(r'[^\d.]')
        data_df[WANTED_DATA[col]] = np.where(missing_data, np.nan, data_df[WANTED_DATA[col]])

        # Sets all strings to floats
        data_df[WANTED_DATA[col]] = pd.to_numeric(data_df[WANTED_DATA[col]])

    # Sets the 'Country' column as the index for the dataframe
    data_df.set_index(WANTED_DATA[0], inplace=True)


def save_json(dataframe):
    """
    Output a JSON file containing all data ordered by country.
    """
    # Convert the dataframe to a json string ordered by country
    data_json = dataframe.to_json(orient = 'index')

    with open(OUTPUT_JSON, 'w') as outfile:
        outfile.write(data_json)


def remove_nan(nanlist):
    '''
    Removes all Null/NaN/None/'' elements from a list.
    '''
    return([element for element in nanlist if ~np.isnan(element)])


def subplot_hist_GDP(data, ax):
    """
    Plots the data as a histogram in a subplot with axes object 'ax'.
    """

    ax.hist(data, bins = 50, color = 'royalblue')
    ax.axvline(mean(data), color = 'crimson', linestyle = 'dashed', dashes = [3,6], label = 'mean')
    ax.axvline(mode(data), color = 'darkgreen', linestyle = 'dashed', dashes = [3,6], label = 'mode')
    ax.axvline(median(data), color = 'darkorange', linestyle = 'dashed', dashes = [3,6], label = 'median')

    ax.set_ylabel("Number of countries")

    ax.grid(axis = "x")
    ax.legend(loc = "upper right")


def subplot_box_GDP(data, ax):
    """
    Plots the data as a boxplot in a subplot with axes object 'ax'.
    """

    ax.boxplot(data, vert = False)
    ax.axvline(mean(data), color = 'crimson', linestyle = 'dashed', dashes = [3,6], label = 'mean')
    ax.axvline(mode(data), color = 'darkgreen', linestyle = 'dashed', dashes = [3,6], label = 'mode')
    ax.axvline(median(data), color = 'darkorange', linestyle = 'dashed', dashes = [3,6], label = 'median')

    ax.set_ylim(0.8, 1.2)
    ax.set_yticks([0])

    ax.set_xlabel("GDP per capita ($)")

    ax.grid(axis = "x")


def plot_GDP(data, figure):
    '''
    Visualises the GDP per capita data
    '''
    # Defines the figure with 4 subplots (2x2) and a fixed size in inches
    fig, axs = plt.subplots(nrows=2, ncols=2, num = figure, figsize = (14, 10))

    fig.suptitle(f"GDP per capita of {len(data)} countries in US dollars")

    # Subplot top left: histogram
    ax = axs[0][0]
    ax.set_title("All countries")
    subplot_hist_GDP(data, ax)

    # Subplot bottom left: boxplot
    ax = axs[1][0]
    subplot_box_GDP(data, ax)

    # Remove the highest value from the list (Suriname: $400,000)
    data.remove(max(data))

    # Subplot top right: histogram
    ax = axs[0][1]
    ax.set_title("Excluding $400,000 Suriname")
    subplot_hist_GDP(data, ax)

    # Subplot bottom right: boxplot
    ax = axs[1][1]
    subplot_box_GDP(data, ax)


def plot_infant(data, figure):
    '''
    Visualises the infant mortality data
    '''

    plt.figure(figure, figsize = (6, 5))

    plt.boxplot(data)

    plt.xlim(0.8, 1.2)
    plt.xticks([0])

    plt.ylabel("Deaths per 1000 births")
    plt.title(f"Infant mortality in {len(data)} countries")


if __name__ == "__main__":

    # Add all wanted columns of data from the input csv to a pandas DataFrame object
    data_df = pd.read_csv(INPUT_CSV, usecols = WANTED_DATA)

    # Sanitise the dataframe
    preprocess_data()

    # Save the data as a json file
    save_json(data_df)

    # Convert the "GDP ($ per capita) dollars" column to a list
    GDP_data = remove_nan(data_df[WANTED_DATA[4]].tolist())
    #Information about the GDP per capita data
    GDP_info = data_df[WANTED_DATA[4]].describe()

    print("Central tendency of the GDP per capita data")
    print(f"Mean     : ${GDP_info['mean']}")
    print(f"Mode     : ${mode(GDP_data)}")
    print(f"Median   : ${GDP_info['50%']}")
    print(f"Std. dev.: ${GDP_info['std']}")
    print()

    # Visualise the GDP data
    plot_GDP(GDP_data, "GDP per capita")

    # Convert the "Infant mortality (per 1000 births)" column to a list
    infant_data = remove_nan(data_df[WANTED_DATA[3]].tolist())
    # Information about the infant mortality data
    infant_info = data_df[WANTED_DATA[3]].describe()

    print("Five Number Summary of the infant mortality (in deaths per 1000 births) data")
    print(f"Minimum       : {infant_info['min']}")
    print(f"First quartile: {infant_info['25%']}")
    print(f"Median        : {infant_info['50%']}")
    print(f"Third quartile: {infant_info['75%']}")
    print(f"Maximum       : {infant_info['max']}")
    print()

    # Visualise the infant mortality data
    plot_infant(infant_data, "Infant mortality")

    plt.show()
