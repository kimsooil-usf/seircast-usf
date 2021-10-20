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

URL = 'http://localhost:8000/covid/api/simulations/'
BASE_API_URL = 'http://localhost:8000/'
TOKEN = 'users/api/token/'
STATE_COUNTIES = 'model/api/v1/get_states_counties/'
META = 'meta/'

# URL = 'https://54e020a9c6bd.ngrok.io/covid/api/simulations/'
# BASE_API_URL = 'https://54e020a9c6bd.ngrok.io/'
# TOKEN = 'users/api/token/'
# STATE_COUNTIES = 'model/api/v1/get_states_counties/'
# META = 'meta/'



# client id and secret should be moved?
token_payload = {
    "username": sys.argv[1],
    "password": sys.argv[2],
    "client_id": "EP6leZzF7EUH7FH5OzC7xaYTNPB582S7waJuED4x",
    "client_secret": "jmSMOfIogonb4PpSvw7fHCgjxJP0Re27yMmz0jhwJUXIQlq0JMMqVSb0QfbijBsYc2FOx2lzXToHNEYe7Sl83RalHoxUN890Rok3WZE0p2p5yXEdxi9bf6xFHYl84Dn1",
    "grant_type": "password"
}

# token_payload = {
#     "username": sys.argv[1],
#     "password": sys.argv[2],
#     "client_id": "I0SNc3fphJDVgDuPavWb1W1vdsBcWZTS7oGeBT2x",
#     "client_secret": "04bPfrPMCLmGuIfmH4FrPbPxZjlEMXuisvW1X2M9lFraZp9ZT2srgUR7LFcTGUjpbwn0IkTdDLM7JD1PWKmEwKCsZYmLNMDzsMO4j1B2fudDWHs76v8ziXdX3yeFDKO9",
#     "grant_type": "password"
# }

# Sleep for 12.5 seconds to be at 288 jobs launched in 1 hour.
sleep_time = 3
max_jobs = 1

# model defaults
country = "US"
sim_length = "60"
nDraws = "50000"

#locations
states = ['Florida', 'Indiana', 'Georgia', 'Illinois', 'Ohio', 'Texas', 'Arizona', 'Missouri', 'Kentucky', 'Tennessee','Iowa','California','Alabama','Michigan', 'Pennsylvania', 'Minnesota', 'Wisconsin', 'Mississippi']

