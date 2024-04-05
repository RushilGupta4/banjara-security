import json


with open("users.json", "r") as f:
    list_a = json.load(f)

with open("usersFinal.json", "r") as f:
    list_b = json.load(f)

modified_elems_in_b = []

for elem in list_b:
    if elem not in list_a:
        modified_elems_in_b.append(elem)

print(modified_elems_in_b)
print(len(modified_elems_in_b))

with open("modifiedUsers.json", "w") as f:
    json.dump(modified_elems_in_b, f, indent=4)
