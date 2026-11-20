"""
Richup.io Board Data and Card Definitions
Supports Standard (40 tiles) and Extended "Mr. Worldwide" (48 tiles) boards
"""

# Standard Board (40 tiles, 11x11 grid)
BOARD_TILES_STANDARD = [
    # Top Row (0 to 10): 0 is START (top-left), moving right to 10 (Passing by / In Prison, top-right)
    {
        "id": 0,
        "name": "START",
        "alt_name": "GO",
        "type": "go",
        "description": "Collect $200 salary as you pass",
        "price": 0
    },
    {
        "id": 1,
        "name": "Salvador",
        "country": "Brazil",
        "country_code": "BR",
        "flag": "🇧🇷",
        "type": "property",
        "group": "brown",
        "price": 60,
        "rent": [2, 10, 30, 90, 160, 250],
        "house_cost": 50,
        "mortgage": 30
    },
    {
        "id": 2,
        "name": "Treasure",
        "alt_name": "Community Chest",
        "type": "chest",
        "country_code": "CHEST",
        "description": "Draw a Treasure card"
    },
    {
        "id": 3,
        "name": "Rio",
        "country": "Brazil",
        "country_code": "BR",
        "flag": "🇧🇷",
        "type": "property",
        "group": "brown",
        "price": 60,
        "rent": [4, 20, 60, 180, 320, 450],
        "house_cost": 50,
        "mortgage": 30
    },
    {
        "id": 4,
        "name": "Earnings Tax",
        "alt_name": "Income Tax",
        "type": "tax",
        "country_code": "TAX",
        "tax_amount": 200,
        "description": "Pay %10 or $200 Earnings Tax"
    },
    {
        "id": 5,
        "name": "TLV Airport",
        "country": "Transit",
        "country_code": "AIRPORT",
        "flag": "✈️",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 6,
        "name": "Tel Aviv",
        "country": "Israel",
        "country_code": "IL",
        "flag": "🇮🇱",
        "type": "property",
        "group": "lightblue",
        "price": 100,
        "rent": [6, 30, 90, 270, 400, 550],
        "house_cost": 50,
        "mortgage": 50
    },
    {
        "id": 7,
        "name": "Haifa",
        "country": "Israel",
        "country_code": "IL",
        "flag": "🇮🇱",
        "type": "property",
        "group": "lightblue",
        "price": 110,
        "rent": [6, 30, 90, 270, 400, 550],
        "house_cost": 50,
        "mortgage": 55
    },
    {
        "id": 8,
        "name": "Surprise",
        "alt_name": "Chance",
        "type": "chance",
        "country_code": "CHANCE",
        "description": "Draw a Surprise card"
    },
    {
        "id": 9,
        "name": "Jerusalem",
        "country": "Israel",
        "country_code": "IL",
        "flag": "🇮🇱",
        "type": "property",
        "group": "lightblue",
        "price": 120,
        "rent": [8, 40, 100, 300, 450, 600],
        "house_cost": 50,
        "mortgage": 60
    },
    {
        "id": 10,
        "name": "Passing by",
        "alt_name": "In Prison",
        "type": "jail",
        "description": "Passing by or In Prison"
    },

    # Right Row (11 to 20): moving down to 20 (Vacation, bottom-right)
    {
        "id": 11,
        "name": "Venice",
        "country": "Italy",
        "country_code": "IT",
        "flag": "🇮🇹",
        "type": "property",
        "group": "pink",
        "price": 130,
        "rent": [10, 50, 150, 450, 625, 750],
        "house_cost": 100,
        "mortgage": 65
    },
    {
        "id": 12,
        "name": "Power Company",
        "alt_name": "Electric Company",
        "country": "Utility",
        "country_code": "POWER",
        "flag": "⚡",
        "type": "utility",
        "group": "utility",
        "price": 150,
        "mortgage": 75
    },
    {
        "id": 13,
        "name": "Milan",
        "country": "Italy",
        "country_code": "IT",
        "flag": "🇮🇹",
        "type": "property",
        "group": "pink",
        "price": 140,
        "rent": [10, 50, 150, 450, 625, 750],
        "house_cost": 100,
        "mortgage": 70
    },
    {
        "id": 14,
        "name": "Rome",
        "country": "Italy",
        "country_code": "IT",
        "flag": "🇮🇹",
        "type": "property",
        "group": "pink",
        "price": 160,
        "rent": [12, 60, 180, 500, 700, 900],
        "house_cost": 100,
        "mortgage": 80
    },
    {
        "id": 15,
        "name": "MUC Airport",
        "country": "Transit",
        "country_code": "AIRPORT",
        "flag": "✈️",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 16,
        "name": "Frankfurt",
        "country": "Germany",
        "country_code": "DE",
        "flag": "🇩🇪",
        "type": "property",
        "group": "orange",
        "price": 180,
        "rent": [14, 70, 200, 550, 750, 950],
        "house_cost": 100,
        "mortgage": 90
    },
    {
        "id": 17,
        "name": "Treasure",
        "alt_name": "Community Chest",
        "type": "chest",
        "country_code": "CHEST",
        "description": "Draw a Treasure card"
    },
    {
        "id": 18,
        "name": "Munich",
        "country": "Germany",
        "country_code": "DE",
        "flag": "🇩🇪",
        "type": "property",
        "group": "orange",
        "price": 190,
        "rent": [14, 70, 200, 550, 750, 950],
        "house_cost": 100,
        "mortgage": 95
    },
    {
        "id": 19,
        "name": "Berlin",
        "country": "Germany",
        "country_code": "DE",
        "flag": "🇩🇪",
        "type": "property",
        "group": "orange",
        "price": 200,
        "rent": [16, 80, 220, 600, 800, 1000],
        "house_cost": 100,
        "mortgage": 100
    },
    {
        "id": 20,
        "name": "Vacation",
        "alt_name": "Free Parking",
        "type": "parking",
        "description": "Vacation - collect tax pool or rest"
    },

    # Bottom Row (21 to 30): moving left to 30 (Go to prison, bottom-left)
    {
        "id": 21,
        "name": "Shenzhen",
        "country": "China",
        "country_code": "CN",
        "flag": "🇨🇳",
        "type": "property",
        "group": "red",
        "price": 220,
        "rent": [18, 90, 250, 700, 875, 1050],
        "house_cost": 150,
        "mortgage": 110
    },
    {
        "id": 22,
        "name": "Surprise",
        "alt_name": "Chance",
        "type": "chance",
        "country_code": "CHANCE",
        "description": "Draw a Surprise card"
    },
    {
        "id": 23,
        "name": "Beijing",
        "country": "China",
        "country_code": "CN",
        "flag": "🇨🇳",
        "type": "property",
        "group": "red",
        "price": 220,
        "rent": [18, 90, 250, 700, 875, 1050],
        "house_cost": 150,
        "mortgage": 110
    },
    {
        "id": 24,
        "name": "Shanghai",
        "country": "China",
        "country_code": "CN",
        "flag": "🇨🇳",
        "type": "property",
        "group": "red",
        "price": 240,
        "rent": [20, 100, 300, 750, 925, 1100],
        "house_cost": 150,
        "mortgage": 120
    },
    {
        "id": 25,
        "name": "CDG Airport",
        "country": "Transit",
        "country_code": "AIRPORT",
        "flag": "✈️",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 26,
        "name": "Toulouse",
        "country": "France",
        "country_code": "FR",
        "flag": "🇫🇷",
        "type": "property",
        "group": "yellow",
        "price": 260,
        "rent": [22, 110, 330, 800, 975, 1150],
        "house_cost": 150,
        "mortgage": 130
    },
    {
        "id": 27,
        "name": "Water Company",
        "alt_name": "Water Works",
        "country": "Utility",
        "country_code": "WATER",
        "flag": "🚰",
        "type": "utility",
        "group": "utility",
        "price": 150,
        "mortgage": 75
    },
    {
        "id": 28,
        "name": "Lyon",
        "country": "France",
        "country_code": "FR",
        "flag": "🇫🇷",
        "type": "property",
        "group": "yellow",
        "price": 260,
        "rent": [22, 110, 330, 800, 975, 1150],
        "house_cost": 150,
        "mortgage": 130
    },
    {
        "id": 29,
        "name": "Paris",
        "country": "France",
        "country_code": "FR",
        "flag": "🇫🇷",
        "type": "property",
        "group": "yellow",
        "price": 280,
        "rent": [24, 120, 360, 850, 1025, 1200],
        "house_cost": 150,
        "mortgage": 140
    },
    {
        "id": 30,
        "name": "Go to prison",
        "alt_name": "Go To Jail",
        "type": "gotojail",
        "description": "Go directly to prison!"
    },

    # Left Row (31 to 39): moving up to 39, then next is 0 (START)
    {
        "id": 31,
        "name": "Liverpool",
        "country": "United Kingdom",
        "country_code": "GB",
        "flag": "🇬🇧",
        "type": "property",
        "group": "green",
        "price": 290,
        "rent": [26, 130, 390, 900, 1100, 1275],
        "house_cost": 200,
        "mortgage": 145
    },
    {
        "id": 32,
        "name": "Manchester",
        "country": "United Kingdom",
        "country_code": "GB",
        "flag": "🇬🇧",
        "type": "property",
        "group": "green",
        "price": 300,
        "rent": [26, 130, 390, 900, 1100, 1275],
        "house_cost": 200,
        "mortgage": 150
    },
    {
        "id": 33,
        "name": "Treasure",
        "alt_name": "Community Chest",
        "type": "chest",
        "country_code": "CHEST",
        "description": "Draw a Treasure card"
    },
    {
        "id": 34,
        "name": "London",
        "country": "United Kingdom",
        "country_code": "GB",
        "flag": "🇬🇧",
        "type": "property",
        "group": "green",
        "price": 320,
        "rent": [28, 150, 450, 1000, 1200, 1400],
        "house_cost": 200,
        "mortgage": 160
    },
    {
        "id": 35,
        "name": "JFK Airport",
        "country": "Transit",
        "country_code": "AIRPORT",
        "flag": "✈️",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 36,
        "name": "Surprise",
        "alt_name": "Chance",
        "type": "chance",
        "country_code": "CHANCE",
        "description": "Draw a Surprise card"
    },
    {
        "id": 37,
        "name": "San Francisco",
        "country": "United States",
        "country_code": "US",
        "flag": "🇺🇸",
        "type": "property",
        "group": "darkblue",
        "price": 360,
        "rent": [35, 175, 500, 1100, 1300, 1500],
        "house_cost": 200,
        "mortgage": 180
    },
    {
        "id": 38,
        "name": "Premium Tax",
        "alt_name": "Luxury Tax",
        "type": "tax",
        "country_code": "PREMIUM_TAX",
        "tax_amount": 75,
        "description": "Pay $75 Premium Tax"
    },
    {
        "id": 39,
        "name": "New York",
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

COLOR_GROUPS_STANDARD = {
    "brown": {"tiles": [1, 3], "color": "#7c3aed", "name": "Brown", "max": 2},
    "lightblue": {"tiles": [6, 7, 9], "color": "#38bdf8", "name": "Light Blue", "max": 3},
    "pink": {"tiles": [11, 13, 14], "color": "#06b6d4", "name": "Teal", "max": 3},
    "orange": {"tiles": [16, 18, 19], "color": "#f97316", "name": "Orange", "max": 3},
    "red": {"tiles": [21, 23, 24], "color": "#ef4444", "name": "Red", "max": 3},
    "yellow": {"tiles": [26, 28, 29], "color": "#ec4899", "name": "Pink", "max": 3},
    "green": {"tiles": [31, 32, 34], "color": "#8b5cf6", "name": "Purple", "max": 3},
    "darkblue": {"tiles": [37, 39], "color": "#2563eb", "name": "Dark Blue", "max": 2},
    "railroad": {"tiles": [5, 15, 25, 35], "color": "#64748b", "name": "Airports", "max": 4},
    "utility": {"tiles": [12, 27], "color": "#eab308", "name": "Utilities", "max": 2}
}


# Extended Board "Mr. Worldwide" (48 tiles, 13x13 grid: 4 corners + 11 intermediate tiles per side)
BOARD_TILES_EXTENDED = [
    # Top Row (0 to 12): 0 is START (top-left), moving right to 12 (Passing by / In Prison, top-right)
    {
        "id": 0,
        "name": "START",
        "alt_name": "GO",
        "type": "go",
        "description": "Collect $200 salary as you pass",
        "price": 0
    },
    {
        "id": 1,
        "name": "Salvador",
        "country": "Brazil",
        "country_code": "BR",
        "flag": "🇧🇷",
        "type": "property",
        "group": "brown",
        "price": 60,
        "rent": [2, 10, 30, 90, 160, 250],
        "house_cost": 50,
        "mortgage": 30
    },
    {
        "id": 2,
        "name": "Treasure",
        "alt_name": "Community Chest",
        "type": "chest",
        "country_code": "CHEST",
        "description": "Draw a Treasure card"
    },
    {
        "id": 3,
        "name": "Rio",
        "country": "Brazil",
        "country_code": "BR",
        "flag": "🇧🇷",
        "type": "property",
        "group": "brown",
        "price": 60,
        "rent": [4, 20, 60, 180, 320, 450],
        "house_cost": 50,
        "mortgage": 30
    },
    {
        "id": 4,
        "name": "Earnings Tax",
        "alt_name": "Income Tax",
        "type": "tax",
        "country_code": "TAX",
        "tax_amount": 200,
        "description": "Pay %10 or $200 Earnings Tax"
    },
    {
        "id": 5,
        "name": "Tel Aviv",
        "country": "Israel",
        "country_code": "IL",
        "flag": "🇮🇱",
        "type": "property",
        "group": "lightblue",
        "price": 100,
        "rent": [6, 30, 90, 270, 400, 550],
        "house_cost": 50,
        "mortgage": 50
    },
    {
        "id": 6,
        "name": "TLV Airport",
        "country": "Transit",
        "country_code": "AIRPORT",
        "flag": "✈️",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 7,
        "name": "Haifa",
        "country": "Israel",
        "country_code": "IL",
        "flag": "🇮🇱",
        "type": "property",
        "group": "lightblue",
        "price": 100,
        "rent": [6, 30, 90, 270, 400, 550],
        "house_cost": 50,
        "mortgage": 50
    },
    {
        "id": 8,
        "name": "Jerusalem",
        "country": "Israel",
        "country_code": "IL",
        "flag": "🇮🇱",
        "type": "property",
        "group": "lightblue",
        "price": 110,
        "rent": [8, 40, 100, 300, 450, 600],
        "house_cost": 50,
        "mortgage": 55
    },
    {
        "id": 9,
        "name": "Surprise",
        "alt_name": "Chance",
        "type": "chance",
        "country_code": "CHANCE",
        "description": "Draw a Surprise card"
    },
    {
        "id": 10,
        "name": "Mumbai",
        "country": "India",
        "country_code": "IN",
        "flag": "🇮🇳",
        "type": "property",
        "group": "india",
        "price": 120,
        "rent": [8, 40, 100, 300, 450, 600],
        "house_cost": 50,
        "mortgage": 60
    },
    {
        "id": 11,
        "name": "New Delhi",
        "country": "India",
        "country_code": "IN",
        "flag": "🇮🇳",
        "type": "property",
        "group": "india",
        "price": 130,
        "rent": [10, 50, 150, 450, 625, 750],
        "house_cost": 50,
        "mortgage": 65
    },
    {
        "id": 12,
        "name": "Passing by",
        "alt_name": "In Prison",
        "type": "jail",
        "description": "Passing by or In Prison"
    },

    # Right Column (13 to 24): moving down to 24 (Vacation, bottom-right)
    {
        "id": 13,
        "name": "Venice",
        "country": "Italy",
        "country_code": "IT",
        "flag": "🇮🇹",
        "type": "property",
        "group": "pink",
        "price": 140,
        "rent": [10, 50, 150, 450, 625, 750],
        "house_cost": 100,
        "mortgage": 70
    },
    {
        "id": 14,
        "name": "Bologna",
        "country": "Italy",
        "country_code": "IT",
        "flag": "🇮🇹",
        "type": "property",
        "group": "pink",
        "price": 140,
        "rent": [10, 50, 150, 450, 625, 750],
        "house_cost": 100,
        "mortgage": 70
    },
    {
        "id": 15,
        "name": "Power Company",
        "alt_name": "Electric Company",
        "country": "Utility",
        "country_code": "POWER",
        "flag": "⚡",
        "type": "utility",
        "group": "utility",
        "price": 150,
        "mortgage": 75
    },
    {
        "id": 16,
        "name": "Milan",
        "country": "Italy",
        "country_code": "IT",
        "flag": "🇮🇹",
        "type": "property",
        "group": "pink",
        "price": 160,
        "rent": [12, 60, 180, 500, 700, 900],
        "house_cost": 100,
        "mortgage": 80
    },
    {
        "id": 17,
        "name": "Rome",
        "country": "Italy",
        "country_code": "IT",
        "flag": "🇮🇹",
        "type": "property",
        "group": "pink",
        "price": 160,
        "rent": [12, 60, 180, 500, 700, 900],
        "house_cost": 100,
        "mortgage": 80
    },
    {
        "id": 18,
        "name": "MUC Airport",
        "country": "Transit",
        "country_code": "AIRPORT",
        "flag": "✈️",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 19,
        "name": "Frankfurt",
        "country": "Germany",
        "country_code": "DE",
        "flag": "🇩🇪",
        "type": "property",
        "group": "orange",
        "price": 180,
        "rent": [14, 70, 200, 550, 750, 950],
        "house_cost": 100,
        "mortgage": 90
    },
    {
        "id": 20,
        "name": "Treasure",
        "alt_name": "Community Chest",
        "type": "chest",
        "country_code": "CHEST",
        "description": "Draw a Treasure card"
    },
    {
        "id": 21,
        "name": "Munich",
        "country": "Germany",
        "country_code": "DE",
        "flag": "🇩🇪",
        "type": "property",
        "group": "orange",
        "price": 180,
        "rent": [14, 70, 200, 550, 750, 950],
        "house_cost": 100,
        "mortgage": 90
    },
    {
        "id": 22,
        "name": "Gas Company",
        "country": "Utility",
        "country_code": "GAS",
        "flag": "🔥",
        "type": "utility",
        "group": "utility",
        "price": 150,
        "mortgage": 75
    },
    {
        "id": 23,
        "name": "Berlin",
        "country": "Germany",
        "country_code": "DE",
        "flag": "🇩🇪",
        "type": "property",
        "group": "orange",
        "price": 200,
        "rent": [16, 80, 220, 600, 800, 1000],
        "house_cost": 100,
        "mortgage": 100
    },
    {
        "id": 24,
        "name": "Vacation",
        "alt_name": "Free Parking",
        "type": "parking",
        "description": "Vacation - collect tax pool or rest"
    },

    # Bottom Row (25 to 36): moving left to 36 (Go to prison, bottom-left)
    {
        "id": 25,
        "name": "Shenzhen",
        "country": "China",
        "country_code": "CN",
        "flag": "🇨🇳",
        "type": "property",
        "group": "red",
        "price": 220,
        "rent": [18, 90, 250, 700, 875, 1050],
        "house_cost": 150,
        "mortgage": 110
    },
    {
        "id": 26,
        "name": "Surprise",
        "alt_name": "Chance",
        "type": "chance",
        "country_code": "CHANCE",
        "description": "Draw a Surprise card"
    },
    {
        "id": 27,
        "name": "Beijing",
        "country": "China",
        "country_code": "CN",
        "flag": "🇨🇳",
        "type": "property",
        "group": "red",
        "price": 220,
        "rent": [18, 90, 250, 700, 875, 1050],
        "house_cost": 150,
        "mortgage": 110
    },
    {
        "id": 28,
        "name": "Treasure",
        "alt_name": "Community Chest",
        "type": "chest",
        "country_code": "CHEST",
        "description": "Draw a Treasure card"
    },
    {
        "id": 29,
        "name": "Shanghai",
        "country": "China",
        "country_code": "CN",
        "flag": "🇨🇳",
        "type": "property",
        "group": "red",
        "price": 240,
        "rent": [20, 100, 300, 750, 925, 1100],
        "house_cost": 150,
        "mortgage": 120
    },
    {
        "id": 30,
        "name": "CDG Airport",
        "country": "Transit",
        "country_code": "AIRPORT",
        "flag": "✈️",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 31,
        "name": "Toulouse",
        "country": "France",
        "country_code": "FR",
        "flag": "🇫🇷",
        "type": "property",
        "group": "yellow",
        "price": 260,
        "rent": [22, 110, 330, 800, 975, 1150],
        "house_cost": 150,
        "mortgage": 130
    },
    {
        "id": 32,
        "name": "Paris",
        "country": "France",
        "country_code": "FR",
        "flag": "🇫🇷",
        "type": "property",
        "group": "yellow",
        "price": 260,
        "rent": [22, 110, 330, 800, 975, 1150],
        "house_cost": 150,
        "mortgage": 130
    },
    {
        "id": 33,
        "name": "Water Company",
        "alt_name": "Water Works",
        "country": "Utility",
        "country_code": "WATER",
        "flag": "🚰",
        "type": "utility",
        "group": "utility",
        "price": 150,
        "mortgage": 75
    },
    {
        "id": 34,
        "name": "Yokohama",
        "country": "Japan",
        "country_code": "JP",
        "flag": "🇯🇵",
        "type": "property",
        "group": "japan",
        "price": 280,
        "rent": [24, 120, 360, 850, 1025, 1200],
        "house_cost": 150,
        "mortgage": 140
    },
    {
        "id": 35,
        "name": "Tokyo",
        "country": "Japan",
        "country_code": "JP",
        "flag": "🇯🇵",
        "type": "property",
        "group": "japan",
        "price": 280,
        "rent": [24, 120, 360, 850, 1025, 1200],
        "house_cost": 150,
        "mortgage": 140
    },
    {
        "id": 36,
        "name": "Go to prison",
        "alt_name": "Go To Jail",
        "type": "gotojail",
        "description": "Go directly to prison!"
    },

    # Left Column (37 to 47): moving up to 47, then next is 0 (START)
    {
        "id": 37,
        "name": "Liverpool",
        "country": "United Kingdom",
        "country_code": "GB",
        "flag": "🇬🇧",
        "type": "property",
        "group": "green",
        "price": 300,
        "rent": [26, 130, 390, 900, 1100, 1275],
        "house_cost": 200,
        "mortgage": 150
    },
    {
        "id": 38,
        "name": "Manchester",
        "country": "United Kingdom",
        "country_code": "GB",
        "flag": "🇬🇧",
        "type": "property",
        "group": "green",
        "price": 300,
        "rent": [26, 130, 390, 900, 1100, 1275],
        "house_cost": 200,
        "mortgage": 150
    },
    {
        "id": 39,
        "name": "Treasure",
        "alt_name": "Community Chest",
        "type": "chest",
        "country_code": "CHEST",
        "description": "Draw a Treasure card"
    },
    {
        "id": 40,
        "name": "Birmingham",
        "country": "United Kingdom",
        "country_code": "GB",
        "flag": "🇬🇧",
        "type": "property",
        "group": "green",
        "price": 320,
        "rent": [28, 150, 450, 1000, 1200, 1400],
        "house_cost": 200,
        "mortgage": 160
    },
    {
        "id": 41,
        "name": "London",
        "country": "United Kingdom",
        "country_code": "GB",
        "flag": "🇬🇧",
        "type": "property",
        "group": "green",
        "price": 320,
        "rent": [28, 150, 450, 1000, 1200, 1400],
        "house_cost": 200,
        "mortgage": 160
    },
    {
        "id": 42,
        "name": "JFK Airport",
        "country": "Transit",
        "country_code": "AIRPORT",
        "flag": "✈️",
        "type": "railroad",
        "group": "railroad",
        "price": 200,
        "rent": [25, 50, 100, 200],
        "mortgage": 100
    },
    {
        "id": 43,
        "name": "Los Angeles",
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
        "id": 44,
        "name": "Surprise",
        "alt_name": "Chance",
        "type": "chance",
        "country_code": "CHANCE",
        "description": "Draw a Surprise card"
    },
    {
        "id": 45,
        "name": "San Francisco",
        "country": "United States",
        "country_code": "US",
        "flag": "🇺🇸",
        "type": "property",
        "group": "darkblue",
        "price": 360,
        "rent": [35, 175, 500, 1100, 1300, 1500],
        "house_cost": 200,
        "mortgage": 180
    },
    {
        "id": 46,
        "name": "Premium Tax",
        "alt_name": "Luxury Tax",
        "type": "tax",
        "country_code": "PREMIUM_TAX",
        "tax_amount": 75,
        "description": "Pay $75 Premium Tax"
    },
    {
        "id": 47,
        "name": "New York",
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

COLOR_GROUPS_EXTENDED = {
    "brown": {"tiles": [1, 3], "color": "#7c3aed", "name": "Brown", "max": 2},
    "lightblue": {"tiles": [5, 7, 8], "color": "#38bdf8", "name": "Light Blue", "max": 3},
    "india": {"tiles": [10, 11], "color": "#a855f7", "name": "Purple Orange", "max": 2},
    "pink": {"tiles": [13, 14, 16, 17], "color": "#06b6d4", "name": "Teal", "max": 4},
    "orange": {"tiles": [19, 21, 23], "color": "#f97316", "name": "Orange", "max": 3},
    "red": {"tiles": [25, 27, 29], "color": "#ef4444", "name": "Red", "max": 3},
    "yellow": {"tiles": [31, 32], "color": "#ec4899", "name": "Pink", "max": 2},
    "japan": {"tiles": [34, 35], "color": "#f43f5e", "name": "Rose Red", "max": 2},
    "green": {"tiles": [37, 38, 40, 41], "color": "#8b5cf6", "name": "Purple", "max": 4},
    "darkblue": {"tiles": [43, 45, 47], "color": "#2563eb", "name": "Dark Blue", "max": 3},
    "railroad": {"tiles": [6, 18, 30, 42], "color": "#64748b", "name": "Airports", "max": 4},
    "utility": {"tiles": [15, 22, 33], "color": "#eab308", "name": "Utilities", "max": 3}
}

# Registered board maps
MAPS = {
    "standard": {
        "id": "standard",
        "name": "Standard",
        "size": 40,
        "grid_size": 11,
        "tiles": BOARD_TILES_STANDARD,
        "color_groups": COLOR_GROUPS_STANDARD
    },
    "extended": {
        "id": "extended",
        "name": "Extended",
        "size": 48,
        "grid_size": 13,
        "tiles": BOARD_TILES_EXTENDED,
        "color_groups": COLOR_GROUPS_EXTENDED
    }
}

# Backwards compatible defaults
BOARD_TILES = BOARD_TILES_STANDARD
COLOR_GROUPS = COLOR_GROUPS_STANDARD

CHANCE_CARDS = [
    {
        "id": "ch_go",
        "title": "Advance to START",
        "desc": "Advance to START. Collect $200 salary.",
        "action": "move_to",
        "target": 0,
        "target_name": "START"
    },
    {
        "id": "ch_ny",
        "title": "Take a Trip to New York",
        "desc": "Advance to New York. If you pass START, collect $200.",
        "action": "move_to",
        "target": 39,
        "target_name": "New York"
    },
    {
        "id": "ch_shanghai",
        "title": "Visit Shanghai",
        "desc": "Advance to Shanghai. If you pass START, collect $200.",
        "action": "move_to",
        "target": 24,
        "target_name": "Shanghai"
    },
    {
        "id": "ch_railroad",
        "title": "Nearest Airport",
        "desc": "Fly to the nearest Airport. Pay double rent if owned.",
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
        "title": "Go to prison",
        "desc": "Go directly to prison. Do not pass START, do not collect $200.",
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
        "title": "Advance to START",
        "desc": "Advance to START. Collect $200 salary.",
        "action": "move_to",
        "target": 0,
        "target_name": "START"
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
        "title": "Go to prison",
        "desc": "Go directly to prison. Do not pass START, do not collect $200.",
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
