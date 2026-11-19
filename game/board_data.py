"""
Richup.io 1-1 Board Data and Card Definitions
"""

BOARD_TILES = [
    # Bottom Row (0 to 10): 0 is GO (bottom-right), moving left to 10 (Jail, bottom-left)
    {
        "id": 0,
        "name": "GO",
        "type": "go",
        "description": "Collect $200 salary as you pass",
        "price": 0
    },
    {
        "id": 1,
        "name": "Thessaloniki",
        "alt_name": "Mediterranean Ave",
        "country": "Greece",
        "country_code": "GR",
        "flag": "🇬🇷",
        "type": "property",
        "group": "brown",
        "price": 60,
        "rent": [2, 10, 30, 90, 160, 250],
        "house_cost": 50,
        "mortgage": 30
    },
    {
        "id": 2,
        "name": "Community Chest",
        "type": "chest",
        "description": "Draw a Community Chest card"
    },
    {
        "id": 3,
        "name": "Athens",
        "alt_name": "Baltic Ave",
        "country": "Greece",
        "country_code": "GR",
        "flag": "🇬🇷",
        "type": "property",
        "group": "brown",
        "price": 60,
        "rent": [4, 20, 60, 180, 320, 450],
        "house_cost": 50,
        "mortgage": 30
    },
    {
        "id": 4,
        "name": "Income Tax",
        "type": "tax",
        "tax_amount": 200,
        "description": "Pay $200 Tax"
    },
    {
        "id": 5,
        "name": "South Station",
        "alt_name": "Reading Railroad",
        "country": "Transit",
        "country_code": "TR",
        "flag": "🚂",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 6,
        "name": "Mumbai",
        "alt_name": "Oriental Ave",
        "country": "India",
        "country_code": "IN",
        "flag": "🇮🇳",
        "type": "property",
        "group": "lightblue",
        "price": 100,
        "rent": [6, 30, 90, 270, 400, 550],
        "house_cost": 50,
        "mortgage": 50
    },
    {
        "id": 7,
        "name": "Chance",
        "type": "chance",
        "description": "Draw a Chance card"
    },
    {
        "id": 8,
        "name": "Delhi",
        "alt_name": "Vermont Ave",
        "country": "India",
        "country_code": "IN",
        "flag": "🇮🇳",
        "type": "property",
        "group": "lightblue",
        "price": 100,
        "rent": [6, 30, 90, 270, 400, 550],
        "house_cost": 50,
        "mortgage": 50
    },
    {
        "id": 9,
        "name": "Bangalore",
        "alt_name": "Connecticut Ave",
        "country": "India",
        "country_code": "IN",
        "flag": "🇮🇳",
        "type": "property",
        "group": "lightblue",
        "price": 120,
        "rent": [8, 40, 100, 300, 450, 600],
        "house_cost": 50,
        "mortgage": 60
    },
    {
        "id": 10,
        "name": "Jail / Visiting",
        "type": "jail",
        "description": "Just visiting or in Jail"
    },

    # Left Row (11 to 20): moving up to 20 (Free Parking, top-left)
    {
        "id": 11,
        "name": "Munich",
        "alt_name": "St. Charles Place",
        "country": "Germany",
        "country_code": "DE",
        "flag": "🇩🇪",
        "type": "property",
        "group": "pink",
        "price": 140,
        "rent": [10, 50, 150, 450, 625, 750],
        "house_cost": 100,
        "mortgage": 70
    },
    {
        "id": 12,
        "name": "Electric Utility",
        "alt_name": "Electric Company",
        "country": "Utility",
        "country_code": "UT",
        "flag": "⚡",
        "type": "utility",
        "group": "utility",
        "price": 150,
        "mortgage": 75
    },
    {
        "id": 13,
        "name": "Frankfurt",
        "alt_name": "States Ave",
        "country": "Germany",
        "country_code": "DE",
        "flag": "🇩🇪",
        "type": "property",
        "group": "pink",
        "price": 140,
        "rent": [10, 50, 150, 450, 625, 750],
        "house_cost": 100,
        "mortgage": 70
    },
    {
        "id": 14,
        "name": "Berlin",
        "alt_name": "Virginia Ave",
        "country": "Germany",
        "country_code": "DE",
        "flag": "🇩🇪",
        "type": "property",
        "group": "pink",
        "price": 160,
        "rent": [12, 60, 180, 500, 700, 900],
        "house_cost": 100,
        "mortgage": 80
    },
    {
        "id": 15,
        "name": "West Station",
        "alt_name": "Pennsylvania RR",
        "country": "Transit",
        "country_code": "TR",
        "flag": "🚂",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 16,
        "name": "Florence",
        "alt_name": "St. James Place",
        "country": "Italy",
        "country_code": "IT",
        "flag": "🇮🇹",
        "type": "property",
        "group": "orange",
        "price": 180,
        "rent": [14, 70, 200, 550, 750, 950],
        "house_cost": 100,
        "mortgage": 90
    },
    {
        "id": 17,
        "name": "Community Chest",
        "type": "chest",
        "description": "Draw a Community Chest card"
    },
    {
        "id": 18,
        "name": "Rome",
        "alt_name": "Tennessee Ave",
        "country": "Italy",
        "country_code": "IT",
        "flag": "🇮🇹",
        "type": "property",
        "group": "orange",
        "price": 180,
        "rent": [14, 70, 200, 550, 750, 950],
        "house_cost": 100,
        "mortgage": 90
    },
    {
        "id": 19,
        "name": "Venice",
        "alt_name": "New York Ave",
        "country": "Italy",
        "country_code": "IT",
        "flag": "🇮🇹",
        "type": "property",
        "group": "orange",
        "price": 200,
        "rent": [16, 80, 220, 600, 800, 1000],
        "house_cost": 100,
        "mortgage": 100
    },
    {
        "id": 20,
        "name": "Free Parking",
        "type": "parking",
        "description": "Rest space or collect jackpot"
    },

    # Top Row (21 to 30): moving right to 30 (Go To Jail, top-right)
    {
        "id": 21,
        "name": "Madrid",
        "alt_name": "Kentucky Ave",
        "country": "Spain",
        "country_code": "ES",
        "flag": "🇪🇸",
        "type": "property",
        "group": "red",
        "price": 220,
        "rent": [18, 90, 250, 700, 875, 1050],
        "house_cost": 150,
        "mortgage": 110
    },
    {
        "id": 22,
        "name": "Chance",
        "type": "chance",
        "description": "Draw a Chance card"
    },
    {
        "id": 23,
        "name": "Barcelona",
        "alt_name": "Indiana Ave",
        "country": "Spain",
        "country_code": "ES",
        "flag": "🇪🇸",
        "type": "property",
        "group": "red",
        "price": 220,
        "rent": [18, 90, 250, 700, 875, 1050],
        "house_cost": 150,
        "mortgage": 110
    },
    {
        "id": 24,
        "name": "Seville",
        "alt_name": "Illinois Ave",
        "country": "Spain",
        "country_code": "ES",
        "flag": "🇪🇸",
        "type": "property",
        "group": "red",
        "price": 240,
        "rent": [20, 100, 300, 750, 925, 1100],
        "house_cost": 150,
        "mortgage": 120
    },
    {
        "id": 25,
        "name": "North Station",
        "alt_name": "B&O Railroad",
        "country": "Transit",
        "country_code": "TR",
        "flag": "🚂",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 26,
        "name": "Liverpool",
        "alt_name": "Atlantic Ave",
        "country": "United Kingdom",
        "country_code": "GB",
        "flag": "🇬🇧",
        "type": "property",
        "group": "yellow",
        "price": 260,
        "rent": [22, 110, 330, 800, 975, 1150],
        "house_cost": 150,
        "mortgage": 130
    },
    {
        "id": 27,
        "name": "Manchester",
        "alt_name": "Ventnor Ave",
        "country": "United Kingdom",
        "country_code": "GB",
        "flag": "🇬🇧",
        "type": "property",
        "group": "yellow",
        "price": 260,
        "rent": [22, 110, 330, 800, 975, 1150],
        "house_cost": 150,
        "mortgage": 130
    },
    {
        "id": 28,
        "name": "Water Supply",
        "alt_name": "Water Works",
        "country": "Utility",
        "country_code": "UT",
        "flag": "🚰",
        "type": "utility",
        "group": "utility",
        "price": 150,
        "mortgage": 75
    },
    {
        "id": 29,
        "name": "London",
        "alt_name": "Marvin Gardens",
        "country": "United Kingdom",
        "country_code": "GB",
        "flag": "🇬🇧",
        "type": "property",
        "group": "yellow",
        "price": 280,
        "rent": [24, 120, 360, 850, 1025, 1200],
        "house_cost": 150,
        "mortgage": 140
    },
    {
        "id": 30,
        "name": "Go To Jail",
        "type": "gotojail",
        "description": "Go directly to Jail!"
    },

    # Right Row (31 to 39): moving down to 39, then next is 0 (GO)
    {
        "id": 31,
        "name": "Sydney",
        "alt_name": "Pacific Ave",
        "country": "Australia",
        "country_code": "AU",
        "flag": "🇦🇺",
        "type": "property",
        "group": "green",
        "price": 300,
        "rent": [26, 130, 390, 900, 1100, 1275],
        "house_cost": 200,
        "mortgage": 150
    },
    {
        "id": 32,
        "name": "Melbourne",
        "alt_name": "North Carolina Ave",
        "country": "Australia",
        "country_code": "AU",
        "flag": "🇦🇺",
        "type": "property",
        "group": "green",
        "price": 300,
        "rent": [26, 130, 390, 900, 1100, 1275],
        "house_cost": 200,
        "mortgage": 150
    },
    {
        "id": 33,
        "name": "Community Chest",
        "type": "chest",
        "description": "Draw a Community Chest card"
    },
    {
        "id": 34,
        "name": "Brisbane",
        "alt_name": "Pennsylvania Ave",
        "country": "Australia",
        "country_code": "AU",
        "flag": "🇦🇺",
        "type": "property",
        "group": "green",
        "price": 320,
        "rent": [28, 150, 450, 1000, 1200, 1400],
        "house_cost": 200,
        "mortgage": 160
    },
    {
        "id": 35,
        "name": "East Station",
        "alt_name": "Short Line RR",
        "country": "Transit",
        "country_code": "TR",
        "flag": "🚂",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 36,
        "name": "Chance",
        "type": "chance",
        "description": "Draw a Chance card"
    },
    {
        "id": 37,
        "name": "Los Angeles",
        "alt_name": "Park Place",
        "country": "United States",
        "country_code": "US",
        "flag": "🇺🇸",
        "type": "property",
        "group": "darkblue",
        "price": 350,
        "rent": [35, 175, 500, 1100, 1300, 1500],
        "house_cost": 200,
        "mortgage": 175
    },
    {
        "id": 38,
        "name": "Luxury Tax",
        "type": "tax",
        "tax_amount": 100,
        "description": "Pay $100 Luxury Tax"
    },
    {
        "id": 39,
        "name": "New York",
        "alt_name": "Boardwalk",
        "country": "United States",
        "country_code": "US",
        "flag": "🇺🇸",
        "type": "property",
        "group": "darkblue",
        "price": 400,
        "rent": [50, 200, 600, 1400, 1700, 2000],
        "house_cost": 200,
        "mortgage": 200
    }
]

