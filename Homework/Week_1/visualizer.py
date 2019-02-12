#!/usr/bin/env python
# Name: Michael Stroet
# Student number: 11293284
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

def readcsv():
    """
    Opens the csv file and adds the required data to the data dictionary
    """

    with open(INPUT_CSV, newline = '') as csvfile:
        next(csvfile)
        csvdata = csv.reader(csvfile)

        for row in csvdata:
            title = row[0]
            year = row[2]

            data_dict[year].append(title)


if __name__ == "__main__":

    # Open the csv file and append data to the data dictionary
    readcsv()

    xdata = []
    ydata = []
    for key in data_dict:
        xdata.append(key)
        ydata.append(len(data_dict[key]))

    plt.plot(xdata,ydata)
    plt.xaxis("test")
    plt.show()
