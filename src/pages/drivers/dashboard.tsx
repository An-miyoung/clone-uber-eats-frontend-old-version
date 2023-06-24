import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = (lat, lng) => {
  return <div className="text-2xl"> 🏎</div>;
};

const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lng: 0, lat: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  const defaultProps = {
    center: {
      lat: 37.498,
      lng: 127.1,
    },
    zoom: 15,
  };

  const onSuccess = ({ coords: { latitude, longitude } }: any) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: any) => {
    console.log(error);
  };

  const handleApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    setMap(map);
    setMaps(maps);
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
  };

  const getRouteClick = () => {
    if (!map) return;
    const directionService = new google.maps.DirectionsService();
    const directionRenderer = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "red",
      },
    });
    directionRenderer.setMap(map);
    directionService.route(
      {
        origin: {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        destination: {
          location: new google.maps.LatLng(
            driverCoords.lat + 0.05,
            driverCoords.lng + 0.05
          ),
        },
        travelMode: google.maps.TravelMode.TRANSIT,
      },
      (result) => {
        directionRenderer.setDirections(result);
      }
    );
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      // const geoCoder = new google.maps.Geocoder();
      // geoCoder.geocode(
      //   {
      //     location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //   },
      //   (result, status) => {
      //     console.log(status, result);
      //   }
      // );
    }
  }, [driverCoords, map, maps]);

  return (
    <div>
      <div
        className=" overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          onGoogleApiLoaded={handleApiLoaded}
          yesIWantToUseGoogleMapApiInternals
          defaultZoom={defaultProps.zoom}
          defaultCenter={defaultProps.center}
          bootstrapURLKeys={{ key: "AIzaSyDD5YnbgZtuGyXoBiBhybuImTTCa2bIOqs" }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <button onClick={getRouteClick}>경로보기</button>
    </div>
  );
};

export default Dashboard;