# Color group definitions and property counts
COLOR_GROUPS = {
    "brown": {"tiles": [1, 3], "color": "#92400e", "name": "Brown", "max": 2},
    "lightblue": {"tiles": [6, 8, 9], "color": "#38bdf8", "name": "Light Blue", "max": 3},
    "pink": {"tiles": [11, 13, 14], "color": "#f472b6", "name": "Pink", "max": 3},
    "orange": {"tiles": [16, 18, 19], "color": "#fb923c", "name": "Orange", "max": 3},
    "red": {"tiles": [21, 23, 24], "color": "#ef4444", "name": "Red", "max": 3},
    "yellow": {"tiles": [26, 27, 29], "color": "#facc15", "name": "Yellow", "max": 3},
    "green": {"tiles": [31, 32, 34], "color": "#22c55e", "name": "Green", "max": 3},
    "darkblue": {"tiles": [37, 39], "color": "#3b82f6", "name": "Dark Blue", "max": 2},
    "railroad": {"tiles": [5, 15, 25, 35], "color": "#94a3b8", "name": "Railroads", "max": 4},
    "utility": {"tiles": [12, 28], "color": "#fbbf24", "name": "Utilities", "max": 2}
}

CHANCE_CARDS = [
    {
        "id": "ch_go",
        "title": "Advance to GO",
        "desc": "Advance to GO. Collect $200 salary.",
        "action": "move_to",
        "target": 0
    },
    {
        "id": "ch_ny",
        "title": "Take a Trip to New York",
        "desc": "Advance to New York. If you pass GO, collect $200.",
        "action": "move_to",
        "target": 39
    },
    {
        "id": "ch_seville",
        "title": "Visit Seville",
        "desc": "Advance to Seville. If you pass GO, collect $200.",
        "action": "move_to",
        "target": 24
    },
    {
        "id": "ch_railroad",
        "title": "Nearest Station",
        "desc": "Advance to the nearest Station. Pay double rent if owned.",
        "action": "nearest_railroad"
    },
    {
        "id": "ch_utility",
        "title": "Nearest Utility",
        "desc": "Advance to the nearest Utility. If owned, throw dice and pay 10 times the amount.",
        "action": "nearest_utility"
    },
    {
        "id": "ch_dividend",
        "title": "Bank Dividend",
        "desc": "Bank pays you dividend of $50.",
        "action": "collect",
        "amount": 50
    },
    {
        "id": "ch_jail_free",
        "title": "Get Out of Jail Free",
        "desc": "This card may be kept until needed or traded.",
        "action": "jail_free"
    },
    {
        "id": "ch_back_3",
        "title": "Go Back 3 Spaces",
        "desc": "Step back 3 spaces and follow tile rules.",
        "action": "move_steps",
        "steps": -3
    },
    {
        "id": "ch_goto_jail",
        "title": "Go to Jail",
        "desc": "Go directly to Jail. Do not pass GO, do not collect $200.",
        "action": "goto_jail"
    },
    {
        "id": "ch_repairs",
        "title": "Property Repairs",
        "desc": "Make general repairs on your property. Pay $25 per house and $100 per hotel.",
        "action": "repairs",
        "house": 25,
        "hotel": 100
    },
    {
        "id": "ch_speeding",
        "title": "Speeding Fine",
        "desc": "Speeding fine! Pay $15.",
        "action": "pay",
        "amount": 15
    },
    {
        "id": "ch_chairman",
        "title": "Elected Chairman",
        "desc": "You have been elected Chairman of the Board. Pay each player $50.",
        "action": "pay_each",
        "amount": 50
    },
    {
        "id": "ch_building_loan",
        "title": "Building Loan Matures",
        "desc": "Your building loan matures. Collect $150.",
        "action": "collect",
        "amount": 150
    }
]