#state dictionary of information
state_dict = {
'Florida': {
    #'counties': ['Hillsborough,Pasco,Pinellas,Polk', \
    #    'Alachua,Baker,Bay,Bradford,Brevard,Broward,Calhoun,Charlotte,Citrus,Clay,Collier,Columbia,DeSoto,Dixie,Duval,Escambia,Flagler,Franklin,Gadsden,Gilchrist,Glades,Gulf,Hamilton,Hardee,Hendry,Hernando,Highlands,Hillsborough,Holmes,Indian River,Jackson,Jefferson,Lafayette,Lake,Lee,Leon,Levy,Liberty,Madison,Manatee,Marion,Martin,Miami-Dade,Monroe,Nassau,Okaloosa,Okeechobee,Orange,Osceola,Palm Beach,Pasco,Pinellas,Polk,Putnam,St. Johns,St. Lucie,Santa Rosa,Sarasota,Seminole,Sumter,Suwannee,Taylor,Union,Volusia,Wakulla,Walton,Washington'],
    'counties': ['Hillsborough,Pasco,Pinellas,Polk'],
    'shelter_date': "2020-03-27",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Indiana':{
    'counties': ["St. Joseph"],
    'shelter_date': "2020-03-23",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Georgia':{
    'counties': ['Cherokee,Clayton,Cobb,DeKalb,Douglas,Fayette,Fulton,Gwinnett,Henry,Rockdale'],
    'shelter_date': "2020-04-03",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Illinois':{
    'counties': ['Cook,DeKalb,DuPage,Grundy,Kane,Kankakee,Kendall,McHenry,Will'],
    'shelter_date': "2020-03-21",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Ohio':{
    'counties': ['Cuyahoga,Geauga,Lake,Lorain,Medina'],
    'shelter_date': "2020-03-23",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Texas':{
    'counties': ['Austin,Brazoria,Chambers,Fort Bend,Galveston,Harris,Liberty,Montgomery,Waller'],
    'shelter_date': "2020-04-02",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Arizona':{
    'counties': ['Maricopa'],
    'shelter_date': "2020-03-31",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Missouri':{
    'counties': ['Franklin,Jefferson,Lincoln,St. Charles,St. Louis City,St. Louis,Warren'],
    'shelter_date': "2020-04-06",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Kentucky':{
    'counties': ['Bullitt,Hardin,Henry,Jefferson,Meade,Nelson,Oldham,Shelby,Spencer,Trimble'],
    'shelter_date': "2020-03-26",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Tennessee':{
    'counties': ['Cannon,Cheatham,Davidson,Dickson,Hickman,Macon,Maury,Robertson,Rutherford,Smith,Sumner,Trousdale,Williamson,Wilson'],
    'shelter_date': "2020-03-31",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Iowa':{
    'counties': ['Polk'],
    'shelter_date': "2020-03-17",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'California':{
    'counties': ['Los Angeles'],
    'shelter_date': "2020-03-19",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Alabama':{
    'counties': ['Bibb,Blount,Chilton,Jefferson,St. Clair,Shelby,Walker'],
    'shelter_date': "2020-04-04",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Michigan':{
    'counties': ['Lapeer,Livingston,Macomb,Oakland,St. Clair,Wayne'],
    'shelter_date': "2020-03-24",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Pennsylvania':{
    'counties': ['Bucks,Chester,Delaware,Montgomery,Philadelphia'],
    'shelter_date': "2020-04-01",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Minnesota':{
    'counties': ['Hennepin'],
    'shelter_date': "2020-03-27",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Wisconsin':{
    'counties': ['Dane'],
    'shelter_date': "2020-03-25",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
'Mississippi':{
    'counties': ['Hinds'],
    'shelter_date': "2020-04-03",
    'shelter_release_start_date': "2020-05-04",
    'shelter_release_end_date': "2020-06-15",
    'social_distancings': ['false'],
    'social_distancing_end_date': "2020-06-15",
    'quarantine_percents': [0],
    'quarantine_start_date': "2020-08-01"
    },
#'Louisiana':{
#    'counties': ['Baton Rouge'],
#    'shelter_date': "2020-03-23",
#    'shelter_release_start_date': "2020-05-04",
#    'shelter_release_end_date': "2020-06-15",
#    'social_distancings': ['false'],
#    'social_distancing_end_date': "2020-06-15",
#    'quarantine_percents': [0],
#    'quarantine_start_date': "2020-08-01"
#    }
}

#extensions to options
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
    #print(r.json())
    #time.sleep(0.25)

    if r.status_code == 201:
        print(jobs, state, r.status_code)

        jobs += 1
        time.sleep(sleep_time)

        if jobs >= max_jobs:
            print('Done for now...')
            sys.exit()
    elif r.status_code == 200 and not r.json()['model_output']:
        print('Exit for now...')
        sys.exit()
    elif r.status_code == 500:
        print('500....')
        print(r.json())
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
        #time.sleep(0.25)

        if r.status_code == 201:
            print(jobs, state, r.status_code)

            jobs += 1
            time.sleep(sleep_time)

            if jobs >= max_jobs:
                print('Done for now...')
                sys.exit()
        elif r.status_code == 200 and not r.json()['model_output']:
            print('Exit for now...')
            sys.exit()
        elif r.status_code == 500:
            print('500....')
            print(r.json())
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
                #time.sleep(0.25)

                if r.status_code == 201:
                    print(jobs, state, r.status_code)

                    jobs += 1
                    time.sleep(sleep_time)

                    if jobs >= max_jobs:
                        print('Done for now...')
                        sys.exit()
                elif r.status_code == 200 and not r.json()['model_output']:
                    print('Exit for now...')
                    sys.exit()
                elif r.status_code == 500:
                    print('500....')
                    print(r.json())
                    sys.exit()
