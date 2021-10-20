#! /usr/bin/python
# python to submit compiled Matlab script to CRC cluster
# Chris Sweet, 04/23/20
# University of Notre Dame, Center for Research Computing
# call from root folder, python utilities/run_model.py
import os
import os.path
import sys
import json
import hashlib
import time
import csv
import requests

# Import state/settings data.
# from . import states
# from . import settings
import states
import settings

# Set the base URLs and endpoints.
URL = settings.URL
BASE_API_URL = settings.BASE_API_URL
TOKEN = settings.TOKEN
STATE_COUNTIES = settings.STATE_COUNTIES
META = settings.META

# Server access.
token_payload = {
    "username": sys.argv[1],
    "password": sys.argv[2],
    "client_id": settings.CLIENT_ID,
    "client_secret": settings.CLIENT_SECRET,
    "grant_type": "password"
}

# Time to pause before launching the next job.
sleep_time = settings.SLEEP_TIME

# Maximum number of jobs to launch in an hour.
max_jobs = settings.MAX_JOBS

# Model defaults.
country = "US"
sim_length = "60"
nDraws = "50000"

# State dictionary of information.
state_dict = states.state_dict

# Locations.
states = state_dict.keys()

# Extensions to options.
all_social_distancings = ['true', 'false']
all_quarantine_percents = [0, 25, 50, 75]

# Get the token for use when making requests.
try:
    r = requests.post(
        BASE_API_URL+TOKEN,
        json=token_payload
    )
    r.raise_for_status()
except Exception:
    print("Error attempting to get token.")
    sys.exit()

headers = {"Authorization": "Bearer " + str(r.json().get("access_token"))}

# Get the state counties...
try:
    r = requests.get(
        BASE_API_URL+STATE_COUNTIES
    )
    r.raise_for_status()
    state_counties = r.json()
except Exception:
    print("Error attempting to get counties.")
    sys.exit()

#print model defaults
print("Defaults set to", country, sim_length, nDraws)

#counter
sim_count = 0

# Keep track of number of jobs launched in this run. Only increment for status code 201 (created - i.e. new job).
jobs = 1

print('Running default landing page jobs...')
for state in states:
    # Get the counties.
    counties = []
    counties.extend(state_dict[state]['counties'][0].split(','))
    counties = list(set(counties))
    counties.sort()

    payload = {
        "country": country,
        "state": state,
        "county": counties,
        'nDraws': nDraws,
        'sim_length': sim_length,
        'quarantine_percent': str(state_dict[state]['quarantine_percents'][0]),
        'shelter_date': state_dict[state]['shelter_date'],
        'shelter_release_start_date': state_dict[state]['shelter_release_start_date'],
        'shelter_release_end_date': state_dict[state]['shelter_release_end_date'],
        'social_distancing': state_dict[state]['social_distancings'][0],
        'social_distancing_end_date': state_dict[state]['social_distancing_end_date'],
        'quarantine_start_date': state_dict[state]['quarantine_start_date'],
        "lockdown_strength": "0.5",
        "social_distancing_strength": "0.5"
    }

    r = requests.post(URL, headers=headers, json={'model_input': payload})
    print(state, r.status_code)

    if r.status_code == 201:
        print(jobs, state, r.status_code)

        jobs += 1
        time.sleep(sleep_time)

        if jobs >= max_jobs:
            print('Done for now...')
            sys.exit()


print('Running single values for the map...')
for state in states:
    for county in state_counties['counties'][state]:
        payload = {
            "country": country,
            "state": state,
            "county": [county],
            'nDraws': nDraws,
            'sim_length': sim_length,
            'quarantine_percent': str(state_dict[state]['quarantine_percents'][0]),
            'shelter_date': state_dict[state]['shelter_date'],
            'shelter_release_start_date': state_dict[state]['shelter_release_start_date'],
            'shelter_release_end_date': state_dict[state]['shelter_release_end_date'],
            'social_distancing': state_dict[state]['social_distancings'][0],
            'social_distancing_end_date': state_dict[state]['social_distancing_end_date'],
            'quarantine_start_date': state_dict[state]['quarantine_start_date'],
            "lockdown_strength": "0.5",
            "social_distancing_strength": "0.5"
        }

        r = requests.post(URL, headers=headers, json={'model_input': payload})
        print(state, r.status_code)

        if r.status_code == 201:
            print(jobs, state, r.status_code)

            jobs += 1
            time.sleep(sleep_time)

            if jobs >= max_jobs:
                print('Done for now...')
                sys.exit()


# Running the rest of the jobs.
print('Running the rest of the jobs...')
for state in states:
    jobs += 1

    print(jobs, state)

    #get counties in data
    # counties = get_covid_19_data_counties(state)
    counties = []

    #grab additional multi-county simulations
    counties.extend(state_dict[state]['counties'])

    #get uniques
    counties = list(set(counties))

    #sort
    counties.sort()

    #loop through counties to create jobs
    for county in counties: #state_dict[state]['counties']:

        #get the social_distancings to be simulated
        social_distancings = state_dict[state]['social_distancings'][:]

        #default counties?
        if county in state_dict[state]['counties']:
            #grab additional multi-county simulations
            social_distancings.extend(all_social_distancings)

            #get uniques
            social_distancings = list(set(social_distancings))

        #social_distancing array?
        for social_distancing in social_distancings:

            #get the quarantine_percents to be simulated
            quarantine_percents = state_dict[state]['quarantine_percents'][:]

            #default counties? Then add all options
            if county in state_dict[state]['counties']:

                #grab additional multi-county simulations
                quarantine_percents.extend(all_quarantine_percents)

                #get uniques
                quarantine_percents = list(set(quarantine_percents))

            #quarantine_percent?
            for quarantine_percent in quarantine_percents:
                payload = {
                    'country': country,
                    'state': state,
                    'county': county.split(','),
                    'nDraws': nDraws,
                    'quarantine_percent': str(quarantine_percent),
                    'sim_length': sim_length,
                    'shelter_date': state_dict[state]['shelter_date'],
                    'shelter_release_start_date': state_dict[state]['shelter_release_start_date'],
                    'shelter_release_end_date': state_dict[state]['shelter_release_end_date'],
                    'social_distancing': social_distancing,
                    'social_distancing_end_date': state_dict[state]['social_distancing_end_date'],
                    'quarantine_start_date': state_dict[state]['quarantine_start_date'],
                    "lockdown_strength": "0.5",
                    "social_distancing_strength": "0.5",
                }

                r = requests.post(URL, headers=headers, json={'model_input': payload})
                print(state, r.status_code)

                if r.status_code == 201:
                    print(jobs, state, r.status_code)

                    jobs += 1
                    time.sleep(sleep_time)

                    if jobs >= max_jobs:
                        print('Done for now...')
                        sys.exit()
