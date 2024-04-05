import json
import math
import random
import pandas as pd
from pprint import pprint

excel_file = pd.ExcelFile("sheet.xlsx")
sheets = excel_file.sheet_names

main_cols = {
    "Team Name": "team",
    "Candidate's Name": "name",
    "Candidate's Email": "email",
    "Candidate's Mobile": "phone",
    "Candidate's Organisation": "college",
    "competition": "competition",
}

competitions_to_days = {
    "Footloose": [1, 2],
    "Dance Off": [1, 2],
    "Battle of the Bands": [1, 2],
    "Concordia": [1, 2],
    "Nautanki": [1, 2],
    "Mukhauta": [1, 2],
    "Rahageer": [1, 2],
    "Symphony of Suspicion": [1, 2],
    "Ashoka Parliamentary Debate": [1, 2],
    "Trashionista": [1, 2],
    "Aaina": [1, 2],
    "In-quiz-itive": [1, 2],
    "Marketing 101": [1, 2],
    "FIFA": [1, 2],
    "Starstruck": [1, 2],
    "Samadhan": [1, 2],
    "Barrier Barrage": [1, 2],
    "Food Fiesta": [1, 2],
    "Attendee Day 1": [1],
    "Attendee Day 2": [2],
    "Attendee Both Days": [1, 2],
    "Space Turtle": [1, 2],
}

sheet_name_mapping = {
    "ADU": "Ashoka Parliamentary Debate",
    "Mukhauta": "Mukhauta",
    "Nautanki": "Nautanki",
    "samadhan": "Samadhan",
    "Concordia": "Concordia",
    "BoB": "Battle of the Bands",
    "Trashionista": "Trashionista",
    "Starstruck": "Starstruck",
    "FIFA": "FIFA",
    "Marketing 101": "Marketing 101",
    "In-Quiz-itive": "In-quiz-itive",
    "Symphony of Suspicion": "Symphony of Suspicion",
    "Rahageer": "Rahageer",
    "Aaina": "Aaina",
    "Food Fiesta": "Food Fiesta",
    "Footloose": "Footloose",
    "Barrier Barrage": "Barrier Barrage",
    "Attendee Day 1": "Attendee Day 1",
    "Attendee Day 2": "Attendee Day 2",
    "Attendee Both Days": "Attendee Both Days",
    "space turtle": "Space Turtle",
}

with open("users copy.json", "r") as f:
    existing_users = json.load(f)


def get_uid_from_email(email):
    for user in existing_users:
        if user["email"] == email:
            return user["uid"]
    return None


dfs = []
for sheet in sheets:
    if sheet not in sheet_name_mapping:
        continue

    print(sheet)

    df = pd.read_excel(excel_file, sheet_name=sheet)
    df["competition"] = sheet_name_mapping[sheet]
    df = df[list(main_cols.keys())]
    df = df.rename(columns=main_cols)

    # df.dropna(subset=["name"], inplace=True)
    df["email"] = df["email"].apply(str).str.strip().str.lower()
    df["name"] = df["name"].apply(
        lambda x: " ".join([i.capitalize() for i in x.strip().split()])
    )

    df["phone"] = (
        df["phone"]
        .apply(str)
        .str.replace(" ", "")
        .fillna(0)
        .replace("nan", 0)
        .apply(float)
        .apply(int)
        .apply(str)
        .str.strip()
    )
    for i in range(len(df)):
        b_phone = df.loc[i, "phone"]
        phone = df.loc[i, "phone"]

        if phone == "0":
            df.loc[i, "phone"] = "NA"
            continue

        if len(phone) == 10:
            continue

        if phone.startswith("91"):
            phone = phone[2:]

        if phone.startswith("0"):
            phone = phone[1:]

        if phone.startswith("+91"):
            phone = phone[3:]

        phone = phone.strip()

        if len(phone) != 10:
            name = df.loc[i, "name"]
            phone = "NA"
            comp = df.loc[i, "competition"]
            print("Invalid phone number", b_phone, name, comp)

        df.loc[i, "phone"] = phone

    dfs.append(df)

df = pd.concat(dfs)

emails = df["email"].unique().tolist()

print(len(df))
print(len(emails))
# quit()

users = []
colleges = []

j = 0

for email in emails:
    if email == "aryanchopra5427@gmail.com":
        continue

    if not isinstance(email, str):
        if math.isnan(email):
            continue

    email_df = df[df["email"] == email]

    same_name = email_df["name"].nunique() <= 1
    same_phone = email_df["phone"].nunique() <= 1
    same_college = email_df["college"].nunique() <= 1

    # take most common value
    name = email_df["name"].mode().values[0]
    phone = email_df["phone"].mode().values[0]

    try:
        b_college = email_df["college"].mode().values[0]
        college = email_df["college"].mode().values[0]
    except:
        college = "NA"
        # print("ERROR: College not found for", email)
        # print(email_df)
        j += 1

    try:
        team = email_df["team"].mode().values[0]
    except:
        team = "None"

    competitions = email_df["competition"].unique().tolist()
    days = []
    for comp in competitions:
        days += competitions_to_days[comp]

    days = list(set(days))

    duplicated_number = not df[(df["phone"] == phone) & (df["email"] != email)].empty

    for i in ["Attendee Day 1", "Attendee Day 2", "Attendee Both Days"]:
        if i in competitions:
            competitions.remove(i)

    uid = get_uid_from_email(email)
    user = {
        "uid": uid,
        "name": name,
        "college": college,
        "email": email,
        "phone": phone,
        "gateStatus": False,
        "registered": False,
        "competitions": competitions,
        "attendingDays": days,
        "timestamps": [],
        "team": team,
        "paymentDay1": 1 in days,
        "paymentDay2": 2 in days,
        "repeatedNumber": duplicated_number,
    }

    users.append(user)

    if not same_name or not same_phone:
        pprint(email_df.to_records())

    assert same_name and same_phone
    # assert same_name and same_phone and same_college


# What we do not have: Dance off
with open("usersFinal.json", "w") as f:
    json.dump(users, f, indent=4)

print()

print(j)
