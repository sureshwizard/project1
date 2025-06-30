from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import json
import time
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(','))

# API Keys
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')
FOURSQUARE_API_KEY = os.getenv('FOURSQUARE_API_KEY')

# Cache for countries and cities data
countries_cache = None
cities_cache = {}

@app.route('/api/countries', methods=['GET'])
def get_countries():
    """Get list of all countries"""
    global countries_cache
    
    if countries_cache is None:
        try:
            response = requests.get('https://restcountries.com/v3.1/all?fields=name,cca2,flag')
            if response.status_code == 200:
                countries_data = response.json()
                countries_cache = [
                    {
                        'code': country['cca2'],
                        'name': country['name']['common'],
                        'flag': country.get('flag', '🏳️')
                    }
                    for country in countries_data
                ]
                countries_cache.sort(key=lambda x: x['name'])
            else:
                return jsonify({'error': 'Failed to fetch countries'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return jsonify(countries_cache)

@app.route('/api/cities/<country_code>', methods=['GET'])
def get_cities(country_code):
    """Get cities for a specific country"""
    if country_code in cities_cache:
        return jsonify(cities_cache[country_code])
    
    try:
        # Using GeoNames API (free with registration)
        url = f'http://api.geonames.org/searchJSON'
        params = {
            'country': country_code,
            'featureClass': 'P',  # Populated places
            'maxRows': 50,
            'orderby': 'population',
            'username': 'demo'  # Replace with your GeoNames username
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            cities = [
                {
                    'name': city['name'],
                    'lat': float(city['lat']),
                    'lng': float(city['lng']),
                    'population': city.get('population', 0),
                    'admin_name': city.get('adminName1', '')
                }
                for city in data.get('geonames', [])
                if city.get('population', 0) > 10000  # Filter for cities with population > 10k
            ]
            
            # Sort by population (descending)
            cities.sort(key=lambda x: x['population'], reverse=True)
            cities_cache[country_code] = cities[:30]  # Keep top 30 cities
            
            return jsonify(cities_cache[country_code])
        else:
            return jsonify({'error': 'Failed to fetch cities'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/city-data/<city_name>', methods=['GET'])
def get_city_data(city_name):
    """Get comprehensive data for a specific city"""
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    
    if not lat or not lng:
        return jsonify({'error': 'Latitude and longitude required'}), 400
    
    try:
        city_data = {
            'name': city_name,
            'coordinates': {'lat': float(lat), 'lng': float(lng)},
            'weather': get_weather_data(lat, lng),
            'places': get_nearby_places(lat, lng),
            'landmarks': get_landmarks_info(city_name),
            'accessibility': get_accessibility_info(lat, lng),
            'traffic': get_traffic_info(lat, lng),
            'storytelling': get_city_story(city_name)
        }
        
        return jsonify(city_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_weather_data(lat, lng):
    """Get weather data for coordinates"""
    if not OPENWEATHER_API_KEY:
        return {'error': 'Weather API key not configured'}
    
    try:
        url = f'https://api.openweathermap.org/data/2.5/weather'
        params = {
            'lat': lat,
            'lon': lng,
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric'
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            return {
                'temperature': data['main']['temp'],
                'description': data['weather'][0]['description'],
                'humidity': data['main']['humidity'],
                'wind_speed': data['wind']['speed'],
                'icon': data['weather'][0]['icon']
            }
    except Exception as e:
        print(f"Weather API error: {e}")
    
    return {'error': 'Weather data unavailable'}

def get_nearby_places(lat, lng):
    """Get nearby points of interest"""
    if not GOOGLE_MAPS_API_KEY:
        return {'error': 'Google Maps API key not configured'}
    
    try:
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
        params = {
            'location': f'{lat},{lng}',
            'radius': 5000,  # 5km radius
            'type': 'tourist_attraction',
            'key': GOOGLE_MAPS_API_KEY
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            places = []
            
            for place in data.get('results', [])[:20]:  # Limit to 20 places
                places.append({
                    'name': place['name'],
                    'rating': place.get('rating', 0),
                    'types': place.get('types', []),
                    'vicinity': place.get('vicinity', ''),
                    'location': place['geometry']['location'],
                    'photo_reference': place.get('photos', [{}])[0].get('photo_reference') if place.get('photos') else None
                })
            
            return places
    except Exception as e:
        print(f"Places API error: {e}")
    
    return {'error': 'Places data unavailable'}

def get_landmarks_info(city_name):
    """Get landmark information from Wikipedia"""
    try:
        # Search for landmarks in the city
        search_url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + city_name.replace(' ', '_')
        response = requests.get(search_url)
        
        if response.status_code == 200:
            data = response.json()
            return {
                'title': data.get('title', city_name),
                'extract': data.get('extract', ''),
                'thumbnail': data.get('thumbnail', {}).get('source') if data.get('thumbnail') else None
            }
    except Exception as e:
        print(f"Wikipedia API error: {e}")
    
    return {'extract': f'Explore the beautiful city of {city_name} with its rich history and culture.'}

def get_accessibility_info(lat, lng):
    """Get accessibility information using OpenStreetMap"""
    try:
        # Query Overpass API for accessibility features
        overpass_url = "http://overpass-api.de/api/interpreter"
        query = f"""
        [out:json][timeout:25];
        (
          way["wheelchair"="yes"](around:1000,{lat},{lng});
          node["wheelchair"="yes"](around:1000,{lat},{lng});
        );
        out geom;
        """
        
        response = requests.post(overpass_url, data=query)
        if response.status_code == 200:
            data = response.json()
            accessible_features = len(data.get('elements', []))
            
            return {
                'accessible_features_count': accessible_features,
                'accessibility_score': min(accessible_features / 10, 1.0),  # Normalize to 0-1
                'description': f'Found {accessible_features} wheelchair-accessible features nearby'
            }
    except Exception as e:
        print(f"Accessibility API error: {e}")
    
    return {
        'accessibility_score': 0.5,
        'description': 'Accessibility information not available'
    }

def get_traffic_info(lat, lng):
    """Get traffic information"""
    # This would typically use Google Maps Traffic API or similar
    # For demo purposes, returning mock data
    return {
        'status': 'moderate',
        'description': 'Moderate traffic conditions',
        'last_updated': datetime.now().isoformat()
    }

def get_city_story(city_name):
    """Get storytelling content for the city"""
    stories = {
        'Paris': "Paris, the City of Light, has been a center of art, fashion, and culture for centuries. From the medieval Notre-Dame to the iconic Eiffel Tower, every street tells a story of romance and revolution.",
        'London': "London, a city where ancient history meets modern innovation. From the Tower of London's medieval walls to the gleaming skyscrapers of Canary Wharf, London has been shaping world history for over 2000 years.",
        'Tokyo': "Tokyo, where tradition and technology dance in perfect harmony. From ancient temples to neon-lit streets, this metropolis represents the fascinating blend of old Japan and cutting-edge modernity.",
        'New York': "New York City, the city that never sleeps. From the Statue of Liberty welcoming immigrants to the towering skyscrapers of Manhattan, NYC embodies the American dream and endless possibilities."
    }
    
    return {
        'story': stories.get(city_name, f"Discover the unique charm and rich heritage of {city_name}, a city with countless stories waiting to be explored."),
        'audio_available': False  # Set to True if TTS is implemented
    }

@app.route('/api/directions', methods=['POST'])
def get_directions():
    """Get directions between two points"""
    data = request.json
    origin = data.get('origin')
    destination = data.get('destination')
    mode = data.get('mode', 'driving')
    
    if not origin or not destination:
        return jsonify({'error': 'Origin and destination required'}), 400
    
    if not GOOGLE_MAPS_API_KEY:
        return jsonify({'error': 'Google Maps API key not configured'}), 500
    
    try:
        url = 'https://maps.googleapis.com/maps/api/directions/json'
        params = {
            'origin': f"{origin['lat']},{origin['lng']}",
            'destination': f"{destination['lat']},{destination['lng']}",
            'mode': mode,
            'key': GOOGLE_MAPS_API_KEY
        }
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to get directions'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/street-view', methods=['GET'])
def get_street_view():
    """Get Street View image for coordinates"""
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    
    if not lat or not lng or not GOOGLE_MAPS_API_KEY:
        return jsonify({'error': 'Invalid parameters or API key not configured'}), 400
    
    street_view_url = f"https://maps.googleapis.com/maps/api/streetview?size=640x640&location={lat},{lng}&key={GOOGLE_MAPS_API_KEY}"
    
    return jsonify({'street_view_url': street_view_url})

if __name__ == '__main__':
    app.run(debug=True, port=5000)