COMMUNITY_CARDS = [
    {
        "id": "cc_go",
        "title": "Advance to GO",
        "desc": "Advance to GO. Collect $200 salary.",
        "action": "move_to",
        "target": 0
    },
    {
        "id": "cc_bank_error",
        "title": "Bank Error",
        "desc": "Bank error in your favor. Collect $200.",
        "action": "collect",
        "amount": 200
    },
    {
        "id": "cc_doctor",
        "title": "Doctor's Fee",
        "desc": "Doctor's fee. Pay $50.",
        "action": "pay",
        "amount": 50
    },
    {
        "id": "cc_stock",
        "title": "Stock Sale",
        "desc": "From sale of stock you get $50.",
        "action": "collect",
        "amount": 50
    },
    {
        "id": "cc_jail_free",
        "title": "Get Out of Jail Free",
        "desc": "This card may be kept until needed or traded.",
        "action": "jail_free"
    },
    {
        "id": "cc_goto_jail",
        "title": "Go to Jail",
        "desc": "Go directly to Jail. Do not pass GO, do not collect $200.",
        "action": "goto_jail"
    },
    {
        "id": "cc_holiday",
        "title": "Holiday Fund",
        "desc": "Holiday fund matures. Receive $100.",
        "action": "collect",
        "amount": 100
    },
    {
        "id": "cc_tax_refund",
        "title": "Income Tax Refund",
        "desc": "Income tax refund. Collect $20.",
        "action": "collect",
        "amount": 20
    },
    {
        "id": "cc_birthday",
        "title": "It's Your Birthday!",
        "desc": "It is your birthday. Collect $10 from every player.",
        "action": "collect_each",
        "amount": 10
    },
    {
        "id": "cc_life_insurance",
        "title": "Life Insurance Matures",
        "desc": "Life insurance matures. Collect $100.",
        "action": "collect",
        "amount": 100
    },
    {
        "id": "cc_hospital",
        "title": "Hospital Fees",
        "desc": "Pay hospital fees of $100.",
        "action": "pay",
        "amount": 100
    },
    {
        "id": "cc_school",
        "title": "School Fees",
        "desc": "Pay school fees of $50.",
        "action": "pay",
        "amount": 50
    },
    {
        "id": "cc_consultancy",
        "title": "Consultancy Fee",
        "desc": "Receive $25 consultancy fee.",
        "action": "collect",
        "amount": 25
    },
    {
        "id": "cc_street_repairs",
        "title": "Street Repairs",
        "desc": "You are assessed for street repairs. Pay $40 per house, $115 per hotel.",
        "action": "repairs",
        "house": 40,
        "hotel": 115
    },
    {
        "id": "cc_beauty",
        "title": "Beauty Contest",
        "desc": "You won second prize in a beauty contest. Collect $10.",
        "action": "collect",
        "amount": 10
    },
    {
        "id": "cc_inherit",
        "title": "Inheritance",
        "desc": "You inherit $100.",
        "action": "collect",
        "amount": 100
    }
]
